const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.sendFile(require('path').join(__dirname, '..', 'views', 'login.html'));
});

router.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ ok: false, message: 'Missing credentials' });
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    req.session.user = { email };
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, message: 'Invalid credentials' });
});

router.post('/api/logout', (req, res) => {
  req.session?.destroy(() => {
    res.json({ ok: true });
  });
});

module.exports = router;


