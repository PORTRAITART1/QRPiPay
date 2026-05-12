/**
 * 🔔 Toast Notification Component
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600',
  };

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <motion.div
      className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-2xl text-white font-medium shadow-lg flex items-center gap-3 ${bgColor[type]}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-xl">{icon[type]}</span>
      {message}
    </motion.div>
  );
};

export const ToastContainer: React.FC<{ toasts: any[] }> = ({ toasts }) => (
  <AnimatePresence>
    {toasts.map((toast) => (
      <Toast key={toast.id} {...toast} />
    ))}
  </AnimatePresence>
);
