import React from 'react';
import './Alert.css';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        {type === 'success' && <span>✅</span>}
        {type === 'error' && <span>❌</span>}
        {type === 'warning' && <span>⚠️</span>}
        {type === 'info' && <span>ℹ️</span>}
        <span>{message}</span>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>×</button>
      )}
    </div>
  );
}
