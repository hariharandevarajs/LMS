// Capture UTM parameters from URL
function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || null,
    utm_medium: params.get('utm_medium') || null,
    utm_campaign: params.get('utm_campaign') || null,
  };
}

// Store UTM params in sessionStorage to persist across page navigation
function storeUTMParams() {
  const utm = getUTMParams();
  if (utm.utm_source || utm.utm_medium || utm.utm_campaign) {
    sessionStorage.setItem('utm_params', JSON.stringify(utm));
  }
}

// Get stored UTM params (from URL or sessionStorage)
function getStoredUTMParams() {
  const urlParams = getUTMParams();
  if (urlParams.utm_source || urlParams.utm_medium || urlParams.utm_campaign) {
    return urlParams;
  }
  const stored = sessionStorage.getItem('utm_params');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return {};
    }
  }
  return {};
}

document.addEventListener('DOMContentLoaded', () => {
  // Store UTM params when page loads
  storeUTMParams();

  const form = document.getElementById('lead-form');
  const toast = document.getElementById('toast');

  function showToast(message, ok = true) {
    if (toast) {
      toast.style.display = 'block';
      toast.textContent = message;
      toast.style.color = ok ? '#9fffb2' : '#ffb3b3';
    }
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(form).entries());
      const utmParams = getStoredUTMParams();
      
      // Merge form data with UTM params
      const data = { ...formData, ...utmParams };
      
      if (!data.name || !data.email) {
        showToast('Name and Email are required', false);
        return;
      }
      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.message || 'Failed to submit');
        form.reset();
        showToast('Thanks! Your details have been submitted.');
        // Clear stored UTM params after successful submission
        sessionStorage.removeItem('utm_params');
      } catch (err) {
        showToast(err.message || 'Something went wrong', false);
      }
    });
  }
});



