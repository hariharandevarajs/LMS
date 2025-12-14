const path = require('path');
const express = require('express');
const router = express.Router();

function serve(view) {
  return (req, res) => res.sendFile(path.join(__dirname, '..', 'views', view));
}

router.get('/home', serve('home.html'));
router.get('/about', serve('about.html'));
router.get('/products', serve('products.html'));
router.get('/contact', serve('contact.html'));

module.exports = router;






