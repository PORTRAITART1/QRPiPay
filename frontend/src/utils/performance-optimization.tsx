/**
 * Frontend Performance Optimization - Code Splitting & Lazy Loading
 * App.tsx with optimized routing
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ==========================================
// LAZY LOAD PAGES (Code Splitting)
// ==========================================

// Lazy load pages to reduce initial bundle
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const QRGeneratorPage = lazy(() => import('./pages/QRGeneratorPage'));
const PaymentHistoryPage = lazy(() => import('./pages/PaymentHistoryPage'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));
const PaymentConfirmationPage = lazy(() => import('./pages/PaymentConfirmationPage'));

// ==========================================
// LOADING FALLBACK
// ==========================================

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

// ==========================================
// ROUTE WRAPPER WITH PRELOADING
// ==========================================

const PreloadRoute = ({ element, preload }) => {
  React.useEffect(() => {
    // Preload on hover or idle
    if (preload) {
      const timer = setTimeout(() => {
        preload();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [preload]);

  return element;
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={<LoginPage />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/qr-generator"
            element={<QRGeneratorPage />}
          />

          <Route
            path="/payment-history"
            element={<PaymentHistoryPage />}
          />

          <Route
            path="/analytics"
            element={<AnalyticsDashboard />}
          />

          <Route
            path="/payment-confirmation/:id"
            element={<PaymentConfirmationPage />}
          />

          {/* Redirect */}
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// ==========================================
// COMPONENT LAZY LOADING PATTERN
// ==========================================

/**
 * Lazy load heavy components
 * Use inside components to avoid loading until needed
 */

const HeavyChart = lazy(() => import('./components/HeavyChart'));
const AdvancedAnalytics = lazy(() => import('./components/AdvancedAnalytics'));

export function DashboardWithLazyComponents() {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Always loaded */}
      <div className="metrics-grid">
        {/* Quick metrics */}
      </div>

      <button onClick={() => setShowAdvanced(!showAdvanced)}>
        Toggle Advanced Analytics
      </button>

      {/* Lazy loaded when needed */}
      {showAdvanced && (
        <Suspense fallback={<LoadingFallback />}>
          <AdvancedAnalytics />
        </Suspense>
      )}
    </div>
  );
}

// ==========================================
// IMAGE OPTIMIZATION
// ==========================================

/**
 * Optimized image component
 * Uses next-gen formats and responsive sizes
 */

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  lazy?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 400,
  height = 300,
  lazy = true
}) => (
  <picture>
    <source
      srcSet={`${src}?w=400&q=80&fm=webp 1x, ${src}?w=800&q=80&fm=webp 2x`}
      type="image/webp"
    />
    <img
      src={`${src}?w=${width}&q=80`}
      alt={alt}
      width={width}
      height={height}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
    />
  </picture>
);

// ==========================================
// BUNDLE ANALYSIS
// ==========================================

/**
 * Vite plugin for bundle analysis
 * Add to vite.config.ts:
 
import visualizer from 'rollup-plugin-visualizer';

export default {
  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
        })
      ]
    }
  }
}
*/

// ==========================================
// WEB WORKERS FOR HEAVY COMPUTATION
// ==========================================

/**
 * Use Web Workers for expensive calculations
 */

export const useWebWorker = (workerScript: string) => {
  const worker = React.useRef<Worker | null>(null);
  const [result, setResult] = React.useState(null);

  React.useEffect(() => {
    worker.current = new Worker(new URL(workerScript, import.meta.url), {
      type: 'module'
    });

    worker.current.onmessage = (event) => {
      setResult(event.data);
    };

    return () => {
      worker.current?.terminate();
    };
  }, [workerScript]);

  const send = (data: any) => {
    worker.current?.postMessage(data);
  };

  return { result, send };
};

// ==========================================
// MEMOIZATION & OPTIMIZATION HOOKS
// ==========================================

import { useMemo, useCallback, memo } from 'react';

/**
 * Optimize expensive calculations
 */
export const useMemoizedCalculation = (data: any[], dependencyList: any[]) => {
  return useMemo(() => {
    return data.reduce((sum, item) => sum + item.amount, 0);
  }, dependencyList);
};

/**
 * Memoized components to prevent re-renders
 */
export const MemoizedPaymentCard = memo(({ payment }: any) => (
  <div className="payment-card">
    {/* Content */}
  </div>
), (prev, next) => prev.payment.id === next.payment.id);

// ==========================================
// VIRTUAL SCROLLING FOR LARGE LISTS
// ==========================================

/**
 * Virtual scroll for 1000+ items
 * Uses react-window or react-virtualized
 */

import { FixedSizeList as List } from 'react-window';

export function VirtualPaymentsList({ items }: { items: any[] }) {
  const Row = ({ index, style }: any) => (
    <div style={style} className="payment-row">
      {/* Render item */}
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
}

// ==========================================
// CACHE STRATEGIES
// ==========================================

/**
 * React Query for server state management & caching
 */

import { useQuery } from '@tanstack/react-query';

export function useCachedPayments(userId: string) {
  return useQuery({
    queryKey: ['payments', userId],
    queryFn: () => fetchPayments(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

export default App;
