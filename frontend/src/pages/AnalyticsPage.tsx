/**
 * 📈 Advanced Analytics Page
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/Button';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-orange-500 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-black text-white">📊 Analytics</h1>
            <p className="text-white/80">Vue d'ensemble de vos paiements</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            ← Retour
          </Button>
        </motion.div>

        {/* Analytics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AnalyticsDashboard />
        </motion.div>
      </div>
    </div>
  );
};
