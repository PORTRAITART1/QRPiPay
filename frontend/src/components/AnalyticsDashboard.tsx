import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from './Card';
import { Skeleton } from './Skeleton';

interface DashboardStats {
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  totalAmount: number;
  averageAmount: number;
  conversionRate: number;
}

export function AnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/analytics/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('❌ Error fetching stats:', err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <Skeleton count={3} />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📊 Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Payments */}
        <Card title="Total Payments">
          <div className="text-4xl font-bold text-purple-600">
            {stats?.totalPayments}
          </div>
          <p className="text-gray-600 text-sm mt-2">All time payments</p>
        </Card>

        {/* Completed */}
        <Card title="Completed">
          <div className="text-4xl font-bold text-green-600">
            {stats?.completedPayments}
          </div>
          <p className="text-gray-600 text-sm mt-2">Successful payments</p>
        </Card>

        {/* Pending */}
        <Card title="Pending">
          <div className="text-4xl font-bold text-orange-600">
            {stats?.pendingPayments}
          </div>
          <p className="text-gray-600 text-sm mt-2">Waiting confirmation</p>
        </Card>

        {/* Total Amount */}
        <Card title="Total Amount">
          <div className="text-4xl font-bold text-blue-600">
            π {stats?.totalAmount.toFixed(2)}
          </div>
          <p className="text-gray-600 text-sm mt-2">Total Pi received</p>
        </Card>

        {/* Average Amount */}
        <Card title="Average Amount">
          <div className="text-4xl font-bold text-indigo-600">
            π {stats?.averageAmount}
          </div>
          <p className="text-gray-600 text-sm mt-2">Per transaction</p>
        </Card>

        {/* Conversion Rate */}
        <Card title="Conversion Rate">
          <div className="text-4xl font-bold text-emerald-600">
            {stats?.conversionRate}%
          </div>
          <p className="text-gray-600 text-sm mt-2">Success rate</p>
        </Card>
      </div>

      {/* Refresh Button */}
      <button
        onClick={fetchStats}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        🔄 Refresh
      </button>
    </div>
  );
}
