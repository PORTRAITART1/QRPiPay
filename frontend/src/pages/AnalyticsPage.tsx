/**
 * ðŸ“ˆ Analytics Page - Premium Design (Navy + Cyan)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { ButtonPremium } from '../components/ButtonPremium';
import { CardPremium, CardBodyPremium } from '../components/CardPremium';
import { BadgePremium } from '../components/BadgePremium';

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

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
              ðŸ“Š Analytics
            </h1>
            <p className="text-cyan-200 text-sm md:text-base mt-1">
              Vue d'ensemble de vos paiements
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

        {/* Main Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Card 1: Total Revenue */}
          <CardPremium variant="glow">
            <CardBodyPremium className="space-y-2">
              <p className="text-cyan-200 text-xs md:text-sm font-bold">
                ðŸ’° REVENU TOTAL
              </p>
              <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent">
                25,430.00
              </p>
              <p className="text-cyan-300 font-semibold text-xs md:text-sm">
                Pi
              </p>
              <BadgePremium variant="success" size="xs">
                â†‘ 12% ce mois
              </BadgePremium>
            </CardBodyPremium>
          </CardPremium>

          {/* Card 2: Transactions */}
          <CardPremium variant="glow">
            <CardBodyPremium className="space-y-2">
              <p className="text-cyan-200 text-xs md:text-sm font-bold">
                ðŸ“‹ TRANSACTIONS
              </p>
              <p className="text-2xl md:text-3xl font-black text-cyan-300">
                1,247
              </p>
              <p className="text-cyan-300 font-semibold text-xs md:text-sm">
                Au total
              </p>
              <BadgePremium variant="success" size="xs">
                â†‘ 5% ce mois
              </BadgePremium>
            </CardBodyPremium>
          </CardPremium>

          {/* Card 3: Average Transaction */}
          <CardPremium variant="glow">
            <CardBodyPremium className="space-y-2">
              <p className="text-cyan-200 text-xs md:text-sm font-bold">
                ðŸ’µ MONTANT MOYEN
              </p>
              <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-300 to-green-100 bg-clip-text text-transparent">
                20.39
              </p>
              <p className="text-green-300 font-semibold text-xs md:text-sm">
                Pi
              </p>
              <BadgePremium variant="success" size="xs">
                â†‘ 3% ce mois
              </BadgePremium>
            </CardBodyPremium>
          </CardPremium>

          {/* Card 4: Conversion Rate */}
          <CardPremium variant="glow">
            <CardBodyPremium className="space-y-2">
              <p className="text-cyan-200 text-xs md:text-sm font-bold">
                ðŸ“ˆ TAUX CONVERSION
              </p>
              <p className="text-2xl md:text-3xl font-black text-orange-300">
                98.5%
              </p>
              <p className="text-orange-300 font-semibold text-xs md:text-sm">
                RÃ©ussite
              </p>
              <BadgePremium variant="success" size="xs">
                âœ“ Excellent
              </BadgePremium>
            </CardBodyPremium>
          </CardPremium>
        </motion.div>

        {/* Detailed Sections */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Section 1: Daily Breakdown */}
          <CardPremium variant="glow">
            <CardBodyPremium>
              <h2 className="text-lg md:text-xl font-black text-white mb-4">
                ðŸ“… ActivitÃ© Cette Semaine
              </h2>
              <div className="space-y-3">
                {[
                  { day: 'Lundi', amount: '3,245.50', transactions: 156 },
                  { day: 'Mardi', amount: '4,120.75', transactions: 189 },
                  { day: 'Mercredi', amount: '3,890.25', transactions: 172 },
                  { day: 'Jeudi', amount: '4,567.00', transactions: 198 },
                  { day: 'Vendredi', amount: '5,234.80', transactions: 215 },
                ].map((item, idx) => (
                  <motion.div
                    key={item.day}
                    className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-cyan-500/20 hover:border-cyan-400/40 transition-all"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + idx * 0.05 }}
                  >
                    <div>
                      <p className="text-white font-semibold text-sm md:text-base">
                        {item.day}
                      </p>
                      <p className="text-cyan-300 text-xs md:text-sm">
                        {item.transactions} transactions
                      </p>
                    </div>
                    <p className="text-cyan-200 font-bold text-sm md:text-base">
                      {item.amount} Pi
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardBodyPremium>
          </CardPremium>

          {/* Section 2: Top Transactions */}
          <CardPremium variant="glow">
            <CardBodyPremium>
              <h2 className="text-lg md:text-xl font-black text-white mb-4">
                ðŸ† Transactions Majeures
              </h2>
              <div className="space-y-3">
                {[
                  { item: 'Lot #5421', amount: '2,500.00', date: 'Aujourd\'hui' },
                  { item: 'Lot #5418', amount: '2,150.50', date: 'Hier' },
                  { item: 'Lot #5415', amount: '1,875.25', date: '2 jours' },
                  { item: 'Lot #5412', amount: '1,750.00', date: '3 jours' },
                  { item: 'Lot #5409', amount: '1,625.75', date: '4 jours' },
                ].map((transaction, idx) => (
                  <motion.div
                    key={transaction.item}
                    className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-cyan-500/20 hover:border-cyan-400/40 transition-all"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + idx * 0.05 }}
                  >
                    <div>
                      <p className="text-white font-semibold text-sm md:text-base">
                        {transaction.item}
                      </p>
                      <p className="text-cyan-300 text-xs md:text-sm">
                        {transaction.date}
                      </p>
                    </div>
                    <p className="text-green-300 font-bold text-sm md:text-base">
                      {transaction.amount} Pi
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardBodyPremium>
          </CardPremium>
        </motion.div>

        {/* Export Buttons */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ButtonPremium variant="secondary" size="md" className="w-full text-base font-bold">
            ðŸ“¥ Exporter CSV
          </ButtonPremium>
          <ButtonPremium variant="secondary" size="md" className="w-full text-base font-bold">
            ðŸ“Š GÃ©nÃ©rer Rapport PDF
          </ButtonPremium>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
