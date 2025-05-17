
import React, { useEffect, lazy, Suspense } from 'react';
import './App.css';
import './styles/ScrollStyles.css';
import './styles/ios-specific.css'; // Import iOS-specific styles
import './styles/accessibility.css'; // Import accessibility styles
import './styles/dark-mode.css'; // Import dark mode styles
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import EnhancedMainLayout from '@/layouts/EnhancedMainLayout';
import ErrorBoundary from '@/components/ErrorBoundary';
import PageLoader from '@/components/ui/page-loader';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Toaster } from '@/components/ui/sonner';
import AuthPage from '@/pages/AuthPage';
import SettingsPage from '@/pages/SettingsPage';
import AccessibilitySettings from '@/components/accessibility/AccessibilitySettings';
import MarketExplorer from '@/pages/MarketExplorerPage';
import CalculatorsPage from '@/pages/Calculators';
import DocumentsPage from '@/pages/DocumentsPage';
import InvestorDashboard from '@/pages/InvestorDashboard';
import GermanRealEstateInvestor from '@/pages/GermanRealEstateInvestor';
import OnboardingPage from '@/pages/OnboardingPage';
import Index from '@/pages/Index';
import HomePage from '@/pages/HomePage';
import SimplifiedDashboard from '@/pages/SimplifiedDashboard';
import Dashboard from '@/pages/Dashboard';
import MarketComparisonTool from '@/pages/MarketComparisonTool';
import { RewardsProvider } from '@/contexts/RewardsContext';
import Rewards from '@/pages/Rewards';
import PropertyList from '@/pages/PropertyList';
import Properties from '@/pages/Properties';
import UserProfile from '@/pages/UserProfile';
import Education from '@/pages/Education';
import NotFound from '@/pages/NotFound';
import PropertyDetail from '@/pages/PropertyDetail';
import ToolsPage from '@/pages/ToolsPage';
import RegionalAnalysis from '@/pages/RegionalAnalysis';
import TaxPlanning from '@/pages/TaxPlanning';
import LanguageSettings from '@/pages/LanguageSettings';
import CRMPage from '@/pages/CRMPage';
import LockedPage from '@/pages/LockedPage';
import WorkflowsPage from '@/pages/WorkflowsPage';

// Lazy load heavy components for better initial loading performance
const AdvancedAnalytics = lazy(() => import('@/pages/AdvancedAnalyticsPage'));

// Create routes with EnhancedMainLayout 
const routes = [
  {
    path: '/',
    element: <EnhancedMainLayout><HomePage /></EnhancedMainLayout>,
  },
  {
    path: '/old',
    element: <EnhancedMainLayout><Index /></EnhancedMainLayout>,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />
  },
  {
    path: '/dashboard',
    element: <EnhancedMainLayout><SimplifiedDashboard /></EnhancedMainLayout>
  },
  {
    path: '/auth',
    element: <EnhancedMainLayout><AuthPage /></EnhancedMainLayout>
  },
  {
    path: '/settings',
    element: <EnhancedMainLayout><SettingsPage /></EnhancedMainLayout>
  },
  {
    path: '/accessibility',
    element: <EnhancedMainLayout><AccessibilitySettings /></EnhancedMainLayout>
  },
  {
    path: '/market-explorer',
    element: <EnhancedMainLayout><MarketExplorer /></EnhancedMainLayout>
  },
  {
    path: '/market-comparison',
    element: <EnhancedMainLayout><MarketComparisonTool /></EnhancedMainLayout>
  },
  {
    path: '/calculators',
    element: <EnhancedMainLayout><CalculatorsPage /></EnhancedMainLayout>
  },
  {
    path: '/documents',
    element: <EnhancedMainLayout><DocumentsPage /></EnhancedMainLayout>
  },
  {
    path: '/investor-dashboard',
    element: <EnhancedMainLayout><InvestorDashboard /></EnhancedMainLayout>
  },
  {
    path: '/deutsche-immobilien-tools',
    element: <EnhancedMainLayout><GermanRealEstateInvestor /></EnhancedMainLayout>
  },
  {
    path: '/rewards',
    element: <EnhancedMainLayout><Rewards /></EnhancedMainLayout>
  },
  {
    path: '/properties',
    element: <EnhancedMainLayout><Properties /></EnhancedMainLayout>
  },
  {
    path: '/property-list',
    element: <EnhancedMainLayout><PropertyList /></EnhancedMainLayout>
  },
  {
    path: '/property/:id',
    element: <EnhancedMainLayout><PropertyDetail /></EnhancedMainLayout>
  },
  {
    path: '/education',
    element: <EnhancedMainLayout><Education /></EnhancedMainLayout>
  },
  {
    path: '/profile',
    element: <EnhancedMainLayout><UserProfile /></EnhancedMainLayout>
  },
  {
    path: '/tools',
    element: <EnhancedMainLayout><ToolsPage /></EnhancedMainLayout>
  },
  {
    path: '/decision-tools',
    element: <EnhancedMainLayout><ToolsPage /></EnhancedMainLayout>
  },
  {
    path: '/immobilien-tools',
    element: <EnhancedMainLayout><GermanRealEstateInvestor /></EnhancedMainLayout>
  },
  {
    path: '/regional-analysis',
    element: <EnhancedMainLayout><RegionalAnalysis /></EnhancedMainLayout>
  },
  {
    path: '/tax-planning',
    element: <EnhancedMainLayout><TaxPlanning /></EnhancedMainLayout>
  },
  {
    path: '/crm',
    element: <EnhancedMainLayout><CRMPage /></EnhancedMainLayout>
  },
  {
    path: '/locked',
    element: <LockedPage />
  },
  {
    path: '/workflows',
    element: <EnhancedMainLayout><WorkflowsPage /></EnhancedMainLayout>
  },
  {
    path: '/advanced-analytics',
    element: (
      <EnhancedMainLayout>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader size="lg" />}>
            <AdvancedAnalytics />
          </Suspense>
        </ErrorBoundary>
      </EnhancedMainLayout>
    )
  },
  // Catch-all route for 404
  {
    path: '*',
    element: <NotFound />
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
      <RewardsProvider>
        <RouterProvider router={router} />
        <Toaster />
      </RewardsProvider>
    </ErrorBoundary>
  );
};

export default App;
