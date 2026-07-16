/**
 * 🔐 Login Page - Pi Authentication
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/Button';
import { Card, CardHeader, CardBody } from '../components/Card';
import { Badge } from '../components/Badge';
import { Toast } from '../components/Toast';
import { useBrowser } from '../context/BrowserContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { authenticate, isLoading, error } = useAuthStore();
  const [showToast, setShowToast] = useState(false);
  const { isPiBrowser } = useBrowser();

  const handleLogin = async () => {
    try {
      await authenticate();
      setShowToast(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-orange-600 flex items-center justify-center p-4">
      {/* Background animated circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-orange-300/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card variant="elevated">
          <CardBody>
            <div className="text-center space-y-8">
              {/* Logo */}
              <motion.div
                className="text-6xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🥧
              </motion.div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                  QRPiPay
                </h1>
                <p className="text-xl font-bold text-gray-900">
                  Accepte Pi en 10 secondes
                </p>
              </div>

              {/* Divider */}
              <div className="h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent" />

              {/* Description */}
              <p className="text-gray-700 text-base leading-relaxed font-medium">
                Générez des codes QR de paiement instantanés. Acceptez des
                paiements Pi directement depuis Pi Browser.
              </p>

              {/* Login Button */}
              <Button
                variant="primary"
                size="lg"
                disabled={!isPiBrowser}
                onClick={handleLogin}
                className="w-full"
              >
                {isPiBrowser ? 'Connexion avec Pi' : '⚠️ Pi Browser requis'}
              </Button>

              {/* Error message */}
              {error && (
                <Badge variant="error" size="md" className="w-full justify-center">
                  {error}
                </Badge>
              )}

              {/* Footer */}
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  Fonctionne uniquement dans <span className="font-bold text-gray-900">Pi Browser</span>
                </p>
                <p>
                  Cette application utilise la Pi Network API pour traiter les
                  paiements de manière sécurisée.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Stats */}
        <motion.div
          className="mt-8 grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card variant="elevated">
            <CardBody>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                  1,247
                </div>
                <div className="text-xs text-gray-600 mt-1">Commerçants actifs</div>
              </div>
            </CardBody>
          </Card>
          <Card variant="elevated">
            <CardBody>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                  12,456
                </div>
                <div className="text-xs text-gray-600 mt-1">Pi traités aujourd'hui</div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </motion.div>

      {/* Toast */}
      {showToast && (
        <Toast
          message="✅ Authentification réussie!"
          variant="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default LoginPage;
