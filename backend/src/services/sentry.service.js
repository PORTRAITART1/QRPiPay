/**
 * Sentry Error Tracking Service
 * Centralized error monitoring and reporting
 */

const Sentry = require('@sentry/node');
const logger = require('./logger.service');

/**
 * Initialize Sentry for error tracking
 */
function initializeSentry(app) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.OnUncaughtException(),
      new Sentry.Integrations.OnUnhandledRejection()
    ],
    beforeSend(event) {
      // Filter sensitive data
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers['authorization'];
      }
      return event;
    }
  });

  // Sentry middleware
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  logger.info('✅ Sentry initialized');
}

/**
 * Add error handler middleware
 */
function addErrorHandler(app) {
  app.use(Sentry.Handlers.errorHandler());

  // Custom error handler
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Capture error in Sentry
    if (statusCode >= 500) {
      Sentry.captureException(err, {
        level: 'error',
        tags: {
          endpoint: req.path,
          method: req.method,
          statusCode
        },
        contexts: {
          request: {
            url: req.url,
            method: req.method,
            headers: req.headers
          }
        }
      });
    }

    // Log to Winston
    logger.error({
      error: message,
      statusCode,
      stack: err.stack,
      path: req.path,
      method: req.method
    });

    // Send response
    res.status(statusCode).json({
      error: message,
      statusCode,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });
}

/**
 * Capture custom event
 */
function captureEvent(level, message, context = {}) {
  Sentry.captureMessage(message, level);
  
  logger[level]({
    message,
    ...context,
    timestamp: new Date().toISOString()
  });
}

/**
 * Capture exception
 */
function captureException(error, context = {}) {
  Sentry.captureException(error, {
    contexts: context
  });

  logger.error({
    error: error.message,
    stack: error.stack,
    ...context
  });
}

/**
 * Set user context
 */
function setUserContext(userId, userData = {}) {
  Sentry.setUser({
    id: userId,
    ...userData
  });
}

/**
 * Clear user context
 */
function clearUserContext() {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb
 */
function addBreadcrumb(message, category, level = 'info', data = {}) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000
  });
}

/**
 * Performance monitoring
 */
function startPerformanceMonitoring(name) {
  const start = Date.now();

  return {
    end: (success = true) => {
      const duration = Date.now() - start;
      
      Sentry.captureMessage(`Performance: ${name}`, 'info', {
        contexts: {
          performance: {
            name,
            duration,
            success
          }
        }
      });

      logger.info({
        message: `Performance: ${name}`,
        duration,
        success
      });
    }
  };
}

module.exports = {
  initializeSentry,
  addErrorHandler,
  captureEvent,
  captureException,
  setUserContext,
  clearUserContext,
  addBreadcrumb,
  startPerformanceMonitoring
};
