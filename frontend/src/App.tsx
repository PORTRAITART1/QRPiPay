/**
 * 🎭 App Component - Router setup with Pi Network initialization
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { piService } from './services/PiService';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { QRGeneratorPage } from './pages/QRGeneratorPage';
import { PaymentHistoryPage } from './pages/PaymentHistoryPage';
import { PaymentConfirmationPage } from './pages/PaymentConfirmationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { BetaProgramPage } from './pages/BetaProgramPage';
import { BetaAdminDashboard } from './pages/BetaAdminDashboard';
import ToastProvider from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import Header from './components/Header';
import { BrowserProvider } from './context/BrowserContext';

// Protected Route Component
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{element}</> : <Navigate to="/" />;
};

function App() {
  const { isAuthenticated, user, authenticate } = useAuthStore();

  /**
   * Initialize Pi Network SDK on app load
   * Attempt automatic authentication if Pi Browser detected
   */
  useEffect(() => {
    const initializePi = async () => {
      console.log('🥧 QRPiPay initializing...');

      try {
        // Initialize Pi SDK
        const initialized = await piService.initialize();
        
        if (!initialized) {
          console.warn('⚠️ Pi SDK could not be initialized (might not be in Pi Browser)');
          return;
        }

        console.log('✅ Pi SDK initialized successfully');

        // Attempt automatic authentication if not already authenticated
        if (!isAuthenticated && window.Pi) {
          console.log('🔐 Attempting automatic Pi authentication...');
          try {
            await authenticate();
            console.log('✅ Automatic authentication successful');
          } catch (error) {
            console.warn('ℹ️ Automatic authentication not available (user may need to click sign-in)');
          }
        }
      } catch (error) {
        console.error('❌ Pi initialization error:', error);
      }
    };

    initializePi();
  }, []);

  useEffect(() => {
    console.log('🥧 QRPiPay initialized');
    console.log('Authenticated:', isAuthenticated);
    if (user) {
      console.log('User:', user.username);
    }
  }, [isAuthenticated, user]);

  return (
    <ThemeProvider>
      <BrowserProvider>
        <ToastProvider>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/beta" element={<BetaProgramPage />} />
              <Route path="/beta/admin" element={<BetaAdminDashboard />} />
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
                path="/analytics"
                element={<ProtectedRoute element={<AnalyticsPage />} />}
              />
              <Route
                path="/confirmation"
                element={<ProtectedRoute element={<PaymentConfirmationPage />} />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </ToastProvider>
      </BrowserProvider>
    </ThemeProvider>
  );
}

export default App;
