/**
 * 🎭 App Component - Router setup
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { QRGeneratorPage } from './pages/QRGeneratorPage';
import { PaymentHistoryPage } from './pages/PaymentHistoryPage';
import { PaymentConfirmationPage } from './pages/PaymentConfirmationPage';
import './index.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{element}</> : <Navigate to="/" />;
};

function App() {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    console.log('🥧 QRPiPay initialized');
    console.log('Authenticated:', isAuthenticated);
    if (user) {
      console.log('User:', user.username);
    }
  }, [isAuthenticated, user]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<DashboardPage />} />}
        />
        <Route
          path="/qr-generator"
          element={<ProtectedRoute element={<QRGeneratorPage />} />}
        />
        <Route
          path="/history"
          element={<ProtectedRoute element={<PaymentHistoryPage />} />}
        />
        <Route
          path="/confirmation"
          element={<ProtectedRoute element={<PaymentConfirmationPage />} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
