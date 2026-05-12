/**
 * 📊 Dashboard Page - Main interface
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { usePaymentStore } from '../store/paymentStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { payments } = usePaymentStore();
  const [totalToday, setTotalToday] = useState('0.00');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const total = payments
      .reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0)
      .toFixed(2);
    setTotalToday(total);

    const pending = payments.filter((p) => p.status === 'pending').length;
    setPendingCount(pending);
  }, [payments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pi-gray-900 to-pi-gray-800 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              Bonjour, {user?.username}! 👋
            </h1>
            <p className="text-pi-gray-400">
              Voici votre activité d'aujourd'hui
            </p>
          </div>
          <Button variant="ghost" onClick={logout}>
            Déconnexion
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-pi-gray-400 text-sm font-medium">Total</p>
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pi-purple-400 to-pi-orange-400">
                    {totalToday} Pi
                  </p>
                </div>
                <div className="text-3xl">📊</div>
              </div>
              <p className="text-xs text-pi-gray-400">+23% vs hier</p>
            </div>
          </Card>

          <Card variant="glass">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-pi-gray-400 text-sm font-medium">
                    En cours
                  </p>
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pi-orange-400 to-pi-orange-300">
                    {pendingCount}
                  </p>
                </div>
                <div className="text-3xl">⏳</div>
              </div>
              <p className="text-xs text-pi-gray-400">paiements en attente</p>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glass">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">💎 Actions Rapides</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="primary" 
                  className="w-full text-sm"
                  onClick={() => navigate('/qr-generator')}
                >
                  🔲 Nouveau QR
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full text-sm"
                  onClick={() => navigate('/history')}
                >
                  📋 Historique
                </Button>
                <Button variant="secondary" className="w-full text-sm">
                  📊 Analytics
                </Button>
                <Button variant="secondary" className="w-full text-sm">
                  ⚙️ Paramètres
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Payments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="glass">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">💼 Derniers paiements</h2>

              {payments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-pi-gray-400 text-sm">
                    Aucun paiement pour le moment
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.slice(0, 5).map((payment) => (
                    <motion.div
                      key={payment.id}
                      className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      <div>
                        <p className="text-white font-medium">{payment.memo}</p>
                        <p className="text-xs text-pi-gray-400">
                          {payment.createdAt.toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{payment.amount} Pi</p>
                        <p
                          className={`text-xs font-medium ${
                            payment.status === 'completed'
                              ? 'text-green-400'
                              : payment.status === 'pending'
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}
                        >
                          {payment.status === 'completed'
                            ? '✓ Complété'
                            : payment.status === 'pending'
                            ? '⏳ En attente'
                            : '✕ Échoué'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {payments.length > 5 && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-center"
                  onClick={() => navigate('/history')}
                >
                  Voir tous les paiements →
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
