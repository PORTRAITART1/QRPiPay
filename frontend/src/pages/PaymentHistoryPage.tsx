/**
 * 📜 Payment History Page
 * Refactored with new component library
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePaymentStore } from '../store/paymentStore';
import { Button } from '../components/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import { Badge } from '../components/Badge';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              📜 Historique Paiements
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {filteredAndSorted.length} transaction{filteredAndSorted.length > 1 ? 's' : ''}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
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
          <Card variant="elevated">
            <CardBody>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Total Complétés
              </p>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                {stats.completed.toFixed(2)} Pi
              </p>
              <Badge variant="success" size="sm" className="mt-2">
                ✓ Succès
              </Badge>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardBody>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                En Attente
              </p>
              <p className="text-3xl font-bold text-orange-500">
                {stats.pending.toFixed(2)} Pi
              </p>
              <Badge variant="warning" size="sm" className="mt-2">
                ⏳ En cours
              </Badge>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardBody>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Total Transactions
              </p>
              <p className="text-3xl font-bold text-blue-500">
                {stats.total}
              </p>
              <Badge variant="info" size="sm" className="mt-2">
                📊 Au total
              </Badge>
            </CardBody>
          </Card>
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
              <Button
                key={status}
                variant={filter === status ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status === 'all'
                  ? 'Tous'
                  : status === 'completed'
                  ? '✓ Complétés'
                  : status === 'pending'
                  ? '⏳ En attente'
                  : '✕ Échoués'}
              </Button>
            ))}
          </div>

          {/* Sort Buttons */}
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'date' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('date')}
            >
              📅 Date
            </Button>
            <Button
              variant={sortBy === 'amount' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('amount')}
            >
              💰 Montant
            </Button>
          </div>
        </motion.div>

        {/* Payment List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="elevated">
            <CardBody>
              {filteredAndSorted.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                    Aucune transaction trouvée
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Commencez par créer un QR code de paiement
                  </p>
                  <Button 
                    variant="primary" 
                    className="mt-4"
                    onClick={() => navigate('/qr-generator')}
                  >
                    Créer un paiement
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAndSorted.map((payment, index) => (
                    <motion.div
                      key={payment.id}
                      className="flex justify-between items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                                : payment.status === 'pending'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-600'
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
                            <p className="text-gray-900 dark:text-white font-semibold">
                              {payment.memo}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {payment.createdAt.toLocaleString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="text-right">
                        <p className="text-gray-900 dark:text-white font-bold text-lg">
                          {payment.amount.toFixed(2)} Pi
                        </p>
                        <Badge variant={
                          payment.status === 'completed' ? 'success' :
                          payment.status === 'pending' ? 'warning' :
                          'error'
                        } size="sm">
                          {payment.status === 'completed'
                            ? 'Complété'
                            : payment.status === 'pending'
                            ? 'En attente'
                            : 'Échoué'}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardBody>
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

export default PaymentHistoryPage;
