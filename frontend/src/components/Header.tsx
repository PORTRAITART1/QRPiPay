/**
 * ðŸŽ¨ Header Component - Responsive Navigation
 * Desktop + Mobile support
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import logo from '../assets/qrpipay-logo.png';
import './Header.css';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
      {/* Main Header */}
      <header 
        className="header"
        role="banner"
        aria-label="QRPiPay Application Header"
      >
        <div className="header-start">
          {/* Logo */}
          <Link 
            to="/dashboard" 
            className="header-logo"
            aria-label="QRPiPay Home"
            onClick={closeMobileMenu}
          >
            <img 
              src={logo} 
              alt="QRPiPay Logo" 
              width="50"
              height="50"
            />
            <h1>QRPiPay</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="header-nav-desktop" aria-label="Main Navigation">
            <ul className="header-nav-list">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`header-nav-link ${isActive(item.path) ? 'active' : ''}`}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="header-end">
          <ThemeToggle />

          {/* Hamburger Menu Button - Mobile */}
          <button
            className={`header-hamburger ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <>
          <nav 
            className="header-nav-mobile"
            id="mobile-menu"
            aria-label="Mobile Navigation"
          >
            <ul className="header-nav-mobile-list">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`header-nav-mobile-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Overlay - Click to close */}
          <div 
            className="header-overlay"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        </>
      )}
    </>
  );
};

export default Header;
