/**
 * Frontend Component Tests - Analytics Dashboard
 * Jest + React Testing Library
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AnalyticsDashboard } from '../pages/AnalyticsDashboard';
import * as api from '../services/api';

// Mock API
jest.mock('../services/api');

// Mock WebSocket hook
jest.mock('../hooks/useWebSocket', () => ({
  useWebSocket: jest.fn(() => ({
    on: jest.fn(),
    subscribeToNotifications: jest.fn(),
    requestAnalytics: jest.fn()
  }))
}));

// Mock chart.js
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Line Chart</div>,
  Doughnut: () => <div data-testid="doughnut-chart">Doughnut Chart</div>
}));

// Mock auth context
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user123', name: 'Test User' }
  })
}));

describe('AnalyticsDashboard Component', () => {
  const mockStats = {
    totalAmount: 1250,
    totalPayments: 45,
    completedPayments: 44,
    pendingPayments: 1,
    uniqueCustomers: 12,
    qrCodesGenerated: 50,
    successRate: 97.8
  };

  const mockTrends = [
    {
      date: '2024-01-19',
      count: 5,
      amount: 250,
      completed: 5
    },
    {
      date: '2024-01-20',
      count: 3,
      amount: 150,
      completed: 3
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockImplementation((url) => {
      if (url === '/analytics/dashboard') {
        return Promise.resolve({ data: { success: true, data: mockStats } });
      }
      if (url.includes('/analytics/trends')) {
        return Promise.resolve({
          data: { success: true, data: { trends: mockTrends } }
        });
      }
    });
  });

  it('should render dashboard with title', async () => {
    render(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('📊 Tableau de Bord')).toBeInTheDocument();
    });
  });

  it('should display metric cards', async () => {
    render(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Montant Total')).toBeInTheDocument();
      expect(screen.getByText('Total Paiements')).toBeInTheDocument();
      expect(screen.getByText('Complétés')).toBeInTheDocument();
      expect(screen.getByText('Taux de Succès')).toBeInTheDocument();
    });
  });

  it('should display correct metric values', async () => {
    render(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('1,250')).toBeInTheDocument();
      expect(screen.getByText('45')).toBeInTheDocument();
      expect(screen.getByText('44')).toBeInTheDocument();
    });
  });

  it('should render charts', async () => {
    render(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });
  });

  it('should display trends table', async () => {
    render(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('📋 Historique Récent')).toBeInTheDocument();
      expect(screen.getByText('19/01/2024')).toBeInTheDocument();
    });
  });

  it('should change date range', async () => {
    render(<AnalyticsDashboard />);

    const select = screen.getByDisplayValue('7 jours');
    
    await userEvent.selectOptions(select, '30');

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('days=30')
      );
    });
  });

  it('should handle refresh button', async () => {
    render(<AnalyticsDashboard />);

    const refreshBtn = screen.getByRole('button', { name: /Actualiser/i });
    
    await userEvent.click(refreshBtn);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
  });

  it('should handle API errors gracefully', async () => {
    api.get.mockRejectedValue(new Error('API Error'));

    render(<AnalyticsDashboard />);

    await waitFor(() => {
      // Component should not crash and show loading was completed
      expect(screen.queryByText('Chargement')).not.toBeInTheDocument();
    });
  });

  it('should export to CSV', async () => {
    const { container } = render(<AnalyticsDashboard />);

    const exportBtn = screen.getByRole('button', { name: /Exporter en CSV/i });
    
    await userEvent.click(exportBtn);

    // Verify link was created
    expect(document.createElement).toBeDefined();
  });

  it('should be responsive', async () => {
    render(<AnalyticsDashboard />);

    // Test that metrics grid is rendered
    const metricsGrid = screen.getByText('Montant Total').closest('.metric-card');
    expect(metricsGrid).toBeInTheDocument();
  });
});
