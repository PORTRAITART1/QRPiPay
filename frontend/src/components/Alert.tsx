import React from 'react';
import './Alert.css';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        {type === 'success' && <span>âœ…</span>}
        {type === 'error' && <span>âŒ</span>}
        {type === 'warning' && <span>âš ï¸</span>}
        {type === 'info' && <span>â„¹ï¸</span>}
        <span>{message}</span>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>Ã—</button>
      )}
    </div>
  );
}

export default Alert;
