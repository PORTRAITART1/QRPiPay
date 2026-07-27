/**
 * ðŸ§ª Beta Admin Dashboard
 * Manage beta applications and testers
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ButtonPremium } from '../components/ButtonPremium';
import { CardPremium, CardBodyPremium, CardHeaderPremium } from '../components/CardPremium';
import { BadgePremium } from '../components/BadgePremium';
import { Toast } from '../components/Toast';

interface BetaApplication {
  id: string;
  name: string;
  email: string;
  piAddress: string;
  experience: string;
  status: string;
  appliedAt: string;
}

export const BetaAdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<BetaApplication[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    active: 0,
    availableSlots: 20,
  });
  const [filter, setFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch applications
  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/beta/applications', {
        headers: {
          'x-admin-key': process.env.REACT_APP_ADMIN_KEY || '',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/beta/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/beta/applications/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': process.env.REACT_APP_ADMIN_KEY || '',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setToastMessage(`âœ… Application ${status.toLowerCase()}`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        fetchApplications();
        fetchStats();
      }
    } catch (error) {
      console.error('Update error:', error);
      setToastMessage('âŒ Error updating status');
      setShowToast(true);
    }
  };

  const filteredApplications = applications.filter((app) =>
    filter === 'ALL' ? true : app.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'ACTIVE':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black mb-4 text-cyan-400">Beta Admin Dashboard</h1>
          <p className="text-cyan-200">Manage beta applications and testers</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { label: 'Total', value: stats.total, color: 'text-cyan-400' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
            { label: 'Approved', value: stats.approved, color: 'text-green-400' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-400' },
            { label: 'Active', value: stats.active, color: 'text-blue-400' },
            { label: 'Available', value: stats.availableSlots, color: 'text-purple-400' },
          ].map((stat) => (
            <CardPremium key={stat.label} variant="outline">
              <CardBodyPremium className="text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
              </CardBodyPremium>
            </CardPremium>
          ))}
        </motion.div>

        {/* Filter & Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CardPremium variant="glow" className="mb-8">
            <CardHeaderPremium>
              <h2 className="text-xl font-bold text-cyan-300">Applications</h2>
            </CardHeaderPremium>
            <CardBodyPremium>
              {/* Filters */}
              <div className="mb-6 flex gap-2 flex-wrap">
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'ACTIVE'].map((status) => (
                  <ButtonPremium
                    key={status}
                    variant={filter === status ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(status)}
                  >
                    {status}
                  </ButtonPremium>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b-2 border-cyan-500">
                    <tr>
                      <th className="text-left py-3 px-4 text-cyan-300 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 text-cyan-300 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-cyan-300 font-semibold">Pi User</th>
                      <th className="text-left py-3 px-4 text-cyan-300 font-semibold">
                        Experience
                      </th>
                      <th className="text-left py-3 px-4 text-cyan-300 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-cyan-300 font-semibold">Applied</th>
                      <th className="text-left py-3 px-4 text-cyan-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-4 text-center text-gray-400">
                          Loading...
                        </td>
                      </tr>
                    ) : filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-4 text-center text-gray-400">
                          No applications found
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((app) => (
                        <tr key={app.id} className="border-b border-slate-700 hover:bg-slate-800">
                          <td className="py-3 px-4 text-white">{app.name}</td>
                          <td className="py-3 px-4 text-cyan-200">{app.email}</td>
                          <td className="py-3 px-4 text-cyan-200">{app.piAddress}</td>
                          <td className="py-3 px-4">
                            <BadgePremium variant="secondary" size="sm">
                              {app.experience}
                            </BadgePremium>
                          </td>
                          <td className="py-3 px-4">
                            <BadgePremium
                              variant={getStatusColor(app.status) as any}
                              size="sm"
                            >
                              {app.status}
                            </BadgePremium>
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-sm">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {app.status === 'PENDING' && (
                                <>
                                  <ButtonPremium
                                    variant="primary"
                                    size="sm"
                                    onClick={() => updateStatus(app.id, 'APPROVED')}
                                  >
                                    âœ…
                                  </ButtonPremium>
                                  <ButtonPremium
                                    variant="danger"
                                    size="sm"
                                    onClick={() => updateStatus(app.id, 'REJECTED')}
                                  >
                                    âŒ
                                  </ButtonPremium>
                                </>
                              )}
                              {app.status === 'APPROVED' && (
                                <ButtonPremium
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => updateStatus(app.id, 'ACTIVE')}
                                >
                                  Activate
                                </ButtonPremium>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardBodyPremium>
          </CardPremium>
        </motion.div>
      </div>

      {showToast && (
        <Toast message={toastMessage} variant="success" onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default BetaAdminDashboard;
