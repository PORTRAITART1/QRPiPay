/**
 * 📊 Dashboard Page - Main interface
 * Refactored with new component library
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { usePaymentStore } from '../store/paymentStore';
import { Button } from '../components/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import { Badge } from '../components/Badge';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Bonjour, {user?.username}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Voici votre activité d'aujourd'hui
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Déconnexion
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Total Revenue */}
          <Card variant="elevated">
            <CardBody>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Total Aujourd'hui
                    </p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                      {totalToday} Pi
                    </p>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
                <Badge variant="success" size="sm">
                  ✓ Complétés
                </Badge>
              </div>
            </CardBody>
          </Card>

          {/* Pending Payments */}
          <Card variant="elevated">
            <CardBody>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      En Attente
                    </p>
                    <p className="text-4xl font-bold text-orange-500">
                      {pendingCount}
                    </p>
                  </div>
                  <div className="text-3xl">⏳</div>
                </div>
                <Badge variant="warning" size="sm">
                  ⌛ Paiements en cours
                </Badge>
              </div>
            </CardBody>
          </Card>

          {/* Completed Transactions */}
          <Card variant="elevated">
            <CardBody>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Complétés
                    </p>
                    <p className="text-4xl font-bold text-green-500">
                      {completedCount}
                    </p>
                  </div>
                  <div className="text-3xl">✓</div>
                </div>
                <Badge variant="success" size="sm">
                  🎉 Réussis
                </Badge>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <h2 className="text-xl font-bold">💎 Actions Rapides</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => navigate('/qr-generator')}
                >
                  🔲 Nouveau QR
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => navigate('/history')}
                >
                  📋 Historique
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => navigate('/analytics')}
                >
                  📊 Analytics
                </Button>
                <Button variant="outline" className="w-full">
                  ⚙️ Paramètres
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Recent Payments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <h2 className="text-xl font-bold">💼 Derniers paiements</h2>
            </CardHeader>
            <CardBody>
              {payments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Aucun paiement pour le moment
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
                <div className="space-y-3">
                  {payments.slice(0, 5).map((payment) => (
                    <motion.div
                      key={payment.id}
                      className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white font-medium">
                          {payment.memo}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {payment.createdAt.toLocaleTimeString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900 dark:text-white font-bold">
                          {payment.amount} Pi
                        </p>
                        <Badge variant={
                          payment.status === 'completed' ? 'success' :
                          payment.status === 'pending' ? 'warning' :
                          'error'
                        } size="sm">
                          {payment.status === 'completed'
                            ? '✓ Complété'
                            : payment.status === 'pending'
                            ? '⏳ En attente'
                            : '✕ Échoué'}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardBody>
            {payments.length > 5 && (
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="w-full justify-center"
                  onClick={() => navigate('/history')}
                >
                  Voir tous les paiements →
                </Button>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
