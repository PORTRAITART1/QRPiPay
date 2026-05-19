import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/index.js';
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payments.js';
import userRoutes from './routes/users.js';
import qrcodeRoutes from './routes/qrcodes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
}));

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Status
app.get('/api/status', (req, res) => {
  res.json({
    app: 'QRPiPay Backend',
    version: '2.0.0',
    status: 'running',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/qrcodes', qrcodeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`✅ QRPiPay Backend v2.0.0 running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`💳 API: http://localhost:${PORT}/api`);
});

export default app;
