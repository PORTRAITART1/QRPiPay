/**
 * Toast Component - Design System
 * Notification toasts with auto-dismiss
 */

import React, { useEffect } from 'react';
import './Toast.css';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  dismissible?: boolean;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({
    variant = 'info',
    title,
    message,
    duration = 3000,
    onClose,
    dismissible = true,
    className = '',
    ...props
  }, ref) => {
    useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          onClose?.();
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);

    return (
      <div
        ref={ref}
        className={`
          toast
          toast-${variant}
          ${className}
        `.trim()}
        role="status"
        aria-live="polite"
        {...props}
      >
        <div className="toast-content">
          <div className="toast-icon">
            {variant === 'success' && 'âœ“'}
            {variant === 'error' && 'âœ•'}
            {variant === 'warning' && 'âš '}
            {variant === 'info' && 'â„¹'}
          </div>
          <div className="toast-text">
            {title && <h4 className="toast-title">{title}</h4>}
            <p className="toast-message">{message}</p>
          </div>
        </div>

        {dismissible && (
          <button
            className="toast-close"
            onClick={onClose}
            aria-label="Dismiss notification"
          >
            âœ•
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';

export default Toast;
