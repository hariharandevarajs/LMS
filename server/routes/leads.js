const path = require('path');
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const pool = require('../db');

router.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'));
});

// Summary counts by status
router.get('/api/leads/summary', requireAuth, async (req, res) => {
  try {
    const rows = await pool`
      SELECT status, COUNT(*) as count FROM leads GROUP BY status
    `;
    const summary = { total: 0, New: 0, Contacted: 0, Qualified: 0, Won: 0, Lost: 0 };
    for (const r of rows) {
      summary[r.status] = Number(r.count);
      summary.total += Number(r.count);
    }
    res.json({ ok: true, summary });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Summary error:', err);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

// Campaign analytics
router.get('/api/leads/campaigns', requireAuth, async (req, res) => {
  try {
    const rows = await pool`
      SELECT utm_source, COUNT(*) as count FROM leads GROUP BY utm_source
    `;
    const campaigns = { google: 0, meta: 0, organic: 0, other: 0, total: 0 };
    for (const r of rows) {
      const source = (r.utm_source || 'organic').toLowerCase();
      const count = Number(r.count);
      if (source === 'google') {
        campaigns.google = count;
      } else if (source === 'meta') {
        campaigns.meta = count;
      } else if (source === 'organic') {
        campaigns.organic = count;
      } else {
        campaigns.other += count;
      }
      campaigns.total += count;
    }
    res.json({ ok: true, campaigns });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Campaign analytics error:', err);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

// List leads with filters and pagination
router.get('/api/leads', requireAuth, async (req, res) => {
  try {
    const { status = '', search = '', page = '1', pageSize = '10' } = req.query;
    const limit = Math.min(Math.max(parseInt(pageSize, 10) || 10, 1), 100);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * limit;
    
    // Build queries conditionally using template literals
    let rows;
    let countResult;
    
    if (status && search) {
      const searchPattern = `%${search}%`;
      rows = await pool`
        SELECT id, name, email, phone, company, source, status, utm_source, created_at
        FROM leads
        WHERE status = ${status} AND (name LIKE ${searchPattern} OR email LIKE ${searchPattern} OR company LIKE ${searchPattern})
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await pool`
        SELECT COUNT(*) as total FROM leads
        WHERE status = ${status} AND (name LIKE ${searchPattern} OR email LIKE ${searchPattern} OR company LIKE ${searchPattern})
      `;
    } else if (status) {
      rows = await pool`
        SELECT id, name, email, phone, company, source, status, utm_source, created_at
        FROM leads
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await pool`
        SELECT COUNT(*) as total FROM leads WHERE status = ${status}
      `;
    } else if (search) {
      const searchPattern = `%${search}%`;
      rows = await pool`
        SELECT id, name, email, phone, company, source, status, utm_source, created_at
        FROM leads
        WHERE name LIKE ${searchPattern} OR email LIKE ${searchPattern} OR company LIKE ${searchPattern}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await pool`
        SELECT COUNT(*) as total FROM leads
        WHERE name LIKE ${searchPattern} OR email LIKE ${searchPattern} OR company LIKE ${searchPattern}
      `;
    } else {
      rows = await pool`
        SELECT id, name, email, phone, company, source, status, utm_source, created_at
        FROM leads
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await pool`
        SELECT COUNT(*) as total FROM leads
      `;
    }
    
    const total = Number(countResult[0].total);
    
    res.json({ ok: true, items: rows, total, page: Number(page), pageSize: limit });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('List leads error:', err);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

// Lead details
router.get('/api/leads/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const rows = await pool`
      SELECT id, name, email, phone, company, source, message, status, created_at FROM leads WHERE id = ${id}
    `;
    if (!rows.length) return res.status(404).json({ ok: false, message: 'Not found' });
    res.json({ ok: true, item: rows[0] });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Get lead error:', err);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

// Update status
router.patch('/api/leads/:id/status', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body || {};
    const allowed = ['New', 'Contacted', 'Qualified', 'Won', 'Lost'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ ok: false, message: 'Invalid status' });
    }
    const result = await pool`
      UPDATE leads SET status = ${status} WHERE id = ${id}
    `;
    if (result.count === 0) return res.status(404).json({ ok: false, message: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Update status error:', err);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

module.exports = router;


