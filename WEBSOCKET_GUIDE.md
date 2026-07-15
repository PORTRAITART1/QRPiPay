# 🔌 WebSocket Real-Time Guide

**Date:** $(date)
**Status:** ✅ Ready to Use
**Version:** 1.0

---

## 📋 Overview

WebSocket implementation for real-time payment updates, notifications, and analytics in QRPiPay.

### Technologies
- Backend: Socket.io (Node.js)
- Frontend: Socket.io Client (React)
- Transport: WebSocket + Polling fallback

---

## 🚀 Backend Usage

### Connect Socket.io
```javascript
const WebSocketService = require('./services/websocket.service.js');

const server = http.createServer(app);
const wsService = new WebSocketService(server);

server.listen(3001);
```

### Emit Payment Updates
```javascript
// Payment completed
wsService.emitPaymentCompleted(userId, paymentId, txHash);

// Payment update
wsService.emitPaymentUpdate(userId, paymentId, 'completed', {
  amount: 100,
  buyerName: 'John'
});

// Send notification
wsService.emitNotification(userId, 'success', 'Payment Received', 'Your payment of 100 Pi was successful!');

// Analytics update
wsService.emitAnalyticsUpdate(userId, {
  totalPayments: 45,
  totalAmount: 1250,
  today: 5
});
```

### Available Events
```javascript
// Payment events
'payment:initiated' - Payment starts
'payment:processing' - Payment being processed
'payment:approved' - Payment completed
'payment:failed' - Payment failed

// QR Code events
'qrcode:generated' - QR code created
'qrcode:scanned' - QR code scanned

// User events
'user:join' - User connected
'user:leave' - User disconnected

// Notification events
'notification:subscribe' - Subscribe to notifications
```

---

## 🎨 Frontend Usage

### 1. Initialize in App.tsx
```typescript
import { useWebSocket } from './hooks/useWebSocket';
import { useAuth } from './context/AuthContext';

export function App() {
  const { user } = useAuth();
  
  // Initialize WebSocket
  const ws = useWebSocket(user?.id);

  useEffect(() => {
    // Listen for payment updates
    ws.on('payment:status', (data) => {
      console.log('Payment status:', data);
      // Update UI with payment status
    });

    // Listen for notifications
    ws.on('notification:received', (data) => {
      console.log('Notification:', data);
      // Show toast notification
      showToast(data.title, data.message, data.type);
    });
  }, [ws]);

  return <AppRoutes />;
}
```

### 2. Use in Payment Component
```typescript
import { useWebSocket } from '../hooks/useWebSocket';

export function PaymentPage() {
  const { user } = useAuth();
  const ws = useWebSocket(user?.id);

  const handlePayment = async (amount) => {
    // 1. Initiate payment
    const response = await api.post('/payments', { amount });
    const paymentId = response.data.id;

    // 2. Notify via WebSocket
    ws.paymentInitiated(paymentId, amount, 'QR Payment');

    // 3. Listen for completion
    ws.on('payment:completed', (data) => {
      if (data.paymentId === paymentId) {
        console.log('Payment completed!', data.txHash);
        // Redirect to success page
      }
    });
  };

  return (
    <div>
      <button onClick={() => handlePayment(100)}>
        Pay 100 Pi
      </button>
    </div>
  );
}
```

### 3. Listen for Real-time Updates
```typescript
import { useWebSocket } from '../hooks/useWebSocket';
import { useEffect, useState } from 'react';

export function Dashboard() {
  const { user } = useAuth();
  const ws = useWebSocket(user?.id);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Subscribe to notifications
    ws.subscribeToNotifications();

    // Listen for payment updates
    ws.on('payment:updated', (data) => {
      setPayments(prev => 
        prev.map(p => p.id === data.paymentId ? { ...p, status: data.status } : p)
      );
    });

    // Listen for analytics updates
    ws.on('analytics:updated', (data) => {
      console.log('New analytics:', data.data);
      // Update dashboard metrics
    });
  }, [ws]);

  return (
    <div>
      <h1>Dashboard</h1>
      <PaymentsList payments={payments} />
    </div>
  );
}
```

### 4. Custom Hook Pattern
```typescript
// Custom hook for payment monitoring
import { useWebSocket } from '../hooks/useWebSocket';
import { useEffect, useState } from 'react';

export function usePaymentMonitor(paymentId) {
  const { user } = useAuth();
  const ws = useWebSocket(user?.id);
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    ws.on('payment:status', (data) => {
      if (data.paymentId === paymentId) {
        setStatus(data.status);
      }
    });
  }, [paymentId, ws]);

  return { status };
}

// Usage in component
export function PaymentStatus({ paymentId }) {
  const { status } = usePaymentMonitor(paymentId);
  
  return <div>Status: {status}</div>;
}
```

