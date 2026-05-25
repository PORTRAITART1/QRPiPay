const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
});

app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Status
app.get('/api/status', (req, res) => {
  res.json({
    app: 'QRPiPay Backend',
    version: '2.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/payments', require('./routes/payments.js'));
app.use('/api/qrcodes', require('./routes/qrcodes.js'));
app.use('/api/users', require('./routes/users.js'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
