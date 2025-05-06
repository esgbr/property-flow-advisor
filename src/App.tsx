
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import ErrorBoundary from '@/components/ErrorBoundary';
import PageLoader from '@/components/ui/page-loader';
import AuthPage from '@/pages/AuthPage';
import SettingsPage from '@/pages/SettingsPage';
import AccessibilitySettings from '@/components/accessibility/AccessibilitySettings';
import MarketExplorer from '@/pages/MarketExplorerPage';
import CalculatorsPage from '@/pages/Calculators';
import DocumentsPage from '@/pages/DocumentsPage';
import InvestorDashboard from '@/pages/InvestorDashboard';
import GermanRealEstateInvestor from '@/pages/GermanRealEstateInvestor';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useEffect } from 'react';
import OnboardingPage from '@/pages/OnboardingPage';
import Index from '@/pages/Index';
import SimplifiedDashboard from '@/pages/SimplifiedDashboard';
import Dashboard from '@/pages/Dashboard';
import MarketComparisonTool from '@/pages/MarketComparisonTool';

const AdvancedAnalytics = lazy(() => import('@/pages/AdvancedAnalyticsPage'));

// Create routes outside of the component to avoid recreation on each render
const routes = [
  {
    path: '/',
    element: <MainLayout><Index /></MainLayout>,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />
  },
  {
    path: '/dashboard',
    element: <MainLayout><SimplifiedDashboard /></MainLayout>
  },
  {
    path: '/auth',
    element: <MainLayout><AuthPage /></MainLayout>
  },
  {
    path: '/settings',
    element: <MainLayout><SettingsPage /></MainLayout>
  },
  {
    path: '/accessibility',
    element: <MainLayout><AccessibilitySettings /></MainLayout>
  },
  {
    path: '/market-explorer',
    element: <MainLayout><MarketExplorer /></MainLayout>
  },
  {
    path: '/market-comparison',
    element: <MainLayout><MarketComparisonTool /></MainLayout>
  },
  {
    path: '/calculators',
    element: <MainLayout><CalculatorsPage /></MainLayout>
  },
  {
    path: '/documents',
    element: <MainLayout><DocumentsPage /></MainLayout>
  },
  {
    path: '/investor-dashboard',
    element: <MainLayout><InvestorDashboard /></MainLayout>
  },
  {
    path: '/deutsche-immobilien-tools',
    element: <MainLayout><GermanRealEstateInvestor /></MainLayout>
  },
  {
    path: '/advanced-analytics',
    element: (
      <MainLayout>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader size="lg" />}>
            <AdvancedAnalytics />
          </Suspense>
        </ErrorBoundary>
      </MainLayout>
    )
  }
];

const App: React.FC = () => {
  const { preferences } = useUserPreferences();

  useEffect(() => {
    // Set initial theme based on user preferences
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode]);

  // Create the router with our routes
  const router = createBrowserRouter(routes);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default App;
