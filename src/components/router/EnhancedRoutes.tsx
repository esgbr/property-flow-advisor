
import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PageLoader from '@/components/ui/page-loader';
import EnhancedLayout from '@/layouts/EnhancedLayout';
import NotFound from '@/pages/NotFound';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

// Lazy load pages for better initial load performance
const IndexPage = lazy(() => import('@/pages/Index'));
const DashboardPage = lazy(() => import('@/pages/Dashboard'));
const PropertiesPage = lazy(() => import('@/pages/PropertyList'));
const PropertyDetailPage = lazy(() => import('@/pages/PropertyDetail'));
const PropertyEditPage = lazy(() => import('@/pages/PropertyEdit'));
const PropertyFinancialsPage = lazy(() => import('@/pages/PropertyFinancials'));
const InvestorDashboardPage = lazy(() => import('@/pages/InvestorDashboard'));
const CalculatorsPage = lazy(() => import('@/pages/Calculators'));
const EducationPage = lazy(() => import('@/pages/Education'));
const SettingsPage = lazy(() => import('@/pages/Settings'));
const UserProfilePage = lazy(() => import('@/pages/UserProfile'));
const DeutscheImmobilienToolsPage = lazy(() => import('@/pages/DeutscheImmobilienTools'));
const FeaturesPage = lazy(() => import('@/pages/Features'));
const FeaturesDashboardPage = lazy(() => import('@/pages/FeaturesDashboard'));
const GermanRealEstateInvestorPage = lazy(() => import('@/pages/GermanRealEstateInvestor'));
const USRealEstateToolsPage = lazy(() => import('@/pages/USRealEstateTools'));
const MarketExplorerPage = lazy(() => import('@/pages/MarketExplorerPage'));
const AdvancedCalculatorsPage = lazy(() => import('@/pages/AdvancedCalculatorsPage'));
const PropertyComparatorPage = lazy(() => import('@/pages/PropertyComparatorPage'));
const PortfolioAnalyticsPage = lazy(() => import('@/pages/PortfolioAnalyticsPage'));
const MarketAnalysisDashboardPage = lazy(() => import('@/pages/MarketAnalysisDashboard'));
const AccessibilitySettingsPage = lazy(() => import('@/components/accessibility/AccessibilitySettings'));
const OnboardingWizard = lazy(() => import('@/components/onboarding/OnboardingWizard'));
const SecurityPage = lazy(() => import('@/pages/SecurityPage'));
const AdvancedMarketAnalysisPage = lazy(() => import('@/pages/AdvancedMarketAnalysisPage'));
const TaxFinancingPage = lazy(() => import('@/pages/TaxFinancingPage'));
const DynamicWorkflowPage = lazy(() => import('@/pages/DynamicWorkflowPage'));

// Loading fallback component
const PageLoadingFallback: React.FC<{ message?: string }> = ({ message }) => (
  <div className="h-full w-full flex items-center justify-center">
    <PageLoader message={message || "Loading page..."} />
  </div>
);

// Enhanced suspense wrapper with page-specific loading messages
const PageSuspense: React.FC<{ 
  children: React.ReactNode; 
  message?: string;
}> = ({ children, message }) => (
  <Suspense fallback={<PageLoadingFallback message={message} />}>
    {children}
  </Suspense>
);

const RouteTracker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return <>{children}</>;
};

