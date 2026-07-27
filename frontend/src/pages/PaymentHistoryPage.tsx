/**
 * ðŸ“œ Payment History Page - Premium Design (Navy + Cyan)
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePaymentStore } from '../store/paymentStore';
import { ButtonPremium } from '../components/ButtonPremium';
import { CardPremium, CardBodyPremium } from '../components/CardPremium';
import { BadgePremium } from '../components/BadgePremium';

type FilterStatus = 'all' | 'completed' | 'pending' | 'failed';

export const PaymentHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { payments } = usePaymentStore();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filteredAndSorted = useMemo(() => {
    let filtered = payments;

    if (filter !== 'all') {
      filtered = filtered.filter((p) => p.status === filter);
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        return b.amount - a.amount;
      }
    });
  }, [payments, filter, sortBy]);

  const stats = useMemo(() => {
    const completed = payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    const pending = payments
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
    const total = payments.length;

    return { completed, pending, total };
  }, [payments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4 md:p-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
              ðŸ“œ Historique Paiements
            </h1>
            <p className="text-cyan-200 text-sm md:text-base mt-1">
              {filteredAndSorted.length} transaction{filteredAndSorted.length !== 1 ? 's' : ''}
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

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Completed */}
          <CardPremium variant="glow">
            <CardBodyPremium className="space-y-3">
              <p className="text-cyan-200 text-xs md:text-sm font-semibold">
                âœ“ Total ComplÃ©tÃ©s
              </p>
              <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent">
                {stats.completed.toFixed(2)}
              </p>
              <p className="text-green-300 font-bold text-sm md:text-base">
                Pi
              </p>
              <BadgePremium variant="success" size="sm">
                âœ“ SuccÃ¨s
              </BadgePremium>
            </CardBodyPremium>
          </CardPremium>

          {/* Pending */}
          <CardPremium variant="glow">
            <CardBodyPremium className="space-y-3">
              <p className="text-cyan-200 text-xs md:text-sm font-semibold">
                â³ En Attente
              </p>
              <p className="text-3xl md:text-4xl font-black text-orange-300">
                {stats.pending.toFixed(2)}
              </p>
              <p className="text-orange-300 font-bold text-sm md:text-base">
                Pi
              </p>
              <BadgePremium variant="warning" size="sm">
                â³ En cours
              </BadgePremium>
            </CardBodyPremium>
          </CardPremium>

          {/* Total */}
          <CardPremium variant="glow">
            <CardBodyPremium className="space-y-3">
              <p className="text-cyan-200 text-xs md:text-sm font-semibold">
                ðŸ“Š Total Transactions
              </p>
              <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent">
                {stats.total}
              </p>
              <p className="text-cyan-300 font-bold text-sm md:text-base">
                Au total
              </p>
              <BadgePremium variant="info" size="sm">
                ðŸ“Š Tous
              </BadgePremium>
            </CardBodyPremium>
          </CardPremium>
        </motion.div>

        {/* Filters & Sort */}
        <motion.div
          className="mb-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'completed', 'pending', 'failed'] as const).map((status) => (
              <ButtonPremium
                key={status}
                variant={filter === status ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status === 'all'
                  ? 'Tous'
                  : status === 'completed'
                  ? 'âœ“ ComplÃ©tÃ©s'
                  : status === 'pending'
                  ? 'â³ En attente'
                  : 'âœ• Ã‰chouÃ©s'}
              </ButtonPremium>
            ))}
          </div>

          {/* Sort Buttons */}
          <div className="flex gap-2 flex-wrap">
            <ButtonPremium
              variant={sortBy === 'date' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('date')}
            >
              ðŸ“… Date
            </ButtonPremium>
            <ButtonPremium
              variant={sortBy === 'amount' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('amount')}
            >
              ðŸ’° Montant
            </ButtonPremium>
          </div>
        </motion.div>

        {/* Payment List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CardPremium variant="glow">
            <CardBodyPremium>
              {filteredAndSorted.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <p className="text-cyan-200 text-base md:text-lg font-semibold">
                    Aucune transaction trouvÃ©e
                  </p>
                  <p className="text-cyan-300 text-sm md:text-base mt-2">
                    Commencez par crÃ©er un QR code de paiement
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
                  {filteredAndSorted.map((payment, index) => (
                    <motion.div
                      key={payment.id}
                      className="flex justify-between items-center p-3 md:p-4 rounded-lg border border-cyan-500/30 bg-white/5 hover:bg-white/10 hover:border-cyan-400/50 transition-all"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      {/* Left */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Status Icon */}
                        <div
                          className={`w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center text-sm md:text-lg font-bold flex-shrink-0 ${
                            payment.status === 'completed'
                              ? 'bg-green-500/30 text-green-300'
                              : payment.status === 'pending'
                              ? 'bg-orange-500/30 text-orange-300'
                              : 'bg-red-500/30 text-red-300'
                          }`}
                        >
                          {payment.status === 'completed'
                            ? 'âœ“'
                            : payment.status === 'pending'
                            ? 'â³'
                            : 'âœ•'}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-semibold text-sm md:text-base truncate">
                            {payment.memo}
                          </p>
                          <p className="text-xs md:text-sm text-cyan-300">
                            {payment.createdAt.toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="text-right ml-4 flex-shrink-0">
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
                            ? 'ComplÃ©tÃ©'
                            : payment.status === 'pending'
                            ? 'En attente'
                            : 'Ã‰chouÃ©'}
                        </BadgePremium>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardBodyPremium>
          </CardPremium>
        </motion.div>

        {/* Export Button */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <ButtonPremium variant="secondary" size="md" className="w-full">
            ðŸ“¥ Exporter en CSV
          </ButtonPremium>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
