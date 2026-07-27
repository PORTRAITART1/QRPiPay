/**
 * ðŸ“± Payment Confirmation Page - Premium Design (Navy + Cyan)
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePaymentStore } from '../store/paymentStore';
import { ButtonPremium } from '../components/ButtonPremium';
import { CardPremium, CardBodyPremium } from '../components/CardPremium';
import { BadgePremium } from '../components/BadgePremium';

export const PaymentConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentPayment } = usePaymentStore();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (!currentPayment) {
      navigate('/dashboard');
    }

    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [currentPayment, navigate]);

  if (!currentPayment) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4 md:p-6 flex items-center justify-center relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <>
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-300 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -10,
                opacity: 1,
              }}
              animate={{
                y: window.innerHeight + 10,
                opacity: 0,
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                delay: Math.random() * 0.5,
              }}
            />
          ))}
        </>
      )}

      <motion.div
        className="relative z-10 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CardPremium variant="glow">
          <CardBodyPremium className="space-y-6 md:space-y-8">
            {/* Success Icon */}
            <motion.div
              className="text-6xl md:text-7xl text-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
            >
              âœ“
            </motion.div>

            {/* Title */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Paiement ReÃ§u! ðŸŽ‰
              </h1>
              <p className="text-cyan-200 text-sm md:text-base font-semibold">
                Transaction confirmÃ©e avec succÃ¨s
              </p>
            </motion.div>

            {/* Amount */}
            <motion.div
              className="p-4 md:p-6 bg-gradient-to-br from-green-500/20 to-green-500/10 border border-green-400/30 rounded-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-green-200 text-xs md:text-sm font-bold mb-2">
                MONTANT REÃ‡U
              </p>
              <p className="text-4xl md:text-5xl font-black text-green-300">
                {currentPayment.amount.toFixed(2)}
              </p>
              <p className="text-xl md:text-2xl text-green-300 font-bold mt-2">
                Pi
              </p>
            </motion.div>

            {/* Details */}
            <motion.div
              className="space-y-3 bg-white/5 border border-cyan-500/30 rounded-xl p-4 md:p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between items-start pb-3 border-b border-cyan-500/20">
                <span className="text-cyan-200 text-xs md:text-sm font-bold">
                  OBJET
                </span>
                <span className="text-white font-semibold text-xs md:text-sm text-right">
                  {currentPayment.memo}
                </span>
              </div>
              <div className="flex justify-between items-start pb-3 border-b border-cyan-500/20">
                <span className="text-cyan-200 text-xs md:text-sm font-bold">
                  DATE
                </span>
                <span className="text-white font-semibold text-xs md:text-sm text-right">
                  {currentPayment.createdAt.toLocaleString('fr-FR')}
                </span>
              </div>
              {currentPayment.txid && (
                <div className="flex justify-between items-start">
                  <span className="text-cyan-200 text-xs md:text-sm font-bold">
                    TXID
                  </span>
                  <span className="text-cyan-300 font-mono text-xs truncate ml-2 text-right">
                    {currentPayment.txid}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Status Badge */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <BadgePremium variant="success" size="md">
                âœ“ ConfirmÃ©
              </BadgePremium>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ButtonPremium
                variant="secondary"
                size="md"
                onClick={() => navigate('/dashboard')}
                className="text-xs md:text-sm font-bold"
              >
                ðŸ“‹ Tableau de bord
              </ButtonPremium>
              <ButtonPremium
                variant="primary"
                size="md"
                onClick={() => navigate('/qr-generator')}
                className="text-xs md:text-sm font-bold"
              >
                Nouveau QR â†’
              </ButtonPremium>
            </motion.div>

            {/* Footer */}
            <motion.p
              className="text-xs md:text-sm text-cyan-300 text-center font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              âœ‰ï¸ Un reÃ§u a Ã©tÃ© envoyÃ© Ã  votre adresse email
            </motion.p>
          </CardBodyPremium>
        </CardPremium>
      </motion.div>
    </div>
  );
};

export default PaymentConfirmationPage;
