const express = require('express');
const router = express.Router();

// In-memory cache to reduce API calls
const cache = new Map();

async function fetchGoogleImage(query) {
  const key = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CSE_ID;
  if (!key || !cx) {
    throw new Error('Missing GOOGLE_API_KEY or GOOGLE_CSE_ID');
  }
  const url = new URL('https://www.googleapis.com/customsearch/v1');
  url.searchParams.set('key', key);
  url.searchParams.set('cx', cx);
  url.searchParams.set('q', query);
  url.searchParams.set('searchType', 'image');
  url.searchParams.set('num', '3');
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google API error: ${res.status} ${text}`);
  }
  const data = await res.json();
  const items = data.items || [];
  if (!items.length) return null;
  return items[0].link;
}

router.get('/api/images', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) return res.status(400).json({ ok: false, message: 'Missing q' });
    const cached = cache.get(q);
    if (cached && Date.now() - cached.t < 1000 * 60 * 60) {
      return res.json({ ok: true, url: cached.url, cached: true });
    }
    const url = await fetchGoogleImage(q);
    if (!url) return res.status(404).json({ ok: false, message: 'No image found' });
    cache.set(q, { url, t: Date.now() });
    res.json({ ok: true, url });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Image fetch error:', err.message);
    res.status(500).json({ ok: false, message: 'Image fetch failed' });
  }
});

module.exports = router;






