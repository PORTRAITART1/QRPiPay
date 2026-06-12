import React, { useEffect } from 'react';
import './Toast.css';

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({
  id,
  message,
  type,
  duration = 3000,
  onClose
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {type === 'success' && <span>✅</span>}
        {type === 'error' && <span>❌</span>}
        {type === 'info' && <span>ℹ️</span>}
        <span>{message}</span>
      </div>
      <button
        className="toast-close"
        onClick={() => onClose(id)}
      >
        ×
      </button>
    </div>
  );
}
