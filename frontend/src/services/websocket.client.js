/**
 * WebSocket Client Service
 * Real-time communication with backend
 */

import io from 'socket.io-client';

class WebSocketClient {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  /**
   * Connect to WebSocket server
   */
  connect(userId) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const baseUrl = apiUrl.replace('/api', ''); // Remove /api from URL

    this.socket = io(baseUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });

    this.setupListeners();
    this.joinUser(userId);

    console.log('🔌 WebSocket connected');
  }

  /**
   * Setup socket listeners
   */
  setupListeners() {
    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
      this.emit('socket:connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.emit('socket:disconnected', { reason });
    });

    this.socket.on('user:connected', (data) => {
      console.log('👤 User connected:', data);
      this.emit('user:connected', data);
    });

    // Payment events
    this.socket.on('payment:status', (data) => {
      console.log('💳 Payment status:', data);
      this.emit('payment:status', data);
    });

    this.socket.on('payment:completed', (data) => {
      console.log('✅ Payment completed:', data);
      this.emit('payment:completed', data);
    });

    this.socket.on('payment:updated', (data) => {
      console.log('🔄 Payment updated:', data);
      this.emit('payment:updated', data);
    });

    // QR Code events
    this.socket.on('qrcode:status', (data) => {
      console.log('📱 QR Code status:', data);
      this.emit('qrcode:status', data);
    });

    // Notifications
    this.socket.on('notification:received', (data) => {
      console.log('🔔 Notification:', data);
      this.emit('notification:received', data);
    });

    // Analytics
    this.socket.on('analytics:updated', (data) => {
      console.log('📊 Analytics updated:', data);
      this.emit('analytics:updated', data);
    });

    // System status
    this.socket.on('system:status', (data) => {
      console.log('📢 System status:', data);
      this.emit('system:status', data);
    });

    // Error handling
    this.socket.on('error', (error) => {
      console.error('⚠️ Socket error:', error);
      this.emit('socket:error', { error });
    });
  }

  /**
   * Register event listener
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Emit local event
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * User join room
   */
  joinUser(userId) {
    if (this.socket) {
      this.socket.emit('user:join', {
        userId,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * User leave room
   */
  leaveUser(userId) {
    if (this.socket) {
      this.socket.emit('user:leave', { userId });
    }
  }

  /**
   * Payment initiated
   */
  paymentInitiated(paymentId, amount, description) {
    if (this.socket) {
      this.socket.emit('payment:initiated', {
        paymentId,
        amount,
        description,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Payment processing
   */
  paymentProcessing(paymentId) {
    if (this.socket) {
      this.socket.emit('payment:processing', {
        paymentId,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Payment approved
   */
  paymentApproved(paymentId, txHash) {
    if (this.socket) {
      this.socket.emit('payment:approved', {
        paymentId,
        txHash,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Payment failed
   */
  paymentFailed(paymentId, error) {
    if (this.socket) {
      this.socket.emit('payment:failed', {
        paymentId,
        error,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * QR Code generated
   */
  qrCodeGenerated(qrCodeId, amount) {
    if (this.socket) {
      this.socket.emit('qrcode:generated', {
        qrCodeId,
        amount,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Subscribe to notifications
   */
  subscribeToNotifications(userId) {
    if (this.socket) {
      this.socket.emit('notification:subscribe', { userId });
    }
  }

  /**
   * Request analytics
   */
  requestAnalytics(userId, days = 7) {
    if (this.socket) {
      this.socket.emit('analytics:request', {
        userId,
        days,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Disconnect
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('🔌 WebSocket disconnected');
    }
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.socket && this.socket.connected;
  }
}

// Export singleton instance
export const wsClient = new WebSocketClient();

export default WebSocketClient;
