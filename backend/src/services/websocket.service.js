const socketIO = require('socket.io');
const logger = require('./logger.service');

/**
 * WebSocket Service - Real-time Communication
 * Handles payment updates, notifications, and live events
 */

class WebSocketService {
  constructor(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.setupEventHandlers();
    this.setupMiddleware();
  }

  setupMiddleware() {
    this.io.use((socket, next) => {
      logger.info(`🔌 WebSocket middleware - Client: ${socket.id}`);
      next();
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`✅ Client connecté: ${socket.id}`);

      /**
       * USER EVENTS
       */
      socket.on('user:join', (data) => {
        const { userId, username } = data;
        socket.join(`user:${userId}`);
        logger.info(`👤 User joined - ID: ${userId}, Name: ${username}`);
        
        // Notify user they're connected
        socket.emit('user:connected', {
          status: 'connected',
          timestamp: new Date().toISOString()
        });
      });

      socket.on('user:leave', (data) => {
        const { userId } = data;
        socket.leave(`user:${userId}`);
        logger.info(`👤 User left - ID: ${userId}`);
      });

      /**
       * PAYMENT EVENTS - Real-time Updates
       */
      socket.on('payment:initiated', (data) => {
        const { userId, paymentId, amount, description } = data;
        logger.info(`💳 Payment initiated - ID: ${paymentId}, Amount: ${amount}`);
        
        this.io.to(`user:${userId}`).emit('payment:status', {
          event: 'payment:initiated',
          status: 'pending',
          paymentId,
          amount,
          description,
          timestamp: new Date().toISOString()
        });
      });

      socket.on('payment:processing', (data) => {
        const { userId, paymentId } = data;
        logger.info(`⏳ Payment processing - ID: ${paymentId}`);
        
        this.io.to(`user:${userId}`).emit('payment:status', {
          event: 'payment:processing',
          status: 'processing',
          paymentId,
          timestamp: new Date().toISOString()
        });
      });

      socket.on('payment:approved', (data) => {
        const { userId, paymentId, txHash } = data;
        logger.info(`✅ Payment approved - ID: ${paymentId}`);
        
        this.io.to(`user:${userId}`).emit('payment:status', {
          event: 'payment:approved',
          status: 'completed',
          paymentId,
          txHash,
          timestamp: new Date().toISOString()
        });
      });

      socket.on('payment:failed', (data) => {
        const { userId, paymentId, error } = data;
        logger.error(`❌ Payment failed - ID: ${paymentId}, Error: ${error}`);
        
        this.io.to(`user:${userId}`).emit('payment:status', {
          event: 'payment:failed',
          status: 'failed',
          paymentId,
          error,
          timestamp: new Date().toISOString()
        });
      });

      /**
       * QR CODE EVENTS
       */
      socket.on('qrcode:generated', (data) => {
        const { userId, qrCodeId, amount } = data;
        logger.info(`📱 QR Code generated - ID: ${qrCodeId}`);
        
        this.io.to(`user:${userId}`).emit('qrcode:status', {
          event: 'qrcode:generated',
          qrCodeId,
          amount,
          timestamp: new Date().toISOString()
        });
      });

      socket.on('qrcode:scanned', (data) => {
        const { userId, qrCodeId } = data;
        logger.info(`👁️ QR Code scanned - ID: ${qrCodeId}`);
        
        this.io.to(`user:${userId}`).emit('qrcode:status', {
          event: 'qrcode:scanned',
          qrCodeId,
          timestamp: new Date().toISOString()
        });
      });

      /**
       * NOTIFICATION EVENTS
       */
      socket.on('notification:subscribe', (data) => {
        const { userId } = data;
        socket.join(`notifications:${userId}`);
        logger.info(`🔔 User subscribed to notifications - ID: ${userId}`);
      });

      /**
       * ANALYTICS EVENTS
       */
      socket.on('analytics:request', (data) => {
        const { userId, days } = data;
        logger.info(`📊 Analytics requested - User: ${userId}, Days: ${days}`);
        
        socket.emit('analytics:update', {
          userId,
          data: {
            // Analytics data will be sent from backend
            timestamp: new Date().toISOString()
          }
        });
      });

      /**
       * DISCONNECT EVENT
       */
      socket.on('disconnect', (reason) => {
        logger.info(`❌ Client déconnecté: ${socket.id} - Reason: ${reason}`);
      });

      /**
       * ERROR HANDLING
       */
      socket.on('error', (error) => {
        logger.error(`⚠️ Socket error: ${error}`);
      });
    });
  }

  /**
   * Emit payment update to specific user
   */
  emitPaymentUpdate(userId, paymentId, status, data = {}) {
    this.io.to(`user:${userId}`).emit('payment:updated', {
      paymentId,
      status,
      ...data,
      timestamp: new Date().toISOString()
    });
    logger.info(`💳 Payment update sent - User: ${userId}, Payment: ${paymentId}, Status: ${status}`);
  }

  /**
   * Emit payment completed event
   */
  emitPaymentCompleted(userId, paymentId, txHash) {
    this.io.to(`user:${userId}`).emit('payment:completed', {
      paymentId,
      txHash,
      status: 'completed',
      timestamp: new Date().toISOString()
    });
    logger.info(`✅ Payment completed event sent - User: ${userId}, Payment: ${paymentId}`);
  }

  /**
   * Emit notification to user
   */
  emitNotification(userId, type, title, message, data = {}) {
    this.io.to(`notifications:${userId}`).emit('notification:received', {
      type, // 'success', 'error', 'warning', 'info'
      title,
      message,
      ...data,
      timestamp: new Date().toISOString()
    });
    logger.info(`🔔 Notification sent - User: ${userId}, Type: ${type}`);
  }

  /**
   * Emit analytics update
   */
  emitAnalyticsUpdate(userId, analyticsData) {
    this.io.to(`user:${userId}`).emit('analytics:updated', {
      data: analyticsData,
      timestamp: new Date().toISOString()
    });
    logger.info(`📊 Analytics update sent - User: ${userId}`);
  }

  /**
   * Broadcast to all connected users
   */
  broadcastStatus(status) {
    this.io.emit('system:status', {
      status,
      timestamp: new Date().toISOString()
    });
    logger.info(`📢 Broadcast sent - Status: ${status}`);
  }

  /**
   * Get number of connected clients
   */
  getConnectedClientsCount() {
    return this.io.engine.clientsCount;
  }

  /**
   * Get connected users in room
   */
  getClientsInRoom(roomName) {
    return this.io.sockets.adapter.rooms.get(roomName);
  }
}

module.exports = WebSocketService;
