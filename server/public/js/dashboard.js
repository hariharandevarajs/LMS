async function fetchLeads({ status = '', search = '', page = 1, pageSize = 10 } = {}) {
  const params = new URLSearchParams({ page, pageSize });
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  const res = await fetch(`/api/leads?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load leads');
  return res.json();
}

async function fetchSummary() {
  const res = await fetch('/api/leads/summary');
  if (!res.ok) throw new Error('Failed to load summary');
  return res.json();
}

async function fetchCampaigns() {
  const res = await fetch('/api/leads/campaigns');
  if (!res.ok) throw new Error('Failed to load campaigns');
  return res.json();
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getCampaignLabel(utmSource) {
  if (!utmSource) return 'Organic';
  const src = String(utmSource).toLowerCase();
  if (src === 'google') return 'Google Ads';
  if (src === 'meta') return 'Meta/Facebook';
  if (src === 'organic') return 'Organic';
  return utmSource;
}

function renderLeads(list = []) {
  const tbody = document.getElementById('leadsBody');
  tbody.innerHTML = list.map(l => `
    <tr>
      <td>${escapeHtml(l.name)}</td>
      <td>${escapeHtml(l.email)}</td>
      <td>${escapeHtml(l.phone || '')}</td>
      <td>${escapeHtml(l.company || '')}</td>
      <td>${escapeHtml(l.source || '')}</td>
      <td>${escapeHtml(getCampaignLabel(l.utm_source))}</td>
      <td>${new Date(l.created_at).toLocaleString()}</td>
      <td>
        <select data-id="${l.id}" class="status-select">
          ${['New','Contacted','Qualified','Won','Lost'].map(s => `<option ${s===l.status?'selected':''}>${s}</option>`).join('')}
        </select>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('select.status-select').forEach(sel => {
    sel.addEventListener('change', async (e) => {
      const id = e.target.getAttribute('data-id');
      const status = e.target.value;
      const res = await fetch(`/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        showToast('Failed to update status', false);
      } else {
        showToast('Status updated');
        await loadData();
      }
    });
  });
}

function showToast(message, ok = true) {
  const toast = document.getElementById('toast');
  toast.style.display = 'block';
  toast.textContent = message;
  toast.style.color = ok ? '#9fffb2' : '#ffb3b3';
}

async function init() {
  const statusFilter = document.getElementById('statusFilter');
  const search = document.getElementById('search');
  window.__page = 1;
  async function load() {
    try {
      const data = await fetchLeads({ status: statusFilter.value, search: search.value, page: window.__page });
      renderLeads(data.items || []);
      renderPager(data.page || 1, Math.ceil((data.total || 0) / (data.pageSize || 10)) || 1);
      const [summary, campaigns] = await Promise.all([fetchSummary(), fetchCampaigns()]);
      renderSummary(summary.summary || {});
      renderCampaigns(campaigns.campaigns || {});
    } catch (e) {
      showToast(e.message, false);
    }
  }
  statusFilter.addEventListener('change', load);
  search.addEventListener('input', () => {
    clearTimeout(window.__t);
    window.__t = setTimeout(load, 250);
  });
  const logoutForm = document.getElementById('logoutForm');
  logoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await fetch('/api/logout', { method: 'POST' });
    location.href = '/login';
  });
  await load();
}

document.addEventListener('DOMContentLoaded', init);

function renderSummary(s) {
  document.getElementById('count-total').textContent = s.total ?? 0;
  document.getElementById('count-new').textContent = s.New ?? 0;
  document.getElementById('count-contacted').textContent = s.Contacted ?? 0;
  document.getElementById('count-qualified').textContent = s.Qualified ?? 0;
  document.getElementById('count-won').textContent = s.Won ?? 0;
  document.getElementById('count-lost').textContent = s.Lost ?? 0;
}

function renderCampaigns(c) {
  document.getElementById('campaign-google').textContent = c.google ?? 0;
  document.getElementById('campaign-meta').textContent = c.meta ?? 0;
  document.getElementById('campaign-organic').textContent = c.organic ?? 0;
  document.getElementById('campaign-other').textContent = c.other ?? 0;
}

function renderPager(page, totalPages) {
  const pager = document.getElementById('pager');
  pager.innerHTML = '';
  const mkBtn = (label, disabled, onClick) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.className = 'btn';
    b.style.marginRight = '8px';
    if (disabled) b.disabled = true;
    b.addEventListener('click', onClick);
    return b;
  };
  pager.appendChild(mkBtn('Prev', page <= 1, () => { window.__page = Math.max(1, page - 1); loadData(); }));
  const label = document.createElement('span');
  label.style.marginRight = '8px';
  label.textContent = `Page ${page} of ${totalPages}`;
  pager.appendChild(label);
  pager.appendChild(mkBtn('Next', page >= totalPages, () => { window.__page = Math.min(totalPages, page + 1); loadData(); }));
}

async function loadData() {
  const statusFilter = document.getElementById('statusFilter');
  const search = document.getElementById('search');
  try {
    const data = await fetchLeads({ status: statusFilter.value, search: search.value, page: window.__page });
    renderLeads(data.items || []);
    renderPager(data.page || 1, Math.ceil((data.total || 0) / (data.pageSize || 10)) || 1);
    const [summary, campaigns] = await Promise.all([fetchSummary(), fetchCampaigns()]);
    renderSummary(summary.summary || {});
    renderCampaigns(campaigns.campaigns || {});
  } catch (e) {
    showToast(e.message, false);
  }
}



