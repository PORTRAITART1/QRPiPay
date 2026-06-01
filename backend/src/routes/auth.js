const express = require('express');
const router = express.Router();
const PiNetworkClient = require('../services/piClient.js');
const piAuth = require('../middleware/piAuth.js');

const piClient = new PiNetworkClient(
  process.env.PI_API_KEY,
  process.env.PI_APP_ID
);

router.post('/login', piAuth, async (req, res) => {
  try {
    const { piAddress, piSignature } = req;
    
    // Vérifie l'authentification Pi
    const verification = await piClient.verifyUser(piAddress, piSignature);
    
    if (!verification.success) {
      return res.status(401).json({ error: 'Pi authentication failed' });
    }

    res.json({
      success: true,
      user: {
        id: piAddress,
        piAddress: piAddress,
        verified: true
      },
      token: 'jwt_pi_token_here'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/register', async (req, res) => {
  res.json({ success: true, message: 'User registered with Pi' });
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

router.get('/me', piAuth, (req, res) => {
  res.json({
    id: req.piAddress,
    piAddress: req.piAddress,
    verified: true
  });
});

module.exports = router;

