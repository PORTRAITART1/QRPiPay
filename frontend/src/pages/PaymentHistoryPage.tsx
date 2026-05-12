/**
 * 📜 Payment History Page
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePaymentStore } from '../store/paymentStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

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
    <div className="min-h-screen bg-gradient-to-br from-pi-gray-900 to-pi-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-black text-white">Historique Paiements</h1>
            <p className="text-pi-gray-400 text-sm">
              {filteredAndSorted.length} transaction{filteredAndSorted.length > 1 ? 's' : ''}
            </p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            ← Retour
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass">
            <div className="space-y-2">
              <p className="text-pi-gray-400 text-sm font-medium">Total</p>
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pi-purple-400 to-pi-orange-400">
                {stats.completed.toFixed(2)} Pi
              </p>
              <p className="text-xs text-green-400">Complétés</p>
            </div>
          </Card>

          <Card variant="glass">
            <div className="space-y-2">
              <p className="text-pi-gray-400 text-sm font-medium">En attente</p>
              <p className="text-2xl font-black text-yellow-400">
                {stats.pending.toFixed(2)} Pi
              </p>
              <p className="text-xs text-yellow-400">{payments.filter((p) => p.status === 'pending').length} en cours</p>
            </div>
          </Card>

          <Card variant="glass">
            <div className="space-y-2">
              <p className="text-pi-gray-400 text-sm font-medium">Transactions</p>
              <p className="text-2xl font-black text-blue-400">{stats.total}</p>
              <p className="text-xs text-blue-400">Au total</p>
            </div>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-6 flex gap-2 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {(['all', 'completed', 'pending', 'failed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-pi-purple-600 text-white'
                  : 'bg-white/5 text-pi-gray-400 hover:bg-white/10'
              }`}
            >
              {status === 'all'
                ? 'Tous'
                : status === 'completed'
                ? '✓ Complétés'
                : status === 'pending'
                ? '⏳ En attente'
                : '✕ Échoués'}
            </button>
          ))}
        </motion.div>

        {/* Sort */}
        <motion.div
          className="mb-6 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <button
            onClick={() => setSortBy('date')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              sortBy === 'date'
                ? 'bg-pi-orange-600 text-white'
                : 'bg-white/5 text-pi-gray-400 hover:bg-white/10'
            }`}
          >
            📅 Date
          </button>
          <button
            onClick={() => setSortBy('amount')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              sortBy === 'amount'
                ? 'bg-pi-orange-600 text-white'
                : 'bg-white/5 text-pi-gray-400 hover:bg-white/10'
            }`}
          >
            💰 Montant
          </button>
        </motion.div>

        {/* Payment List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="glass">
            {filteredAndSorted.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-pi-gray-400 text-lg font-medium">
                  Aucune transaction trouvée
                </p>
                <p className="text-pi-gray-500 text-sm mt-2">
                  Commencez par créer un QR code de paiement
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAndSorted.map((payment, index) => (
                  <motion.div
                    key={payment.id}
                    className="flex justify-between items-center p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                  >
                    {/* Left */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {/* Status Icon */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                            payment.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : payment.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {payment.status === 'completed'
                            ? '✓'
                            : payment.status === 'pending'
                            ? '⏳'
                            : '✕'}
                        </div>

                        {/* Details */}
                        <div>
                          <p className="text-white font-semibold">{payment.memo}</p>
                          <p className="text-xs text-pi-gray-400">
                            {payment.createdAt.toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">
                        {payment.amount.toFixed(2)} Pi
                      </p>
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
                          ? 'Complété'
                          : payment.status === 'pending'
                          ? 'En attente'
                          : 'Échoué'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Export Button */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button variant="secondary" className="w-full">
            📥 Exporter en CSV
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
