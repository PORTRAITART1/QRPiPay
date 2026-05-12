/**
 * 📱 Payment Confirmation Page
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePaymentStore } from '../store/paymentStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const PaymentConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentPayment } = usePaymentStore();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (!currentPayment) {
      navigate('/dashboard');
    }

    // Confetti animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [currentPayment, navigate]);

  if (!currentPayment) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-800 p-6 flex items-center justify-center relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <>
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-300 rounded-full"
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
        <Card variant="glass" hover={false}>
          <div className="text-center space-y-8">
            {/* Success Icon */}
            <motion.div
              className="text-7xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
            >
              ✓
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-black text-white mb-2">
                Paiement Reçu!
              </h1>
              <p className="text-green-200 text-sm font-medium">
                Transaction confirmée avec succès
              </p>
            </motion.div>

            {/* Amount */}
            <motion.div
              className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-green-200 text-sm font-medium mb-2">Montant reçu</p>
              <p className="text-5xl font-black text-green-300">
                {currentPayment.amount.toFixed(2)}
              </p>
              <p className="text-2xl text-green-300 font-bold mt-2">Pi</p>
            </motion.div>

            {/* Details */}
            <motion.div
              className="space-y-3 text-left bg-white/5 border border-white/10 rounded-xl p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-pi-gray-400 text-sm">Objet</span>
                <span className="text-white font-semibold">{currentPayment.memo}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-pi-gray-400 text-sm">Date</span>
                <span className="text-white font-semibold">
                  {currentPayment.createdAt.toLocaleString('fr-FR')}
                </span>
              </div>
              {currentPayment.txid && (
                <div className="flex justify-between items-center">
                  <span className="text-pi-gray-400 text-sm">TxID</span>
                  <span className="text-white font-mono text-xs truncate">
                    {currentPayment.txid}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Actions */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button variant="secondary" size="md" onClick={() => navigate('/dashboard')}>
                📋 Tableau de bord
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/qr-generator')}
              >
                Nouveau QR →
              </Button>
            </motion.div>

            {/* Footer */}
            <motion.p
              className="text-xs text-pi-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Un reçu a été envoyé à votre adresse email
            </motion.p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
