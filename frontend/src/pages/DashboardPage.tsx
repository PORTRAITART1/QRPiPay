/**
 * ðŸ“Š Dashboard Page - Premium Design (Navy + Cyan)
 * Main interface for merchants
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { usePaymentStore } from '../store/paymentStore';
import { ButtonPremium } from '../components/ButtonPremium';
import { CardPremium, CardBodyPremium } from '../components/CardPremium';
import { BadgePremium } from '../components/BadgePremium';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { payments } = usePaymentStore();
  const [totalToday, setTotalToday] = useState('0.00');
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const total = payments
      .reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0)
      .toFixed(2);
    setTotalToday(total);

    const pending = payments.filter((p) => p.status === 'pending').length;
    setPendingCount(pending);

    const completed = payments.filter((p) => p.status === 'completed').length;
    setCompletedCount(completed);
  }, [payments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4 md:p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
              Bonjour, {user?.username}! ðŸ‘‹
            </h1>
            <p className="text-cyan-200 text-sm md:text-base mt-1">
              Voici votre activitÃ© d'aujourd'hui
            </p>
          </div>
          <ButtonPremium
            variant="secondary"
            size="md"
            onClick={logout}
            className="whitespace-nowrap"
          >
            DÃ©connexion
          </ButtonPremium>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Total Revenue */}
          <CardPremium variant="glow">
            <CardBodyPremium className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-cyan-200 text-xs md:text-sm font-semibold">
                    ðŸ’° Total Aujourd'hui
                  </p>
                  <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent mt-2">
                    {totalToday}
                  </p>
                  <p className="text-cyan-300 font-bold text-sm md:text-base mt-1">
                    Pi
                  </p>
                </div>
              </div>
              <BadgePremium variant="success" size="sm">
                âœ“ ComplÃ©tÃ©s
              </BadgePremium>
            </CardBodyPremium>
          </CardPremium>

          {/* Pending Payments */}
          <CardPremium variant="glow">
            <CardBodyPremium className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-cyan-200 text-xs md:text-sm font-semibold">
                    â³ En Attente
                  </p>
                  <p className="text-3xl md:text-4xl font-black text-cyan-300 mt-2">
                    {pendingCount}
                  </p>
                  <p className="text-cyan-300 font-bold text-sm md:text-base mt-1">
                    Paiement{pendingCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <BadgePremium variant="warning" size="sm">
                âŒ› En cours
              </BadgePremium>
            </CardBodyPremium>
          </CardPremium>

          {/* Completed Transactions */}
          <CardPremium variant="glow">
            <CardBodyPremium className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-cyan-200 text-xs md:text-sm font-semibold">
                    âœ“ ComplÃ©tÃ©s
                  </p>
                  <p className="text-3xl md:text-4xl font-black text-cyan-300 mt-2">
                    {completedCount}
                  </p>
                  <p className="text-cyan-300 font-bold text-sm md:text-base mt-1">
                    Transaction{completedCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <BadgePremium variant="success" size="sm">
                ðŸŽ‰ RÃ©ussi{completedCount !== 1 ? 's' : ''}
              </BadgePremium>
            </CardBodyPremium>
          </CardPremium>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CardPremium variant="glow">
            <CardBodyPremium>
              <h2 className="text-lg md:text-xl font-black text-white mb-4">
                ðŸ’Ž Actions Rapides
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <ButtonPremium
                  variant="primary"
                  size="md"
                  className="w-full text-xs md:text-sm"
                  onClick={() => navigate('/qr-generator')}
                >
                  ðŸ”² Nouveau QR
                </ButtonPremium>
                <ButtonPremium
                  variant="secondary"
                  size="md"
                  className="w-full text-xs md:text-sm"
                  onClick={() => navigate('/history')}
                >
                  ðŸ“‹ Historique
                </ButtonPremium>
                <ButtonPremium
                  variant="secondary"
                  size="md"
                  className="w-full text-xs md:text-sm"
                  onClick={() => navigate('/analytics')}
                >
                  ðŸ“Š Analytics
                </ButtonPremium>
                <ButtonPremium
                  variant="outline"
                  size="md"
                  className="w-full text-xs md:text-sm"
                >
                  âš™ï¸ ParamÃ¨tres
                </ButtonPremium>
              </div>
            </CardBodyPremium>
          </CardPremium>
        </motion.div>

        {/* Recent Payments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CardPremium variant="glow">
            <CardBodyPremium>
              <h2 className="text-lg md:text-xl font-black text-white mb-4">
                ðŸ’¼ Derniers paiements
              </h2>

              {payments.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <p className="text-cyan-200 text-sm md:text-base font-medium">
                    Aucun paiement pour le moment
                  </p>
                  <ButtonPremium
                    variant="primary"
                    size="md"
                    className="mt-4 w-full md:w-auto"
                    onClick={() => navigate('/qr-generator')}
                  >
                    CrÃ©er un paiement
                  </ButtonPremium>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.slice(0, 5).map((payment, idx) => (
                    <motion.div
                      key={payment.id}
                      className="flex justify-between items-center p-3 md:p-4 bg-white/5 rounded-lg border border-cyan-500/30 hover:bg-white/10 hover:border-cyan-400/50 transition-all"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm md:text-base truncate">
                          {payment.memo}
                        </p>
                        <p className="text-xs md:text-sm text-cyan-300">
                          {payment.createdAt.toLocaleTimeString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-white font-bold text-sm md:text-base">
                          {payment.amount.toFixed(2)} Pi
                        </p>
                        <BadgePremium
                          variant={
                            payment.status === 'completed'
                              ? 'success'
                              : payment.status === 'pending'
                              ? 'warning'
                              : 'error'
                          }
                          size="xs"
                        >
                          {payment.status === 'completed'
                            ? 'âœ“ ComplÃ©tÃ©'
                            : payment.status === 'pending'
                            ? 'â³ En attente'
                            : 'âœ• Ã‰chouÃ©'}
                        </BadgePremium>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {payments.length > 5 && (
                <ButtonPremium
                  variant="ghost"
                  size="md"
                  className="w-full mt-4 text-cyan-300 hover:text-cyan-100"
                  onClick={() => navigate('/history')}
                >
                  Voir tous les paiements â†’
                </ButtonPremium>
              )}
            </CardBodyPremium>
          </CardPremium>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
