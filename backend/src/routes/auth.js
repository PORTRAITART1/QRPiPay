const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  res.json({
    success: true,
    user: { id: '1', username },
    token: 'jwt_token_here'
  });
});

router.post('/register', (req, res) => {
  res.json({ success: true, message: 'User registered' });
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

router.get('/me', (req, res) => {
  res.json({ id: '1', username: 'user', email: 'user@example.com' });
});

module.exports = router;
