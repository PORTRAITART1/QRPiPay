const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const loggingMiddleware = require('./middleware/logging.js');
const logger = require('./services/logger.service.js');
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
app.use(loggingMiddleware);

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
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error({
    error: message,
    statusCode: statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(statusCode).json({
    error: message,
    statusCode: statusCode,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  logger.info(`🚀 Backend running on port ${PORT}`);
  logger.info(`📡 Pi Network Integration: ${process.env.PI_API_KEY ? 'ENABLED' : 'DISABLED'}`);
  logger.info(`🔒 Security: Helmet + CORS + Rate Limiting enabled`);
  logger.info(`🔌 WebSocket: Connected`);
});

module.exports = { app, wsService };
