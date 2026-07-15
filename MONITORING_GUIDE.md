# 📊 Monitoring & Error Tracking Guide

**Date:** $(date)
**Status:** ✅ Ready to Setup
**Version:** 1.0

---

## 📋 Overview

Comprehensive monitoring setup for QRPiPay using:
- **Sentry** - Error tracking and performance monitoring
- **Winston** - Structured logging
- **Real-time** - Instant error notifications

---

## 🚀 Setup

### 1. Create Sentry Account

```bash
# Go to: https://sentry.io/
# Sign up (free tier available)
# Create new project
# Select: Node.js (backend) and React (frontend)
```

### 2. Get Sentry DSNs

**Backend DSN:**
```
https://<key>@sentry.io/<project-id>
```

**Frontend DSN:**
```
https://<key>@sentry.io/<project-id>
```

### 3. Install Dependencies

**Backend:**
```bash
npm install @sentry/node @sentry/tracing
```

**Frontend:**
```bash
npm install @sentry/react @sentry/tracing
```

### 4. Configure Environment Variables

**Backend (.env):**
```
SENTRY_DSN=https://key@sentry.io/project-id
SENTRY_ENVIRONMENT=production
SENTRY_TRACE_SAMPLE_RATE=1.0
```

**Frontend (.env.local):**
```
VITE_SENTRY_DSN=https://key@sentry.io/project-id
VITE_SENTRY_ENVIRONMENT=production
```

---

## 🔧 Backend Integration

### Initialize Sentry

**In src/server.js:**
```javascript
const { initializeSentry, addErrorHandler } = require('./services/sentry.service');

// Initialize early
initializeSentry(app);

// ... routes ...

// Add error handler at the end
addErrorHandler(app);
```

### Capture Exceptions

```javascript
const { captureException } = require('./services/sentry.service');

try {
  // Code that might fail
  await processPayment(data);
} catch (error) {
  captureException(error, {
    payment: { id: paymentId }
  });
}
```

### Capture Events

```javascript
const { captureEvent } = require('./services/sentry.service');

// Warning event
captureEvent('warning', 'High payment amount', {
  amount: 10000,
  userId: user.id
});

// Error event
captureEvent('error', 'Payment failed', {
  paymentId: '123',
  reason: 'Insufficient balance'
});
```

### Set User Context

```javascript
const { setUserContext } = require('./services/sentry.service');

// After authentication
setUserContext(user.id, {
  username: user.username,
  email: user.email
});
```

### Add Breadcrumbs

```javascript
const { addBreadcrumb } = require('./services/sentry.service');

// Track user actions
addBreadcrumb('Payment initiated', 'payment', 'info', {
  amount: 100,
  currency: 'Pi'
});
```

---

## 🎨 Frontend Integration

### Initialize in App

**App.tsx:**
```typescript
import { initializeSentry } from './hooks/useSentry';
import * as Sentry from '@sentry/react';

// Initialize early
initializeSentry();

// Wrap routes with Sentry
const SentryRoutes = Sentry.withSentryRouting(Routes);

export function App() {
  return (
    <BrowserRouter>
      <SentryRoutes />
    </BrowserRouter>
  );
}
```

### Use Sentry Hook

```typescript
import { useSentry } from '../hooks/useSentry';

export function PaymentPage() {
  const { captureException, trackPayment, trackPaymentError } = useSentry();

  const handlePayment = async (paymentId, amount) => {
    try {
      // Track payment attempt
      trackPayment(paymentId, amount, 'pending');

      // Process payment
      const result = await api.post('/payments', { paymentId, amount });

      // Track success
      trackPayment(paymentId, amount, 'completed');
    } catch (error) {
      // Track error
      trackPaymentError(paymentId, error);
      captureException(error);
    }
  };

  return (
    <button onClick={() => handlePayment('123', 100)}>
      Pay 100 Pi
    </button>
  );
}
```

### Track User Actions

```typescript
const { trackNavigation, trackAction } = useSentry();

// Track page navigation
useEffect(() => {
  trackNavigation('/dashboard');
}, []);

// Track button clicks
const handleButtonClick = () => {
  trackAction('export_clicked', {
    format: 'csv',
    records: 50
  });
  // ... do action ...
};
```

---

## 📊 Winston Logging

### Configuration

**Backend logger.service.js includes:**
- Console output (all levels)
- File logging (error.log, combined.log)
- Timestamps and metadata
- Error stack traces

### Usage

```javascript
const logger = require('./services/logger.service');

// Info
logger.info('Payment processed', { paymentId: '123' });

// Warning
logger.warn('High latency detected', { responseTime: 2500 });

// Error
logger.error('Database connection failed', { error: err.message });

// Debug
logger.debug('Query executed', { query: sql, params: [] });
```

### Log Levels

```
error   - Errors and exceptions
warn    - Warnings and issues
info    - Important information
http    - HTTP requests
debug   - Debugging information
verbose - Detailed logs
silly   - Very detailed logs
```

---

## 🔍 Monitoring Dashboard

