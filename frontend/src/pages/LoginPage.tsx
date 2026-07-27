/**
 * ðŸ” Login Page - Premium Design (Navy + Cyan)
 * Harmonious color palette with smooth animations
 * âœ… WCAG AA Contrast Compliant
 * âœ… PERFECTLY CENTERED
 * âœ… MOBILE OPTIMIZED - Responsive font sizes
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-x-hidden overflow-y-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cyan glow orb 1 */}
        <motion.div
          className="absolute w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl"
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
          className="absolute w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl"
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
          className="absolute w-48 md:w-72 h-48 md:h-72 rounded-full blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            marginLeft: '-96px',
            marginTop: '-96px',
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Main content - PERFECTLY CENTERED */}
      <motion.div
        className="relative z-10 min-h-screen w-full flex items-center justify-center p-3 md:p-4 overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-sm">
          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CardPremium variant="glow">
              <CardBodyPremium className="space-y-4 md:space-y-6">
                {/* Logo animation - SMALLER ON MOBILE */}
                <motion.div
                  className="text-4xl md:text-6xl text-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ðŸ¥§
                </motion.div>

                {/* Title with gradient - RESPONSIVE SIZE */}
                <div className="text-center space-y-2 md:space-y-3">
                  <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent leading-tight">
                    QRPiPay
                  </h1>
                  <p className="text-sm md:text-lg font-bold text-white leading-tight">
                    Accepte Pi en 10s
                  </p>
                </div>

                {/* Divider with glow */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-lg shadow-cyan-500/50" />

                {/* Description - SMALLER TEXT */}
                <p className="text-center text-white text-xs md:text-sm leading-relaxed">
                  GÃ©nÃ©rez des codes QR de paiement. Acceptez les paiements Pi directement.
                </p>

                {/* Login button */}
                <ButtonPremium
                  variant="primary"
                  size="lg"
                  disabled={!isPiBrowser}
                  onClick={handleLogin}
                  className="w-full font-bold text-sm md:text-base"
                >
                  {isPiBrowser ? 'ðŸ”“ Connexion avec Pi' : 'âš ï¸ Pi Browser requis'}
                </ButtonPremium>

                {/* Error badge */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <BadgePremium variant="error" size="sm" className="w-full justify-center text-xs">
                      {error}
                    </BadgePremium>
                  </motion.div>
                )}

                {/* Footer info - MUCH SMALLER */}
                <div className="space-y-1 text-xs text-cyan-100">
                  <p>
                    Fonctionne dans{' '}
                    <span className="font-bold text-white">Pi Browser</span>
                  </p>
                  <p>
                    Paiements sÃ©curisÃ©s via Pi Network API
                  </p>
                </div>
              </CardBodyPremium>
            </CardPremium>
          </motion.div>

          {/* Stats cards - FIXED: Numbers now CYAN (visible) - SMALLER */}
          <motion.div
            className="mt-4 md:mt-6 grid grid-cols-2 gap-2 md:gap-4 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Card 1: Active Merchants */}
            <CardPremium variant="outline">
              <CardBodyPremium className="p-2 md:p-4">
                <div className="text-center space-y-1">
                  {/* Number - CYAN gradient (VISIBLE) - SMALLER */}
                  <div className="text-2xl md:text-4xl font-black bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent">
                    1,247
                  </div>
                  
                  {/* Icon + Label - CLEAR and BOLD */}
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-lg md:text-2xl">ðŸª</span>
                    <p className="text-xs md:text-sm font-bold text-white leading-tight">
                      CommerÃ§ants
                    </p>
                    <p className="text-xs font-semibold text-cyan-300">
                      actifs
                    </p>
                  </div>
                </div>
              </CardBodyPremium>
            </CardPremium>

            {/* Card 2: Pi Processed */}
            <CardPremium variant="outline">
              <CardBodyPremium className="p-2 md:p-4">
                <div className="text-center space-y-1">
                  {/* Number - CYAN gradient (VISIBLE) - SMALLER */}
                  <div className="text-2xl md:text-4xl font-black bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent">
                    12,456
                  </div>
                  
                  {/* Icon + Label - CLEAR and BOLD */}
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-lg md:text-2xl">ðŸ’°</span>
                    <p className="text-xs md:text-sm font-bold text-white leading-tight">
                      Pi
                    </p>
                    <p className="text-xs font-semibold text-cyan-300">
                      traitÃ©s
                    </p>
                  </div>
                </div>
              </CardBodyPremium>
            </CardPremium>
          </motion.div>

          {/* Bottom accent line */}
          <motion.div
            className="mt-4 md:mt-6 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-full w-full"
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
          message="âœ… Authentification rÃ©ussie!"
          variant="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default LoginPage;

