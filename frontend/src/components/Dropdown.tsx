/**
 * Dropdown Component - Design System
 * Dropdown menu
 */

import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  placement?: 'bottom' | 'top';
  closeOnClick?: boolean;
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({
    trigger,
    items,
    placement = 'bottom',
    closeOnClick = true,
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('click', handleClickOutside);
      }

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, [isOpen]);

    const handleItemClick = (item: DropdownItem) => {
      if (!item.disabled) {
        item.onClick?.();
        if (closeOnClick) {
          setIsOpen(false);
        }
      }
    };

    return (
      <div
        ref={ref || dropdownRef}
        className={`dropdown dropdown-${placement}`}
      >
        {/* Trigger */}
        <button
          className="dropdown-trigger"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          {trigger}
        </button>

        {/* Menu */}
        {isOpen && (
          <div className="dropdown-menu" role="menu">
            {items.map((item, index) => (
              item.divider ? (
                <div key={`divider-${index}`} className="dropdown-divider" />
              ) : (
                <button
                  key={item.id}
                  className={`
                    dropdown-item
                    ${item.disabled ? 'disabled' : ''}
                  `.trim()}
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  role="menuitem"
                >
                  {item.icon && (
                    <span className="dropdown-icon">{item.icon}</span>
                  )}
                  <span className="dropdown-label">{item.label}</span>
                </button>
              )
            ))}
          </div>
        )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;
