/**
 * ðŸ”² QR Code Generator Page - Premium Design (Navy + Cyan)
 * PERFECTLY CENTERED CONTENT
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QRCode from 'qrcode.react';
import { useAuthStore } from '../store/authStore';
import { usePaymentStore } from '../store/paymentStore';
import { mockPiSDK } from '../services/mockPiSDK';
import { ButtonPremium } from '../components/ButtonPremium';
import { CardPremium, CardBodyPremium } from '../components/CardPremium';
import { BadgePremium } from '../components/BadgePremium';
import { InputPremium } from '../components/InputPremium';

interface QRPaymentData {
  amount: number;
  memo: string;
  timestamp: number;
  userId: string;
}

export const QRGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addPayment, setError, setLoading } = usePaymentStore();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [qrData, setQrData] = useState<QRPaymentData | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState({ amount: '', description: '' });

  const validateForm = (): boolean => {
    const newErrors = { amount: '', description: '' };

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Le montant doit Ãªtre supÃ©rieur Ã  0';
    }

    if (parseFloat(amount) > 1000000) {
      newErrors.amount = 'Le montant maximum est 1,000,000 Pi';
    }

    if (!description.trim()) {
      newErrors.description = 'Veuillez entrer une description';
    }

    if (description.length > 200) {
      newErrors.description = 'Maximum 200 caractÃ¨res';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleGenerateQR = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    setLoading(true);

    try {
      const paymentId = await mockPiSDK.createPayment(
        parseFloat(amount),
        description,
        { userId: user?.uid }
      );

      const qrPaymentData: QRPaymentData = {
        amount: parseFloat(amount),
        memo: description,
        timestamp: Date.now(),
        userId: user?.uid || '',
      };

      setQrData(qrPaymentData);

      addPayment({
        id: paymentId,
        amount: parseFloat(amount),
        memo: description,
        status: 'pending',
        createdAt: new Date(),
      });

      setShowQR(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la gÃ©nÃ©ration');
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  const handleNumPad = (num: string) => {
    if (num === 'âŒ«') {
      setAmount(amount.slice(0, -1));
    } else if (num === '.') {
      if (!amount.includes('.')) {
        setAmount(amount + num);
      }
    } else {
      setAmount(amount + num);
    }
  };

  const handleReset = () => {
    setAmount('');
    setDescription('');
    setQrData(null);
    setShowQR(false);
    setErrors({ amount: '', description: '' });
  };

  // QR Display Screen - PERFECTLY CENTERED
  if (showQR && qrData) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-x-hidden overflow-y-auto flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <CardPremium variant="glow">
            <CardBodyPremium className="space-y-6 flex flex-col items-center">
              {/* Header */}
              <motion.div
                className="text-center space-y-2 w-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-3xl md:text-4xl font-black text-white">
                  QR PrÃªt! âœ“
                </h1>
                <p className="text-cyan-200 text-sm md:text-base">
                  Montrez ce code au client
                </p>
              </motion.div>

              {/* QR Code - PERFECTLY CENTERED */}
              <motion.div
                className="flex justify-center w-full"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl">
                  <QRCode
                    value={JSON.stringify(qrData)}
                    size={250}
                    level="H"
                    includeMargin={true}
                    renderAs="canvas"
                  />
                </div>
              </motion.div>

              {/* Amount Display */}
              <motion.div
                className="space-y-2 text-center w-full"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-cyan-200 text-xs md:text-sm font-semibold">
                  MONTANT Ã€ PAYER
                </p>
                <p className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent">
                  {qrData.amount.toFixed(2)}
                </p>
                <p className="text-2xl font-bold text-cyan-300">
                  Pi
                </p>
              </motion.div>

              {/* Description */}
              <motion.div
                className="p-3 md:p-4 bg-white/5 rounded-xl border border-cyan-500/30 w-full"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-white font-bold text-sm md:text-base text-center">
                  {qrData.memo}
                </p>
                <p className="text-xs md:text-sm text-cyan-300 mt-2 text-center">
                  GÃ©nÃ©rÃ© Ã  {new Date(qrData.timestamp).toLocaleTimeString('fr-FR')}
                </p>
              </motion.div>

              {/* Timer */}
              <motion.div
                className="flex justify-center w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <BadgePremium variant="info" size="md">
                  â±ï¸ Expire dans 05:00
                </BadgePremium>
              </motion.div>

              {/* Info */}
              <motion.div
                className="p-3 md:p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-xs md:text-sm text-cyan-100 text-center font-medium">
                  ðŸ’¡ Le client scanne ce code avec son application Pi Browser
                </p>
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="grid grid-cols-2 gap-3 w-full"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <ButtonPremium
                  variant="secondary"
                  size="md"
                  onClick={() => setShowQR(false)}
                  className="w-full"
                >
                  â† Retour
                </ButtonPremium>
                <ButtonPremium
                  variant="primary"
                  size="md"
                  onClick={handleReset}
                  className="w-full"
                >
                  Nouveau â†’
                </ButtonPremium>
              </motion.div>
            </CardBodyPremium>
          </CardPremium>
        </motion.div>
      </div>
    );
  }

  // Form Screen - PERFECTLY CENTERED
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4 md:p-6 overflow-x-hidden overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
              Nouveau Paiement ðŸ”²
            </h1>
            <p className="text-cyan-200 text-sm md:text-base mt-1">
              GÃ©nÃ©rez un QR code de paiement
            </p>
          </div>
          <ButtonPremium
            variant="secondary"
            size="md"
            onClick={() => navigate('/dashboard')}
            className="whitespace-nowrap"
          >
            â† Retour
          </ButtonPremium>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full"
        >
          <CardPremium variant="glow">
            <CardBodyPremium className="space-y-6">
              {/* Amount Input */}
              <div className="space-y-2 w-full">
                <label className="text-white font-bold text-sm md:text-base">
                  ðŸ’° Montant en Pi
                </label>
                <InputPremium
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  disabled={false}
                />
                {errors.amount && (
                  <p className="text-red-400 text-xs md:text-sm font-medium">
                    âš ï¸ {errors.amount}
                  </p>
                )}
                <p className="text-cyan-300 text-xs md:text-sm font-medium">
                  Maximum: 1,000,000 Pi
                </p>
              </div>

              {/* Numeric Keypad */}
              <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-4 space-y-3 w-full">
                <p className="text-cyan-200 text-xs md:text-sm font-bold uppercase">
                  âŒ¨ï¸ Clavier NumÃ©rique
                </p>
                <div className="grid grid-cols-4 gap-2 w-full">
                  {['7', '8', '9', 'âŒ«', '4', '5', '6', '.', '1', '2', '3', '0'].map(
                    (num) => (
                      <motion.button
                        key={num}
                        onClick={() => handleNumPad(num)}
                        className="py-2 md:py-3 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 text-white font-bold rounded-lg border border-cyan-500/30 hover:border-cyan-400/50 hover:bg-cyan-500/30 transition-all text-sm md:text-base w-full"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {num}
                      </motion.button>
                    )
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 w-full">
                <label className="text-white font-bold text-sm md:text-base">
                  ðŸ“ Description (optionnel)
                </label>
                <InputPremium
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                  placeholder="Ex: CafÃ© Latte + Croissant"
                  disabled={false}
                />
                {errors.description && (
                  <p className="text-red-400 text-xs md:text-sm font-medium">
                    âš ï¸ {errors.description}
                  </p>
                )}
                <p className="text-cyan-300 text-xs md:text-sm font-medium">
                  {description.length}/200 caractÃ¨res
                </p>
              </div>

              {/* Summary */}
              {amount && (
                <motion.div
                  className="p-3 md:p-4 bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/30 rounded-xl w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm md:text-base text-cyan-100 text-center">
                    <span className="font-bold text-white">
                      {parseFloat(amount || '0').toFixed(2)} Pi
                    </span>
                    {description && (
                      <>
                        {' '}pour{' '}
                        <span className="font-semibold text-cyan-100">
                          {description}
                        </span>
                      </>
                    )}
                  </p>
                </motion.div>
              )}

              {/* Generate Button */}
              <ButtonPremium
                variant="primary"
                size="lg"
                onClick={handleGenerateQR}
                disabled={isGenerating || !amount}
                className="w-full text-base md:text-lg font-bold"
              >
                ðŸ”² GÃ©nÃ©rer QR Code
              </ButtonPremium>
            </CardBodyPremium>
          </CardPremium>
        </motion.div>

        {/* Help Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 w-full"
        >
          <CardPremium variant="glow">
            <CardBodyPremium>
              <h3 className="text-sm md:text-base font-bold text-white mb-3">
                ðŸ’¡ Comment Ã§a fonctionne?
              </h3>
              <ol className="text-xs md:text-sm text-cyan-200 space-y-2 list-decimal list-inside font-medium">
                <li>Entrez le montant en Pi</li>
                <li>Ajoutez une description (optionnel)</li>
                <li>GÃ©nÃ©rez le QR code</li>
                <li>Le client scanne le code</li>
                <li>La transaction se confirme automatiquement</li>
              </ol>
            </CardBodyPremium>
          </CardPremium>
        </motion.div>
      </div>
    </div>
  );
};

export default QRGeneratorPage;
