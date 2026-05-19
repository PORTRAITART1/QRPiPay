import express from 'express';

const router = express.Router();

// POST /api/auth/login - Login user
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }

    res.json({
      success: true,
      user: { id: '1', username },
      token: 'jwt_token_here',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/register - Register user
router.post('/register', (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    res.status(201).json({
      success: true,
      user: { id: '1', username, email },
      token: 'jwt_token_here',
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/logout - Logout user
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

// GET /api/auth/me - Get current user
router.get('/me', (req, res) => {
  res.json({
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
  });
});

export default router;
