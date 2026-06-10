import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/qrpipay-logo.png';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <Link to="/dashboard" className="header-logo">
        <img src={logo} alt="QRPiPay Logo" />
        <h1>QRPiPay</h1>
      </Link>
    </header>
  );
}
