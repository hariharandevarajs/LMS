const express = require('express');
const router = express.Router();
const pool = require('../db');

function isValidEmail(email) {
  return /.+@.+\..+/.test(String(email || '').toLowerCase());
}

// naive in-memory rate limit per IP (simple burst control)
const rateMap = new Map();
function allow(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const limit = 20; // 20 requests/min
  const entry = rateMap.get(ip) || [];
  const recent = entry.filter((t) => now - t < windowMs);
  if (recent.length >= limit) return false;
  recent.push(now);
  rateMap.set(ip, recent);
  return true;
}

router.post('/api/leads', async (req, res) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    if (!allow(ip)) return res.status(429).json({ ok: false, message: 'Too many requests' });
    const { name, email, phone, company, source, message, utm_source, utm_medium, utm_campaign } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({ ok: false, message: 'Name and email are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ ok: false, message: 'Invalid email' });
    }
    if (phone && String(phone).length > 50) {
      return res.status(400).json({ ok: false, message: 'Phone too long' });
    }
    if (company && String(company).length > 200) {
      return res.status(400).json({ ok: false, message: 'Company too long' });
    }
    if (source && String(source).length > 100) {
      return res.status(400).json({ ok: false, message: 'Source too long' });
    }
    if (message && String(message).length > 5000) {
      return res.status(400).json({ ok: false, message: 'Message too long' });
    }

    // Normalize campaign source: Google ads -> google, Meta/Facebook -> meta, else -> organic
    let normalized_source = null;
    if (utm_source) {
      const src = String(utm_source).toLowerCase();
      if (src.includes('google') || src.includes('gclid')) {
        normalized_source = 'google';
      } else if (src.includes('facebook') || src.includes('meta') || src.includes('fb')) {
        normalized_source = 'meta';
      } else {
        normalized_source = src;
      }
    } else {
      normalized_source = 'organic';
    }

    const result = await pool`
      INSERT INTO leads (name, email, phone, company, source, message, utm_source, utm_medium, utm_campaign) 
      VALUES (${name}, ${email}, ${phone || null}, ${company || null}, ${source || null}, ${message || null}, ${normalized_source}, ${utm_medium || null}, ${utm_campaign || null})
      RETURNING id
    `;

    return res.status(201).json({ ok: true, id: result[0].id });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Create lead error:', err);
    return res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

module.exports = router;


