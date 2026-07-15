/**
 * useWebSocket Hook
 * Custom React hook for WebSocket integration
 */

import { useEffect, useCallback } from 'react';
import { wsClient } from '../services/websocket.client';

export const useWebSocket = (userId) => {
  useEffect(() => {
    if (userId) {
      wsClient.connect(userId);
    }

    return () => {
      // Cleanup on unmount
      wsClient.leaveUser(userId);
    };
  }, [userId]);

  const on = useCallback((event, callback) => {
    wsClient.on(event, callback);
  }, []);

  const paymentInitiated = useCallback((paymentId, amount, description) => {
    wsClient.paymentInitiated(paymentId, amount, description);
  }, []);

  const paymentProcessing = useCallback((paymentId) => {
    wsClient.paymentProcessing(paymentId);
  }, []);

  const paymentApproved = useCallback((paymentId, txHash) => {
    wsClient.paymentApproved(paymentId, txHash);
  }, []);

  const paymentFailed = useCallback((paymentId, error) => {
    wsClient.paymentFailed(paymentId, error);
  }, []);

  const qrCodeGenerated = useCallback((qrCodeId, amount) => {
    wsClient.qrCodeGenerated(qrCodeId, amount);
  }, []);

  const subscribeToNotifications = useCallback(() => {
    wsClient.subscribeToNotifications(userId);
  }, [userId]);

  const requestAnalytics = useCallback((days = 7) => {
    wsClient.requestAnalytics(userId, days);
  }, [userId]);

  const isConnected = useCallback(() => {
    return wsClient.isConnected();
  }, []);

  return {
    on,
    paymentInitiated,
    paymentProcessing,
    paymentApproved,
    paymentFailed,
    qrCodeGenerated,
    subscribeToNotifications,
    requestAnalytics,
    isConnected
  };
};

export default useWebSocket;
