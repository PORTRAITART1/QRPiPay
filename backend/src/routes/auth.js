const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const prisma = new PrismaClient();

/**
 * Validate Pi Network Access Token
 * Frontend sends accessToken, backend verifies with Pi API
 */
router.post('/validate-token', async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ 
        valid: false, 
        error: 'Access token required' 
      });
    }

    // Validate token with Pi API
    // GET https://api.minepi.com/v2/me with Authorization: Bearer <accessToken>
    const response = await axios.get('https://api.minepi.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const piUser = response.data;

    if (!piUser || !piUser.uid) {
      return res.status(401).json({ 
        valid: false, 
        error: 'Invalid Pi token' 
      });
    }

    // Create or update user in database
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

    // Generate session token (JWT)
    const sessionToken = jwt.sign(
      { 
        id: user.id,
        piAddress: user.piAddress,
        username: user.username,
        piUid: piUser.uid
      },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '24h' }
    );

    res.json({
      valid: true,
      user: {
        id: user.id,
        piAddress: user.piAddress,
        username: user.username,
        verified: user.verified
      },
      sessionToken: sessionToken,
      message: '✅ Token validated successfully'
    });

  } catch (error) {
    console.error('❌ Token validation error:', error.response?.data || error.message);
    
    return res.status(401).json({ 
      valid: false, 
      error: 'Token validation failed: ' + (error.response?.data?.error || error.message)
    });
  }
});

/**
 * Get current authenticated user
 */
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

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        piAddress: user.piAddress,
        username: user.username,
        verified: user.verified
      }
    });
  } catch (error) {
    console.error('❌ Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

/**
 * Logout (frontend should clear session)
 */
router.post('/logout', (req, res) => {
  // Frontend clears token from storage
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
});

module.exports = router;
