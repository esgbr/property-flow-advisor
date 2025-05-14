import React, { useEffect, lazy, Suspense } from 'react';
import './App.css';
import './styles/ScrollStyles.css';
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
import OnboardingPage from '@/pages/OnboardingPage';
import Index from '@/pages/Index';
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
import EnhancedNavigationKeyboardExtension from '@/components/navigation/EnhancedNavigationKeyboardExtension';
import { A11yProvider } from '@/components/accessibility/A11yProvider';
import SkipLinks from '@/components/accessibility/SkipLinks';

// Lazy load heavy components for better initial loading performance
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
    path: '/rewards',
    element: <MainLayout><Rewards /></MainLayout>
  },
  {
    path: '/properties',
    element: <MainLayout><Properties /></MainLayout>
  },
  {
    path: '/property-list',
    element: <MainLayout><PropertyList /></MainLayout>
  },
  {
    path: '/property/:id',
    element: <MainLayout><PropertyDetail /></MainLayout>
  },
  {
    path: '/education',
    element: <MainLayout><Education /></MainLayout>
  },
  {
    path: '/profile',
    element: <MainLayout><UserProfile /></MainLayout>
  },
  {
    path: '/tools',
    element: <MainLayout><ToolsPage /></MainLayout>
  },
  {
    path: '/decision-tools',
    element: <MainLayout><ToolsPage /></MainLayout>
  },
  {
    path: '/immobilien-tools',
    element: <MainLayout><GermanRealEstateInvestor /></MainLayout>
  },
  {
    path: '/regional-analysis',
    element: <MainLayout><RegionalAnalysis /></MainLayout>
  },
  {
    path: '/tax-planning',
    element: <MainLayout><TaxPlanning /></MainLayout>
  },
  {
    path: '/crm',
    element: <MainLayout><CRMPage /></MainLayout>
  },
  {
    path: '/locked',
    element: <LockedPage />
  },
  {
    path: '/workflows',
    element: <MainLayout><WorkflowsPage /></MainLayout>
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
  },
  // Catch-all route for 404
  {
    path: '*',
    element: <NotFound />
  }
];

// Define shortcuts based on routes
const navigationShortcuts = [
  { id: 'home', label: 'Home', path: '/', key: 'h', alt: true },
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', key: 'd', alt: true },
  { id: 'properties', label: 'Properties', path: '/properties', key: 'p', alt: true },
  { id: 'tools', label: 'Tools', path: '/tools', key: 't', alt: true },
  { id: 'settings', label: 'Settings', path: '/settings', key: 's', alt: true },
  { id: 'accessibility', label: 'Accessibility', path: '/accessibility', key: 'a', alt: true },
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
      <A11yProvider>
        <RewardsProvider>
          <SkipLinks links={[
            { id: 'main-content', label: 'Skip to content' },
            { id: 'main-navigation', label: 'Skip to navigation' },
          ]} />
          <RouterProvider router={router} />
        </RewardsProvider>
      </A11yProvider>
    </ErrorBoundary>
  );
};

export default App;