### Access Sentry Dashboard
```
https://sentry.io/organizations/your-org/issues/
```

### View Metrics
- Error rates
- Performance metrics
- User impact
- Release tracking

### Set Alerts
1. Go to Alerts
2. Create new alert
3. Configure conditions
4. Select notification channel

---

## 🚨 Error Alerts

### Setup Email Alerts

**In Sentry:**
1. Project Settings → Alerts
2. Create New Alert Rule
3. Condition: `Error > 5 in 10 minutes`
4. Action: Send email

### Setup Slack Notifications

**In Sentry:**
1. Integrations → Slack
2. Connect Slack workspace
3. Select channel
4. Enable notifications

---

## 📈 Performance Monitoring

### Track API Performance

```javascript
const { startPerformanceMonitoring } = require('./services/sentry.service');

app.get('/api/payments', (req, res) => {
  const monitor = startPerformanceMonitoring('GET /api/payments');

  try {
    // API logic
    const payments = await getPayments();

    monitor.end(true);
    res.json(payments);
  } catch (error) {
    monitor.end(false);
    throw error;
  }
});
```

### Monitor Database Queries

```javascript
const monitor = startPerformanceMonitoring('Payment Query');

const payments = await prisma.payment.findMany({
  where: { userId }
});

monitor.end(true);
```

---

## 🔐 Privacy & Security

### Scrub Sensitive Data

Sentry automatically scrubs:
- ✅ Passwords
- ✅ API keys
- ✅ Authentication tokens
- ✅ Credit cards

### Custom Scrubbing

```javascript
Sentry.init({
  beforeSend(event) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
    }
    return event;
  }
});
```

---

## 🧪 Testing Sentry

### Test Backend Error

```bash
# Trigger test error
curl http://localhost:3001/api/test-error

# Check Sentry dashboard for new issue
```

### Test Frontend Error

```typescript
// In React component
const handleTestError = () => {
  throw new Error('Test error from frontend');
};

// This will be captured by Sentry
```

---

## 📊 Common Monitoring Patterns

### Pattern 1: Payment Processing
```javascript
addBreadcrumb('Payment initiated', 'payment', 'info', { amount: 100 });

try {
  const result = await processPayment(data);
  addBreadcrumb('Payment completed', 'payment', 'info', { txHash: result.hash });
} catch (error) {
  addBreadcrumb('Payment failed', 'payment', 'error', { reason: error.message });
  captureException(error);
}
```

### Pattern 2: User Actions
```javascript
const { trackAction } = useSentry();

const handleExport = async (format) => {
  trackAction('export_initiated', { format });
  
  try {
    await exportData(format);
    trackAction('export_completed', { format });
  } catch (error) {
    trackAction('export_failed', { format, error: error.message });
  }
};
```

### Pattern 3: Async Operations
```javascript
const monitor = startPerformanceMonitoring('Database Migration');

try {
  await runMigration();
  monitor.end(true);
} catch (error) {
  monitor.end(false);
  captureException(error);
}
```

---

## 🐛 Troubleshooting

### Errors not appearing in Sentry

```
✓ Check DSN is correct
✓ Check environment is not 'development'
✓ Verify Sentry service is initialized
✓ Check network requests in browser
```

### Too many errors

```
✓ Reduce sample rate
✓ Filter by environment
✓ Use error grouping
✓ Set appropriate alert thresholds
```

### Missing data

```
✓ Check beforeSend filters
✓ Verify integrations are enabled
✓ Check user context is set
✓ Verify breadcrumbs are added
```

---

## 📈 Best Practices

### DO ✅
- Set user context after auth
- Add breadcrumbs for context
- Capture errors early
- Monitor performance
- Set meaningful alerts
- Review errors regularly
- Update Sentry regularly

### DON'T ❌
- Log sensitive data
- Spam errors to Sentry
- Ignore error trends
- Skip performance monitoring
- Use production DSN in dev
- Store passwords in logs
- Disable error tracking

---

## 🔄 Release Tracking

### Tag Release

```bash
# In CI/CD
sentry-cli releases create -p qrpipay-backend $VERSION
sentry-cli releases set-commits --auto $VERSION
```

### Track Issues by Release

```
Sentry Dashboard → Releases
See which issues were introduced in each release
```

---

## 📚 References

- [Sentry Docs](https://docs.sentry.io)
- [Node.js SDK](https://docs.sentry.io/platforms/node/)
- [React SDK](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Winston Logger](https://github.com/winstonjs/winston)

---

## ✅ Setup Checklist

- [ ] Sentry account created
- [ ] DSNs obtained
- [ ] Dependencies installed
- [ ] Backend Sentry initialized
- [ ] Frontend Sentry initialized
- [ ] Winston logging configured
- [ ] Alerts setup
- [ ] Slack integration (optional)
- [ ] Email alerts configured
- [ ] Test error captured
- [ ] Performance monitoring enabled
- [ ] Release tracking setup

---

**Status:** ✅ Complete and Ready

**Next:** Set up Sentry account and integrate!
