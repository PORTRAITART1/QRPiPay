import express from 'express';

const router = express.Router();

// POST /api/qrcodes - Generate QR code
router.post('/', (req, res) => {
  try {
    const { amount, memo, userId } = req.body;

    if (!amount || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const qrCodeId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.status(201).json({
      success: true,
      qrCodeId,
      amount,
      memo,
      qrData: `https://pi.network/pay?id=${qrCodeId}`,
      status: 'ACTIVE',
    });
  } catch (error) {
    console.error('QR code generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// GET /api/qrcodes/:qrCodeId - Get QR code details
router.get('/:qrCodeId', (req, res) => {
  try {
    const { qrCodeId } = req.params;

    res.json({
      qrCodeId,
      amount: 100,
      memo: 'Test QR code',
      status: 'ACTIVE',
      qrData: `https://pi.network/pay?id=${qrCodeId}`,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get QR code error:', error);
    res.status(500).json({ error: 'Failed to fetch QR code' });
  }
});

// GET /api/qrcodes/user/:userId - Get user QR codes
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    res.json({
      userId,
      qrCodes: [],
      total: 0,
    });
  } catch (error) {
    console.error('Get user QR codes error:', error);
    res.status(500).json({ error: 'Failed to fetch QR codes' });
  }
});

export default router;
