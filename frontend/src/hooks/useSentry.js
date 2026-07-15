/**
 * useSentry Hook
 * Error tracking and monitoring for frontend
 */

import { useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { useAuth } from '../context/AuthContext';

/**
 * Initialize Sentry
 */
export function initializeSentry() {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true
      })
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event) {
      // Filter sensitive data
      if (event.request) {
        delete event.request.cookies;
      }
      return event;
    }
  });
}

/**
 * useSentry Hook - Setup error tracking
 */
export function useSentry() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Set user context
      Sentry.setUser({
        id: user.id,
        username: user.username,
        email: user.email
      });
    } else {
      Sentry.setUser(null);
    }
  }, [user]);

  // Capture error
  const captureException = (error, context = {}) => {
    Sentry.captureException(error, { contexts: context });
    console.error('Error captured by Sentry:', error);
  };

  // Capture message
  const captureMessage = (message, level = 'info') => {
    Sentry.captureMessage(message, level);
    console.log(`${level.toUpperCase()}: ${message}`);
  };

  // Add breadcrumb
  const addBreadcrumb = (message, category = 'user-action', data = {}) => {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info'
    });
  };

  // Track navigation
  const trackNavigation = (page) => {
    addBreadcrumb(`Navigated to ${page}`, 'navigation');
  };

  // Track user action
  const trackAction = (action, data = {}) => {
    addBreadcrumb(`User action: ${action}`, 'user-action', data);
  };

  // Track payment
  const trackPayment = (paymentId, amount, status) => {
    addBreadcrumb(`Payment: ${paymentId}`, 'payment', {
      amount,
      status
    });
  };

  // Track error in payment
  const trackPaymentError = (paymentId, error) => {
    captureException(error, {
      payment: {
        id: paymentId,
        errorType: 'payment_error'
      }
    });
  };

  return {
    captureException,
    captureMessage,
    addBreadcrumb,
    trackNavigation,
    trackAction,
    trackPayment,
    trackPaymentError
  };
}

export default useSentry;
