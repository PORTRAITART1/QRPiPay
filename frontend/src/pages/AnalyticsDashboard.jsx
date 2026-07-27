/**
 * AnalyticsDashboard Component
 * Real-time analytics and metrics display
 */

import React, { useEffect, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';
import api from '../services/api';
import './AnalyticsDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function AnalyticsDashboard() {
  const { user } = useAuth();
  const ws = useWebSocket(user?.id);

  // State
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0,
    uniqueCustomers: 0,
    qrCodesGenerated: 0,
    successRate: 0
  });

  const [trends, setTrends] = useState([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('amount');

  // Fetch initial data
  useEffect(() => {
    fetchDashboardData();
  }, [days]);

  // Listen for real-time updates
  useEffect(() => {
    if (ws) {
      ws.subscribeToNotifications();
      
      ws.on('analytics:updated', (data) => {
        console.log('Analytics updated:', data);
        setStats(data.data || stats);
      });

      ws.on('payment:completed', (data) => {
        // Refresh data when payment completes
        fetchDashboardData();
      });
    }

    return () => {
      // Cleanup
    };
  }, [ws]);

  /**
   * Fetch dashboard statistics
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await api.get('/analytics/dashboard');
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      // Fetch trends
      const trendsResponse = await api.get(`/analytics/trends?days=${days}`);
      if (trendsResponse.data.success) {
        setTrends(trendsResponse.data.data.trends || []);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Chart data for trends
   */
  const getTrendsChartData = () => {
    const sortedTrends = [...trends].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    return {
      labels: sortedTrends.map(t => new Date(t.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Payment Amount (Pi)',
          data: sortedTrends.map(t => t.amount),
          borderColor: '#7D2FEA',
          backgroundColor: 'rgba(125, 47, 234, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Number of Payments',
          data: sortedTrends.map(t => t.count),
          borderColor: '#FF6B35',
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  /**
   * Chart data for status
   */
  const getStatusChartData = () => {
    return {
      labels: ['Completed', 'Pending'],
      datasets: [{
        data: [stats.completedPayments, stats.pendingPayments],
        backgroundColor: ['#10B981', '#F59E0B'],
        borderColor: ['#059669', '#D97706'],
        borderWidth: 2
      }]
    };
  };

  /**
   * Metric card component
   */
  const MetricCard = ({ title, value, icon, color, unit = '' }) => (
    <div className={`metric-card metric-${color}`}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-content">
        <h3>{title}</h3>
        <p className="metric-value">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {unit && <span className="metric-unit">{unit}</span>}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return <div className="analytics-loading">Chargement des statistiques...</div>;
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1>ðŸ“Š Tableau de Bord</h1>
        <div className="analytics-controls">
          <label>PÃ©riode:</label>
          <select value={days} onChange={(e) => setDays(parseInt(e.target.value))}>
            <option value={7}>7 jours</option>
            <option value={14}>14 jours</option>
            <option value={30}>30 jours</option>
            <option value={90}>90 jours</option>
          </select>
          <button onClick={fetchDashboardData} className="btn-refresh">
            ðŸ”„ Actualiser
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <MetricCard
          title="Montant Total"
          value={stats.totalAmount}
          icon="ðŸ’°"
          color="purple"
          unit=" Pi"
        />
        <MetricCard
          title="Total Paiements"
          value={stats.totalPayments}
          icon="ðŸ’³"
          color="blue"
        />
        <MetricCard
          title="ComplÃ©tÃ©s"
          value={stats.completedPayments}
          icon="âœ…"
          color="green"
        />
        <MetricCard
          title="Taux de SuccÃ¨s"
          value={`${stats.successRate}%`}
          icon="ðŸ“ˆ"
          color="orange"
        />
        <MetricCard
          title="Clients Uniques"
          value={stats.uniqueCustomers}
          icon="ðŸ‘¥"
          color="pink"
        />
        <MetricCard
          title="QR Codes"
          value={stats.qrCodesGenerated}
          icon="ðŸ“±"
          color="cyan"
        />
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h2>ðŸ“ˆ Tendances de Paiements</h2>
          <Line
            data={getTrendsChartData()}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top'
                },
                title: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>

        <div className="chart-container">
          <h2>ðŸ“Š Statut des Paiements</h2>
          <Doughnut
            data={getStatusChartData()}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Recent Trends Table */}
      <div className="trends-section">
        <h2>ðŸ“‹ Historique RÃ©cent</h2>
        {trends.length > 0 ? (
          <table className="trends-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Nombre de Paiements</th>
                <th>Montant Total</th>
                <th>ComplÃ©tÃ©s</th>
                <th>Taux de SuccÃ¨s</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((trend, idx) => (
                <tr key={idx}>
                  <td>{new Date(trend.date).toLocaleDateString('fr-FR')}</td>
                  <td>{trend.count}</td>
                  <td>{trend.amount.toFixed(2)} Pi</td>
                  <td>{trend.completed}</td>
                  <td>
                    {trend.count > 0 
                      ? ((trend.completed / trend.count) * 100).toFixed(1) 
                      : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">Aucune donnÃ©e disponible</p>
        )}
      </div>

      {/* Export Section */}
      <div className="export-section">
        <h2>ðŸ“¥ Exporter</h2>
        <button className="btn-export" onClick={() => exportToCSV()}>
          ðŸ“„ Exporter en CSV
        </button>
        <button className="btn-export" onClick={() => exportToPDF()}>
          ðŸ“• Exporter en PDF
        </button>
      </div>
    </div>
  );
}

/**
 * Export data to CSV
 */
function exportToCSV() {
  const csv = 'Date,Paiements,Montant,ComplÃ©tÃ©s\n' +
    // Add data rows
    '';
  
  const link = document.createElement('a');
  link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  link.download = 'analytics.csv';
  link.click();
}

/**
 * Export data to PDF
 */
function exportToPDF() {
  console.log('PDF export coming soon...');
  // Implement PDF export with jsPDF or similar
}

export default AnalyticsDashboard;
