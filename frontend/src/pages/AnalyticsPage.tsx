/**
 * 📈 Advanced Analytics Page
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface AnalyticsData {
  totalPayments: number;
  totalAmount: number;
  avgPaymentValue: number;
  uniqueCustomers: number;
  successRate: number;
  qrCodesGenerated: number;
  qrCodesScanned: number;
  daily: Array<{
    date: string;
    totalPayments: number;
    totalAmount: number;
  }>;
}

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  const loadAnalytics = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/analytics/user/${user.uid}?days=${days}`
      );
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    if (!user) return;

    const url = `/api/export/${exportFormat === 'csv' ? 'payments' : 'analytics'}/${user.uid}`;
    window.location.href = url;
  };

  if (isLoading || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pi-gray-900 to-pi-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-pi-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pi-gray-900 to-pi-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-black text-white">Analytics</h1>
            <p className="text-pi-gray-400">Vue d'ensemble de vos paiements</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            ← Retour
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[7, 30, 90].map((value) => (
            <button
              key={value}
              onClick={() => setDays(value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                days === value
                  ? 'bg-pi-purple-600 text-white'
                  : 'bg-white/5 text-pi-gray-400 hover:bg-white/10'
              }`}
            >
              {value} jours
            </button>
          ))}
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glass">
            <div className="space-y-2">
              <p className="text-pi-gray-400 text-sm">Total Revenue</p>
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pi-purple-400 to-pi-orange-400">
                {analytics.totalAmount.toFixed(2)}
              </p>
              <p className="text-xs text-pi-gray-500">Pi</p>
            </div>
          </Card>

          <Card variant="glass">
            <div className="space-y-2">
              <p className="text-pi-gray-400 text-sm">Transactions</p>
              <p className="text-3xl font-black text-blue-400">
                {analytics.totalPayments}
              </p>
              <p className="text-xs text-pi-gray-500">payments</p>
            </div>
          </Card>

          <Card variant="glass">
            <div className="space-y-2">
              <p className="text-pi-gray-400 text-sm">Avg Value</p>
              <p className="text-3xl font-black text-green-400">
                {analytics.avgPaymentValue.toFixed(2)}
              </p>
              <p className="text-xs text-pi-gray-500">Pi per transaction</p>
            </div>
          </Card>

          <Card variant="glass">
            <div className="space-y-2">
              <p className="text-pi-gray-400 text-sm">Success Rate</p>
              <p className="text-3xl font-black text-orange-400">
                {analytics.successRate.toFixed(0)}%
              </p>
              <p className="text-xs text-pi-gray-500">completion</p>
            </div>
          </Card>
        </motion.div>

        {/* Export Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="glass">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">📥 Exporter les données</h2>
              <div className="flex gap-4">
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json')}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
                <Button variant="primary" onClick={handleExport}>
                  📥 Télécharger
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Daily Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="glass">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">📊 Statistiques quotidiennes</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {analytics.daily.length > 0 ? (
                  analytics.daily.map((day, index) => (
                    <motion.div
                      key={day.date}
                      className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div>
                        <p className="text-white font-medium">{day.date}</p>
                        <p className="text-xs text-pi-gray-400">
                          {day.totalPayments} transaction{day.totalPayments > 1 ? 's' : ''}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pi-purple-400 to-pi-orange-400">
                        {day.totalAmount.toFixed(2)} Pi
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-pi-gray-400 py-8">
                    Aucune donnée disponible
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