---

## 🔄 Real-Time Flow Example

### Payment Workflow
```
1. Frontend: User clicks "Pay"
   → ws.paymentInitiated(paymentId, amount, description)

2. Backend: Processes payment
   → wsService.emitPaymentUpdate(userId, paymentId, 'processing')

3. Frontend: Receives update
   → on('payment:status', data) → Shows "Processing..."

4. Backend: Payment approved
   → wsService.emitPaymentCompleted(userId, paymentId, txHash)

5. Frontend: Receives completion
   → on('payment:completed', data) → Shows "Success!"
   → Redirect to confirmation page

6. Backend: Sends notification
   → wsService.emitNotification(userId, 'success', 'Payment Received', ...)

7. Frontend: Shows notification
   → on('notification:received', data) → showToast(data)
```

---

## 📊 Analytics Real-Time

### Request Analytics
```javascript
const ws = useWebSocket(userId);

// Request analytics data
ws.requestAnalytics(userId, 7); // Last 7 days

// Listen for updates
ws.on('analytics:updated', (data) => {
  console.log('Analytics:', data.data);
  // {
  //   totalPayments: 45,
  //   totalAmount: 1250,
  //   today: 5,
  //   thisWeek: 12,
  //   successRate: 98.5
  // }
});
```

---

## 🔔 Notifications

### Send Notification from Backend
```javascript
wsService.emitNotification(
  userId,
  'success',  // Type: 'success', 'error', 'warning', 'info'
  'Payment Received',  // Title
  'Your payment of 100 Pi was successful!',  // Message
  { paymentId: '123' }  // Additional data
);
```

### Handle Notification in Frontend
```javascript
ws.on('notification:received', (data) => {
  // data = {
  //   type: 'success',
  //   title: 'Payment Received',
  //   message: 'Your payment of 100 Pi was successful!',
  //   paymentId: '123',
  //   timestamp: '2024-01-19T...'
  // }

  showToast({
    type: data.type,
    title: data.title,
    message: data.message
  });
});
```

---

## ✅ Testing WebSocket

### Test Connection
```bash
# Open browser console and test
const ws = wsClient;
ws.connect('user-123');
ws.on('user:connected', () => console.log('Connected!'));
```

### Emit Test Event
```javascript
// From backend
wsService.emitNotification('user-123', 'success', 'Test', 'Testing WebSocket');

// Frontend should receive
// on('notification:received', data) → console.log(data)
```

---

## 🐛 Debugging

### Enable Debug Logs
```javascript
// Backend
const logger = require('./services/logger.service');

// Frontend
console.log('WebSocket status:', wsClient.isConnected());
```

### Check Connection Status
```javascript
// Frontend
wsClient.on('socket:connected', () => console.log('✅ Connected'));
wsClient.on('socket:disconnected', ({ reason }) => console.log('❌ Disconnected:', reason));
wsClient.on('socket:error', ({ error }) => console.error('⚠️ Error:', error));
```

---

## 📈 Performance

### Connection Pool
- Max concurrent connections: Unlimited (server dependent)
- Reconnection delay: 1s - 5s (exponential backoff)
- Reconnection attempts: 5

### Message Queue
- Queues messages while reconnecting
- Auto-sends when reconnected
- Max queue size: 1000 messages

---

## 🚀 Deployment Checklist

- [ ] Socket.io server running on backend
- [ ] CORS configured correctly
- [ ] WebSocket transports enabled
- [ ] Frontend initialized with WebSocket
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Tests written
- [ ] Monitored in production

---

## 📚 API Reference

### Backend Methods
```javascript
wsService.emitPaymentUpdate(userId, paymentId, status, data)
wsService.emitPaymentCompleted(userId, paymentId, txHash)
wsService.emitNotification(userId, type, title, message, data)
wsService.emitAnalyticsUpdate(userId, analyticsData)
wsService.broadcastStatus(status)
wsService.getConnectedClientsCount()
wsService.getClientsInRoom(roomName)
```

### Frontend Methods
```javascript
wsClient.connect(userId)
wsClient.on(event, callback)
wsClient.paymentInitiated(paymentId, amount, description)
wsClient.paymentProcessing(paymentId)
wsClient.paymentApproved(paymentId, txHash)
wsClient.paymentFailed(paymentId, error)
wsClient.qrCodeGenerated(qrCodeId, amount)
wsClient.subscribeToNotifications(userId)
wsClient.requestAnalytics(userId, days)
wsClient.isConnected()
wsClient.disconnect()
```

---

**Status:** ✅ Complete and Ready

**Next:** Integrate into pages and test live!
