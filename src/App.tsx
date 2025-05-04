
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import MainLayout from '@/layouts/MainLayout';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import PropertyList from '@/pages/PropertyList';
import PropertyDetail from '@/pages/PropertyDetail';
import PropertyEdit from '@/pages/PropertyEdit';
import PropertyFinancials from '@/pages/PropertyFinancials';
import InvestorDashboard from '@/pages/InvestorDashboard';
import Education from '@/pages/Education';
import Settings from '@/pages/Settings';
import UserProfile from '@/pages/UserProfile';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { AppLockProvider } from '@/contexts/AppLockContext';
import { RewardsProvider } from '@/contexts/RewardsContext';
import { MarketDataProvider } from '@/contexts/MarketDataContext';
import Calculators from '@/pages/Calculators';
import { Toaster } from '@/components/ui/sonner';
import DeutscheImmobilienTools from '@/pages/DeutscheImmobilienTools';
import Features from '@/pages/Features';
import FeaturesDashboard from '@/pages/FeaturesDashboard';
import GermanRealEstateInvestor from '@/pages/GermanRealEstateInvestor';
import USRealEstateTools from '@/pages/USRealEstateTools';
import NotFound from '@/pages/NotFound';
import MarketExplorerPage from '@/pages/MarketExplorerPage';
import AdvancedCalculatorsPage from '@/pages/AdvancedCalculatorsPage';
import PropertyComparatorPage from '@/pages/PropertyComparatorPage';
import PortfolioAnalyticsPage from '@/pages/PortfolioAnalyticsPage';
import MarketAnalysisDashboard from '@/pages/MarketAnalysisDashboard';
import AccessibilitySettings from '@/components/accessibility/AccessibilitySettings';
import { A11yProvider } from '@/components/accessibility/A11yProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="real-estate-theme">
      <LanguageProvider>
        <UserPreferencesProvider>
          <AppLockProvider>
            <RewardsProvider>
              <MarketDataProvider>
                <A11yProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route element={<MainLayout />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/properties" element={<PropertyList />} />
                      <Route path="/property/:id" element={<PropertyDetail />} />
                      <Route path="/property/:id/edit" element={<PropertyEdit />} />
                      <Route path="/property/:id/financials" element={<PropertyFinancials />} />
                      <Route path="/investor-dashboard" element={<InvestorDashboard />} />
                      <Route path="/calculators" element={<Calculators />} />
                      <Route path="/advanced-calculators" element={<AdvancedCalculatorsPage />} />
                      <Route path="/education" element={<Education />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/profile" element={<UserProfile />} />
                      <Route path="/deutsche-immobilien-tools" element={<DeutscheImmobilienTools />} />
                      <Route path="/german-investor" element={<GermanRealEstateInvestor />} />
                      <Route path="/features" element={<FeaturesDashboard />} />
                      <Route path="/us-real-estate-tools" element={<USRealEstateTools />} />
                      <Route path="/market-explorer" element={<MarketExplorerPage />} />
                      <Route path="/property-comparator" element={<PropertyComparatorPage />} />
                      <Route path="/portfolio-analytics" element={<PortfolioAnalyticsPage />} />
                      <Route path="/market-analysis" element={<MarketAnalysisDashboard />} />
                      <Route path="/accessibility" element={<AccessibilitySettings />} />
                    </Route>
                    {/* Redirect for backward compatibility */}
                    <Route path="/exchange-tracker" element={<Navigate to="/calculators?tab=exchange" replace />} />
                    <Route path="/partner-matching" element={<Navigate to="/investor-dashboard?tab=partners" replace />} />
                    <Route path="/investment-calculator" element={<Navigate to="/calculators?tab=investment" replace />} />
                    <Route path="/portfolio-optimization" element={<Navigate to="/investor-dashboard?tab=portfolio" replace />} />
                    <Route path="/features/:featureId" element={<Features />} />
                    {/* Catch all route for 404s */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster position="top-right" />
                </A11yProvider>
              </MarketDataProvider>
            </RewardsProvider>
          </AppLockProvider>
        </UserPreferencesProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
