const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
require('dotenv').config();

const WebSocketService = require('./services/websocket.service.js');

const app = express();
const server = http.createServer(app);

// WebSocket
const wsService = new WebSocketService(server);

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: '⚠️ Too many requests, please try again later'
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
    piIntegration: !!process.env.PI_API_KEY,
    websocket: 'enabled',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/payments', require('./routes/payments.js'));
app.use('/api/qrcodes', require('./routes/qrcodes.js'));
app.use('/api/users', require('./routes/users.js'));
app.use('/api/analytics', require('./routes/analytics.js'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`📡 Pi Network Integration: ${process.env.PI_API_KEY ? 'ENABLED' : 'DISABLED'}`);
  console.log(`🔒 Security: Helmet + CORS + Rate Limiting enabled`);
  console.log(`🔌 WebSocket: Connected`);
});

module.exports = { app, wsService };
