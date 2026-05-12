/**
 * 💳 Payment Store - Zustand
 */

import { create } from 'zustand';

interface Payment {
  id: string;
  amount: number;
  memo: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  txid?: string;
}

interface PaymentState {
  payments: Payment[];
  currentPayment: Payment | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  addPayment: (payment: Payment) => void;
  setCurrentPayment: (payment: Payment | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  payments: [],
  currentPayment: null,
  isLoading: false,
  error: null,

  addPayment: (payment) =>
    set((state) => ({
      payments: [payment, ...state.payments],
    })),

  setCurrentPayment: (payment) =>
    set({ currentPayment: payment }),

  setError: (error) =>
    set({ error }),

  setLoading: (loading) =>
    set({ isLoading: loading }),
}));
