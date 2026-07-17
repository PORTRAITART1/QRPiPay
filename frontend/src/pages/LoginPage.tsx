/**
 * 🔐 Login Page - Premium Design (Navy + Cyan)
 * Harmonious color palette with smooth animations
 * ✅ WCAG AA Contrast Compliant
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { ButtonPremium } from '../components/ButtonPremium';
import { CardPremium, CardBodyPremium } from '../components/CardPremium';
import { BadgePremium } from '../components/BadgePremium';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cyan glow orb 1 */}
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 70%)',
            top: '10%',
            left: '10%',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Navy glow orb 2 */}
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(26, 35, 50, 0.2) 0%, transparent 70%)',
            bottom: '10%',
            right: '10%',
          }}
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        {/* Cyan accent glow */}
        <motion.div
          className="absolute w-72 h-72 rounded-full blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            marginLeft: '-144px',
            marginTop: '-144px',
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 min-h-screen flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md w-full">
          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CardPremium variant="glow">
              <CardBodyPremium className="space-y-8">
                {/* Logo animation */}
                <motion.div
                  className="text-6xl text-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🥧
                </motion.div>

                {/* Title with gradient */}
                <div className="text-center space-y-3">
                  <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    QRPiPay
                  </h1>
                  <p className="text-xl font-bold text-white">
                    Accepte Pi en 10 secondes
                  </p>
                </div>

                {/* Divider with glow */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-lg shadow-cyan-500/50" />

                {/* Description */}
                <p className="text-center text-white text-base leading-relaxed">
                  Générez des codes QR de paiement instantanés. Acceptez des
                  paiements Pi directement depuis Pi Browser.
                </p>

                {/* Login button */}
                <ButtonPremium
                  variant="primary"
                  size="lg"
                  disabled={!isPiBrowser}
                  onClick={handleLogin}
                  className="w-full font-bold"
                >
                  {isPiBrowser ? '🔓 Connexion avec Pi' : '⚠️ Pi Browser requis'}
                </ButtonPremium>

                {/* Error badge */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <BadgePremium variant="error" size="md" className="w-full justify-center">
                      {error}
                    </BadgePremium>
                  </motion.div>
                )}

                {/* Footer info */}
                <div className="space-y-2 text-sm text-cyan-100">
                  <p>
                    Fonctionne uniquement dans{' '}
                    <span className="font-bold text-white">Pi Browser</span>
                  </p>
                  <p>
                    Cette application utilise la Pi Network API pour traiter les
                    paiements de manière sécurisée.
                  </p>
                </div>
              </CardBodyPremium>
            </CardPremium>
          </motion.div>

          {/* Stats cards */}
          <motion.div
            className="mt-8 grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CardPremium variant="outline">
              <CardBodyPremium>
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    1,247
                  </div>
                  <div className="text-xs text-cyan-100 mt-2">Commerçants actifs</div>
                </div>
              </CardBodyPremium>
            </CardPremium>

            <CardPremium variant="outline">
              <CardBodyPremium>
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    12,456
                  </div>
                  <div className="text-xs text-cyan-100 mt-2">Pi traités</div>
                </div>
              </CardBodyPremium>
            </CardPremium>
          </motion.div>

          {/* Bottom accent line */}
          <motion.div
            className="mt-8 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-full"
            animate={{
              boxShadow: [
                '0 0 20px rgba(0, 212, 255, 0.5)',
                '0 0 40px rgba(0, 212, 255, 0.8)',
                '0 0 20px rgba(0, 212, 255, 0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Toast notification */}
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
