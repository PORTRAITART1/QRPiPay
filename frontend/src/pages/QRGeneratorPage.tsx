/**
 * 🔲 QR Code Generator Page - Hero Feature
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QRCode from 'qrcode.react';
import { useAuthStore } from '../store/authStore';
import { usePaymentStore } from '../store/paymentStore';
import { mockPiSDK } from '../services/mockPiSDK';
import { Button } from '../components/Button';
import { Card, CardHeader, CardBody } from '../components/Card';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';

interface QRPaymentData {
  amount: number;
  memo: string;
  timestamp: number;
  userId: string;
}

export const QRGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addPayment, setCurrentPayment, setError, setLoading } = usePaymentStore();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [qrData, setQrData] = useState<QRPaymentData | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState({ amount: '', description: '' });

  const validateForm = (): boolean => {
    const newErrors = { amount: '', description: '' };

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }

    if (parseFloat(amount) > 1000000) {
      newErrors.amount = 'Le montant maximum est 1,000,000 Pi';
    }

    if (!description.trim()) {
      newErrors.description = 'Veuillez entrer une description';
    }

    if (description.length > 200) {
      newErrors.description = 'Maximum 200 caractères';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleGenerateQR = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    setLoading(true);

    try {
      // Créer le paiement
      const paymentId = await mockPiSDK.createPayment(
        parseFloat(amount),
        description,
        { userId: user?.uid }
      );

      // Générer données QR
      const qrPaymentData: QRPaymentData = {
        amount: parseFloat(amount),
        memo: description,
        timestamp: Date.now(),
        userId: user?.uid || '',
      };

      setQrData(qrPaymentData);

      // Ajouter au store
      addPayment({
        id: paymentId,
        amount: parseFloat(amount),
        memo: description,
        status: 'pending',
        createdAt: new Date(),
      });

      setShowQR(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  const handleNumPad = (num: string) => {
    if (num === '⌫') {
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

  if (showQR && qrData) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-pi-gray-900 to-pi-gray-800 p-6 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card variant="glass" className="max-w-md w-full">
          <div className="text-center space-y-6">
            {/* Header */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-3xl font-black text-white mb-2">QR Prêt</h1>
              <p className="text-pi-gray-400">Montrez ce code au client</p>
            </motion.div>

            {/* QR Code */}
            <motion.div
              className="bg-white p-6 rounded-2xl inline-block shadow-2xl"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <QRCode
                value={JSON.stringify(qrData)}
                size={300}
                level="H"
                includeMargin={true}
                renderAs="canvas"
              />
            </motion.div>

            {/* Amount Display */}
            <motion.div
              className="space-y-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-pi-gray-400 text-sm">Montant</p>
              <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pi-purple-400 to-pi-orange-400">
                {qrData.amount.toFixed(2)}
              </p>
              <p className="text-2xl text-pi-purple-300">Pi</p>
            </motion.div>

            {/* Description */}
            <motion.div
              className="p-4 bg-white/5 rounded-xl border border-white/10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-white font-semibold">{qrData.memo}</p>
              <p className="text-xs text-pi-gray-400 mt-2">
                Généré à {new Date(qrData.timestamp).toLocaleTimeString('fr-FR')}
              </p>
            </motion.div>

            {/* Timer */}
            <motion.div
              className="flex justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-sm text-pi-orange-400 font-semibold">
                ⏱️ Expire dans 05:00
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-xs text-blue-200">
                💡 Le client scanne ce code avec son application Pi Browser
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowQR(false)}
              >
                ← Retour
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleReset}
              >
                Nouveau →
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pi-gray-900 to-pi-gray-800 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-black text-white">Nouveau Paiement</h1>
            <p className="text-pi-gray-400 text-sm">Générez un QR code de paiement</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            ← Retour
          </Button>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass">
            <div className="space-y-6">
              {/* Amount Input */}
              <Input
                label="Montant en Pi"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                error={errors.amount}
                hint="Montant maximum: 1,000,000 Pi"
                required
              />

              {/* Numeric Keypad */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <p className="text-xs text-pi-gray-400 font-semibold uppercase">
                  Clavier Numérique
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {['7', '8', '9', '⌫', '4', '5', '6', '.', '1', '2', '3', '0'].map(
                    (num) => (
                      <motion.button
                        key={num}
                        onClick={() => handleNumPad(num)}
                        className="py-3 bg-gradient-to-br from-white/20 to-white/5 text-white font-semibold rounded-lg border border-white/20 hover:border-white/40 hover:bg-gradient-to-br hover:from-white/30 hover:to-white/10 transition-all"
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
              <Input
                label="Description (optionnel)"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                placeholder="Ex: Café Latte + Croissant"
                error={errors.description}
                hint={`${description.length}/200 caractères`}
              />

              {/* Summary */}
              {amount && (
                <motion.div
                  className="p-4 bg-gradient-to-r from-pi-purple-500/20 to-pi-orange-500/20 border border-pi-purple-500/30 rounded-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm text-pi-gray-300">
                    <span className="font-bold text-white">
                      {parseFloat(amount || '0').toFixed(2)} Pi
                    </span>
                    {description && (
                      <>
                        {' '}pour <span className="font-semibold">{description}</span>
                      </>
                    )}
                  </p>
                </motion.div>
              )}

              {/* Generate Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleGenerateQR}
                loading={isGenerating}
                disabled={isGenerating || !amount}
                className="w-full"
              >
                🔲 Générer QR Code
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Help Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Card variant="glass">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">💡 Comment ça fonctionne?</h3>
              <ol className="text-xs text-pi-gray-300 space-y-2 list-decimal list-inside">
                <li>Entrez le montant en Pi</li>
                <li>Ajoutez une description (optionnel)</li>
                <li>Générez le QR code</li>
                <li>Le client scanne le code</li>
                <li>La transaction se confirme automatiquement</li>
              </ol>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
