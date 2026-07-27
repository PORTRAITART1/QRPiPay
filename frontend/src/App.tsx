/**
 * ðŸŽ­ App Component - Router setup with Pi Network initialization
 * Handles Pi SDK loading with proper fallback
 */

import React, { useEffect, useState } from 'react';
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
  const [piSDKReady, setPiSDKReady] = useState(false);

  /**
   * Initialize Pi Network SDK on app load
   * Attempt automatic authentication if Pi Browser detected
   */
  useEffect(() => {
    const initializePi = async () => {
      console.log('ðŸ¥§ QRPiPay v2.0 initializing...');
      console.log('Environment:', process.env.NODE_ENV);

      try {
        // Check if Pi SDK script loaded
        if (!window.Pi) {
          console.warn('âš ï¸ Pi SDK script not loaded yet');
          // Retry after a delay
          setTimeout(async () => {
            if (window.Pi) {
              console.log('âœ… Pi SDK script loaded on retry');
              const initialized = await piService.initialize();
              setPiSDKReady(initialized);
            } else {
              console.warn('âš ï¸ Pi SDK not available - running in fallback mode');
              setPiSDKReady(false);
            }
          }, 1000);
          return;
        }

        console.log('âœ… Pi SDK script available');

        // Initialize Pi Service
        const initialized = await piService.initialize();
        setPiSDKReady(initialized);

        if (initialized) {
          console.log('âœ… Pi SDK initialized successfully');

          // Attempt automatic authentication if not already authenticated
          if (!isAuthenticated) {
            console.log('ðŸ” Attempting automatic Pi authentication...');
            try {
              await authenticate();
              console.log('âœ… Automatic authentication successful');
            } catch (error) {
              console.log('â„¹ï¸ Automatic authentication skipped (user interaction required)');
            }
          }
        } else {
          console.warn('âš ï¸ Pi SDK initialization failed - running in fallback mode');
          console.log('ðŸ’¡ App will work with manual authentication button');
        }
      } catch (error) {
        console.error('âŒ Pi initialization error:', error);
        console.warn('âš ï¸ Running in fallback mode');
        setPiSDKReady(false);
      }
    };

    // Start initialization
    initializePi();
  }, []);

  useEffect(() => {
    console.log('ðŸ¥§ QRPiPay Status:');
    console.log('  - Pi SDK Ready:', piSDKReady);
    console.log('  - Authenticated:', isAuthenticated);
    if (user) {
      console.log('  - User:', user.username);
    }
  }, [isAuthenticated, user, piSDKReady]);

  return (
    <ThemeProvider>
      <BrowserProvider>
        <ToastProvider>
          <Router>
            <div className="overflow-x-hidden w-screen max-w-full">
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
            </div>
          </Router>
        </ToastProvider>
      </BrowserProvider>
    </ThemeProvider>
  );
}

export default App;
