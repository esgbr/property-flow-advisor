
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AppLockProvider } from './contexts/AppLockContext';
import { RewardsProvider } from './contexts/RewardsContext';
import MainLayout from './components/layout/MainLayout';

import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import PropertyEdit from './pages/PropertyEdit';
import Calculators from './pages/Calculators';
import Schedule from './pages/Schedule';
import Decision from './pages/Decision';
import Refurbishment from './pages/Refurbishment';
import Rewards from './pages/Rewards';
import Education from './pages/Education';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import InvestorDashboard from './pages/InvestorDashboard';
import FeaturesDashboard from './pages/FeaturesDashboard';
import RealEstateInvestorTools from './pages/RealEstateInvestorTools';
import ExchangeTracker from './pages/ExchangeTracker';
import InvestmentPartnerMatching from './pages/InvestmentPartnerMatching';
import DeutscheImmobilienTools from './pages/DeutscheImmobilienTools';
import Index from './pages/Index';
import InvestmentCalculator from './pages/InvestmentCalculator';
import PortfolioOptimization from './pages/PortfolioOptimization';

import { Toaster as SonnerToaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <LanguageProvider>
        <UserPreferencesProvider>
          <AppLockProvider>
            <RewardsProvider>
              <Router>
                <Routes>
                  {/* Root route shows landing page */}
                  <Route path="/" element={<Index />} />
                  <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/properties/:id" element={<PropertyDetail />} />
                    <Route path="/properties/:id/edit" element={<PropertyEdit />} />
                    <Route path="/calculators" element={<Calculators />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/decision" element={<Decision />} />
                    <Route path="/refurbishment" element={<Refurbishment />} />
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/education" element={<Education />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/investor-dashboard" element={<InvestorDashboard />} />
                    <Route path="/features" element={<FeaturesDashboard />} />
                    <Route path="/investor-tools" element={<RealEstateInvestorTools />} />
                    <Route path="/exchange-tracker" element={<ExchangeTracker />} />
                    <Route path="/partner-matching" element={<InvestmentPartnerMatching />} />
                    <Route path="/deutsche-immobilien-tools" element={<DeutscheImmobilienTools />} />
                    <Route path="/investment-calculator" element={<InvestmentCalculator />} />
                    <Route path="/portfolio-optimization" element={<PortfolioOptimization />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Router>
              <Toaster />
              <SonnerToaster />
            </RewardsProvider>
          </AppLockProvider>
        </UserPreferencesProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
