/**
 * 🚀 Express Server - QRPiPay Backend
 * Jour 3: Avec PostgreSQL + Prisma
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import dotenv from 'dotenv';
import prisma from './lib/prisma';
import paymentsRouter from './routes/payments';
import analyticsRouter from './routes/analytics';
import usersRouter from './routes/users';
import exportRouter from './routes/export';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Rate limiter
const rateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 15 * 60,
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Rate limiting middleware
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await rateLimiter.consume(req.ip || 'unknown');
    next();
  } catch (error: unknown) {
    res.status(429).json({ error: 'Too many requests' });
  }
});

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API status
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    app: 'QRPiPay Backend',
    version: '1.0.0',
    status: 'running',
    database: 'PostgreSQL + Prisma',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/payments', paymentsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/users', usersRouter);
app.use('/api/export', exportRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR]', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️  Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(port, () => {
  console.log(`🚀 QRPiPay Backend running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`📋 API Status: http://localhost:${port}/api/status`);
  console.log(`💳 Payments API: http://localhost:${port}/api/payments`);
  console.log(`📈 Analytics API: http://localhost:${port}/api/analytics`);
  console.log(`📥 Export API: http://localhost:${port}/api/export`);
  console.log(`🗄️  Database: PostgreSQL + Prisma`);
});

