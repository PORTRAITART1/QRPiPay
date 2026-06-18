const socketIO = require('socket.io');

class WebSocketService {
  constructor(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`✅ Client connecté: ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`❌ Client déconnecté: ${socket.id}`);
      });

      socket.on('user:join', (data) => {
        console.log(`👤 User joined:`, data);
        socket.join(`user:${data.userId}`);
      });

      socket.on('payment:initiated', (data) => {
        this.io.to(`user:${data.userId}`).emit('payment:status', {
          status: 'pending',
          paymentId: data.paymentId,
          amount: data.amount
        });
      });
    });
  }

  emitPaymentUpdate(userId, paymentId, status, data) {
    this.io.to(`user:${userId}`).emit('payment:updated', {
      paymentId,
      status,
      ...data
    });
  }

  emitPaymentCompleted(userId, paymentId, txHash) {
    this.io.to(`user:${userId}`).emit('payment:completed', {
      paymentId,
      txHash,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = WebSocketService;
