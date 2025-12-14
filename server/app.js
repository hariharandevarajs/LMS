const path = require('path');
const express = require('express');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Basic config
const PORT = process.env.PORT || 3000;

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions (admin auth)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax' },
  })
);

// Static assets
app.use('/static', express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Root: serve landing (placeholder; content will be added in public-pages task)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Marketing site pages
app.use(require('./routes/site'));

// Public routes
app.use(require('./routes/public'));
app.use(require('./routes/auth'));
app.use(require('./routes/leads'));
app.use(require('./routes/images'));

// 404 fallback
app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});


