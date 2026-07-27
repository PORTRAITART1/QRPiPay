/**
 * ðŸ“± Mobile Header with Hamburger Menu
 * Responsive navigation for mobile devices
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import logo from '../assets/qrpipay-logo.png';
import './HeaderMobile.css';

export const HeaderMobile: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/qr-generator', label: 'QR Generator' },
    { path: '/history', label: 'History' },
    { path: '/analytics', label: 'Analytics' },
  ];

  return (
    <>
      {/* Header */}
      <header 
        className="header-mobile"
        role="banner"
        aria-label="QRPiPay Application Header"
      >
        <div className="header-mobile-top">
          {/* Logo */}
          <Link 
            to="/dashboard" 
            className="header-mobile-logo"
            aria-label="QRPiPay Home"
            onClick={closeMenu}
          >
            <img 
              src={logo} 
              alt="QRPiPay Logo" 
              width="40"
              height="40"
            />
            <h1>QRPiPay</h1>
          </Link>

          {/* Right Controls */}
          <div className="header-mobile-controls">
            <ThemeToggle />
            
            {/* Hamburger Menu Button */}
            <button
              className={`hamburger ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav 
            className="header-mobile-menu"
            id="mobile-menu"
            aria-label="Mobile Navigation"
          >
            <ul className="header-mobile-menu-list">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`header-mobile-menu-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={closeMenu}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="header-mobile-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default HeaderMobile;
