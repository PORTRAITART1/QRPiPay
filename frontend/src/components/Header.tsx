import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/qrpipay-logo.png';
import './Header.css';

export default function Header() {
  return (
    <header 
      className="header"
      role="banner"
      aria-label="QRPiPay Application Header"
    >
      <Link 
        to="/dashboard" 
        className="header-logo"
        aria-label="QRPiPay Home"
      >
        <img 
          src={logo} 
          alt="QRPiPay Logo" 
          width="50"
          height="50"
        />
        <h1>QRPiPay</h1>
      </Link>
      
      <nav aria-label="Main Navigation">
        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
          <li>
            <Link to="/dashboard" aria-current="page">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/qr-generator">
              QR Generator
            </Link>
          </li>
          <li>
            <Link to="/history">
              History
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