const EnhancedRoutes: React.FC = () => {
  const { preferences } = useUserPreferences();
  const needsOnboarding = !preferences.onboardingCompleted;
  
  return (
    <RouteTracker>
      <Routes>
        {/* Make Dashboard the home page and redirect legacy index route to it */}
        <Route path="/" element={
          needsOnboarding ? (
            <PageSuspense message="Setting up your experience...">
              <OnboardingWizard />
            </PageSuspense>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } />
        
        {/* Legacy index page now redirects to dashboard */}
        <Route path="/index" element={<Navigate to="/dashboard" replace />} />
        
        <Route element={<EnhancedLayout />}>
          <Route path="/dashboard" element={
            <PageSuspense message="Loading dashboard...">
              <DashboardPage />
            </PageSuspense>
          } />
          
          <Route path="/properties" element={
            <PageSuspense message="Loading properties...">
              <PropertiesPage />
            </PageSuspense>
          } />
          
          <Route path="/property/:id" element={
            <PageSuspense message="Loading property details...">
              <PropertyDetailPage />
            </PageSuspense>
          } />
          
          <Route path="/property/:id/edit" element={
            <PageSuspense message="Loading property editor...">
              <PropertyEditPage />
            </PageSuspense>
          } />
          
          <Route path="/property/:id/financials" element={
            <PageSuspense message="Loading property financials...">
              <PropertyFinancialsPage />
            </PageSuspense>
          } />
          
          <Route path="/investor-dashboard" element={
            <PageSuspense message="Loading investor dashboard...">
              <InvestorDashboardPage />
            </PageSuspense>
          } />
          
          <Route path="/calculators" element={
            <PageSuspense message="Loading calculators...">
              <CalculatorsPage />
            </PageSuspense>
          } />
          
          <Route path="/advanced-calculators" element={
            <PageSuspense message="Loading advanced calculators...">
              <AdvancedCalculatorsPage />
            </PageSuspense>
          } />
          
          <Route path="/education" element={
            <PageSuspense message="Loading education resources...">
              <EducationPage />
            </PageSuspense>
          } />
          
          <Route path="/settings" element={
            <PageSuspense message="Loading settings...">
              <SettingsPage />
            </PageSuspense>
          } />
          
          <Route path="/profile" element={
            <PageSuspense message="Loading user profile...">
              <UserProfilePage />
            </PageSuspense>
          } />
          
          <Route path="/deutsche-immobilien-tools" element={
            <PageSuspense message="Loading German real estate tools...">
              <DeutscheImmobilienToolsPage />
            </PageSuspense>
          } />
          
          <Route path="/german-investor" element={
            <PageSuspense message="Loading German investor tools...">
              <GermanRealEstateInvestorPage />
            </PageSuspense>
          } />
          
          <Route path="/features" element={
            <PageSuspense message="Loading features...">
              <FeaturesDashboardPage />
            </PageSuspense>
          } />
          
          <Route path="/features/:featureId" element={
            <PageSuspense message="Loading feature details...">
              <FeaturesPage />
            </PageSuspense>
          } />
          
          <Route path="/us-real-estate-tools" element={
            <PageSuspense message="Loading US real estate tools...">
              <USRealEstateToolsPage />
            </PageSuspense>
          } />
          
          <Route path="/market-explorer" element={
            <PageSuspense message="Loading market explorer...">
              <MarketExplorerPage />
            </PageSuspense>
          } />
          
          <Route path="/advanced-market-analysis" element={
            <PageSuspense message="Loading advanced market analysis...">
              <AdvancedMarketAnalysisPage />
            </PageSuspense>
          } />
          
          <Route path="/tax-financing" element={
            <PageSuspense message="Loading tax & financing tools...">
              <TaxFinancingPage />
            </PageSuspense>
          } />
          
          <Route path="/advanced-workflows" element={
            <PageSuspense message="Loading advanced workflow features...">
              <DynamicWorkflowPage />
            </PageSuspense>
          } />
          
          <Route path="/property-comparator" element={
            <PageSuspense message="Loading property comparator...">
              <PropertyComparatorPage />
            </PageSuspense>
          } />
          
          <Route path="/portfolio-analytics" element={
            <PageSuspense message="Loading portfolio analytics...">
              <PortfolioAnalyticsPage />
            </PageSuspense>
          } />
          
          <Route path="/market-analysis" element={
            <PageSuspense message="Loading market analysis...">
              <MarketAnalysisDashboardPage />
            </PageSuspense>
          } />
          
          <Route path="/accessibility" element={
            <PageSuspense message="Loading accessibility settings...">
              <AccessibilitySettingsPage />
            </PageSuspense>
          } />
          
          <Route path="/security" element={<SecurityPage />} />
        </Route>
        
        {/* Redirects for backward compatibility */}
        <Route path="/exchange-tracker" element={<Navigate to="/calculators?tab=exchange" replace />} />
        <Route path="/partner-matching" element={<Navigate to="/investor-dashboard?tab=partners" replace />} />
        <Route path="/investment-calculator" element={<Navigate to="/calculators?tab=investment" replace />} />
        <Route path="/portfolio-optimization" element={<Navigate to="/investor-dashboard?tab=portfolio" replace />} />
        
        {/* Catch all route for 404s */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RouteTracker>
  );
};

export default EnhancedRoutes;
