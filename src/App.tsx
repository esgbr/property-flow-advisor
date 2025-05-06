
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
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

const AdvancedAnalytics = lazy(() => import('@/pages/AdvancedAnalyticsPage'));

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

  // Update the router configuration to include our new routes
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout><Outlet /></MainLayout>,
      children: [
        {
          index: true,
          element: <Index />
        },
        {
          path: 'onboarding',
          element: <OnboardingPage />
        },
        {
          path: 'dashboard',
          element: <SimplifiedDashboard />
        },
        {
          path: 'auth',
          element: <AuthPage />
        },
        {
          path: 'settings',
          element: <SettingsPage />
        },
        {
          path: 'accessibility',
          element: <AccessibilitySettings />
        },
        {
          path: 'market-explorer',
          element: <MarketExplorer />
        },
        {
          path: 'calculators',
          element: <CalculatorsPage />
        },
        {
          path: 'documents',
          element: <DocumentsPage />
        },
        {
          path: 'investor-dashboard',
          element: <InvestorDashboard />
        },
        {
          path: 'deutsche-immobilien-tools',
          element: <GermanRealEstateInvestor />
        },
        {
          path: 'advanced-analytics',
          element: (
            <ErrorBoundary>
              <Suspense fallback={<PageLoader size="lg" />}>
                <AdvancedAnalytics />
              </Suspense>
            </ErrorBoundary>
          )
        }
      ]
    }
  ]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default App;
