/**
 * Modal Component - Design System
 * Dialog/Modal with overlay
 */

import React, { useEffect } from 'react';
import './Modal.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeButton?: boolean;
  backdrop?: boolean;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    closeButton = true,
    backdrop = true,
  }, ref) => {
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
      <div className="modal-backdrop" onClick={backdrop ? onClose : undefined}>
        <div
          ref={ref}
          className={`modal modal-${size}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || closeButton) && (
            <div className="modal-header">
              {title && (
                <h2 id="modal-title" className="modal-title">
                  {title}
                </h2>
              )}
              {closeButton && (
                <button
                  className="modal-close"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="modal-body">{children}</div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className = '', ...props }, ref) => (
    <div className={`modal-footer ${className}`.trim()} ref={ref} {...props}>
      {children}
    </div>
  )
);

ModalFooter.displayName = 'ModalFooter';

export default Modal;
