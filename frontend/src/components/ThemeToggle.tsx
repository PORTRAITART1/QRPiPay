/**
 * Theme Toggle Component
 * Button to switch between light/dark/system themes
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

export const ThemeToggle: React.FC = () => {
  const { theme, effectiveTheme, setTheme } = useTheme();

  return (
    <div className="theme-toggle-group">
      {/* Light Mode */}
      <button
        onClick={() => setTheme('light')}
        className={`theme-toggle-btn ${theme === 'light' ? 'active' : ''}`}
        title="Light mode"
        aria-label="Switch to light mode"
      >
        ☀️
      </button>

      {/* Dark Mode */}
      <button
        onClick={() => setTheme('dark')}
        className={`theme-toggle-btn ${theme === 'dark' ? 'active' : ''}`}
        title="Dark mode"
        aria-label="Switch to dark mode"
      >
        🌙
      </button>

      {/* System Mode */}
      <button
        onClick={() => setTheme('system')}
        className={`theme-toggle-btn ${theme === 'system' ? 'active' : ''}`}
        title="System preference"
        aria-label="Use system theme preference"
      >
        💻
      </button>
    </div>
  );
};

export default ThemeToggle;
