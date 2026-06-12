const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const piAuthService = require('../services/piAuth.service.js');

const prisma = new PrismaClient();

// Pi Authentication Callback
router.post('/callback', async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: 'accessToken required' });
    }

    // Valide le token Pi
    const validation = await piAuthService.validateAccessToken(accessToken);
    
    if (!validation.success) {
      return res.status(401).json({ error: validation.error });
    }

    const piUser = validation.user;

    // Crée ou met à jour l'utilisateur en base
    const user = await prisma.user.upsert({
      where: { piAddress: piUser.uid },
      update: { verified: true },
      create: {
        piAddress: piUser.uid,
        username: piUser.username || piUser.uid,
        email: piUser.email || null,
        verified: true
      }
    });

    // Génère un JWT session
    const token = jwt.sign(
      { 
        id: user.id,
        piAddress: user.piAddress,
        username: user.username
      },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        piAddress: user.piAddress,
        username: user.username,
        verified: user.verified
      },
      token: token,
      message: '✅ Authenticated with Pi Network'
    });

  } catch (error) {
    console.error('❌ Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
