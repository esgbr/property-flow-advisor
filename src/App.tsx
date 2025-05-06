
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AppLockProvider } from '@/contexts/AppLockContext';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
import SettingsPage from '@/pages/SettingsPage';
import LanguageSettings from '@/pages/LanguageSettings';
import OnboardingPage from '@/pages/OnboardingPage';
import AuthGuard from '@/components/auth/AuthGuard';
import LockedPage from '@/pages/LockedPage';
import PageLoader from '@/components/ui/page-loader';
import SecurityPage from "@/pages/SecurityPage";

// Lazy-load less frequently accessed pages for better performance
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Calculators = lazy(() => import('@/pages/Calculators'));
const DeutscheImmobilienPage = lazy(() => import('@/pages/DeutscheImmobilienPage'));
const GermanRealEstateInvestor = lazy(() => import('@/pages/GermanRealEstateInvestor'));
const PortfolioAnalyticsPage = lazy(() => import('@/pages/PortfolioAnalyticsPage'));
const MarketExplorerPage = lazy(() => import('@/pages/MarketExplorerPage'));
const AfaCalculatorPage = lazy(() => import('@/pages/AfaCalculatorPage'));
const GrunderwerbsteuerPage = lazy(() => import('@/pages/GrunderwerbsteuerPage'));
const InvestorDashboard = lazy(() => import('@/pages/InvestorDashboard'));
const NotificationsPage = lazy(() => import('@/pages/NotFound')); // Placeholder until a proper page is created
const ProfilePage = lazy(() => import('@/pages/UserProfile'));
const HelpSupportPage = lazy(() => import('@/pages/NotFound')); // Placeholder until a proper page is created

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserPreferencesProvider>
        <LanguageProvider>
          <AppLockProvider>
            <Router>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  <Route path="/locked" element={<LockedPage />} />
                  
                  {/* Main application routes with auth guard */}
                  <Route path="/dashboard" element={
                    <AuthGuard>
                      <Dashboard />
                    </AuthGuard>
                  } />
                  <Route path="/portfolio-analytics" element={
                    <AuthGuard>
                      <PortfolioAnalyticsPage />
                    </AuthGuard>
                  } />
                  <Route path="/market-explorer" element={
                    <AuthGuard>
                      <MarketExplorerPage />
                    </AuthGuard>
                  } />
                  <Route path="/calculators" element={
                    <AuthGuard>
                      <Calculators />
                    </AuthGuard>
                  } />
                  
                  {/* Calculator pages */}
                  <Route path="/calculators/afa" element={<AfaCalculatorPage />} />
                  <Route path="/calculators/grunderwerbsteuer" element={<GrunderwerbsteuerPage />} />
                  
                  {/* User account related pages */}
                  <Route path="/settings" element={
                    <AuthGuard>
                      <SettingsPage />
                    </AuthGuard>
                  } />
                  <Route path="/language-settings" element={
                    <AuthGuard>
                      <LanguageSettings />
                    </AuthGuard>
                  } />
                  <Route path="/security" element={
                    <AuthGuard>
                      <SecurityPage />
                    </AuthGuard>
                  } />
                  <Route path="/notifications" element={
                    <AuthGuard>
                      <NotificationsPage />
                    </AuthGuard>
                  } />
                  <Route path="/profile" element={
                    <AuthGuard>
                      <ProfilePage />
                    </AuthGuard>
                  } />
                  <Route path="/help" element={
                    <AuthGuard>
                      <HelpSupportPage />
                    </AuthGuard>
                  } />
                  
                  {/* Market-specific pages */}
                  <Route path="/deutsche-immobilien" element={<DeutscheImmobilienPage />} />
                  <Route path="/deutsche-immobilien-tools" element={<GermanRealEstateInvestor />} />
                  <Route path="/investor-dashboard" element={
                    <AuthGuard>
                      <InvestorDashboard />
                    </AuthGuard>
                  } />
                  
                  {/* Admin routes */}
                  <Route path="/admin-tools" element={
                    <AuthGuard requireAdmin={true}>
                      <div>Admin-Tools</div>
                    </AuthGuard>
                  } />
                  
                  {/* 404 route */}
                  <Route path="*" element={<div>404 - Seite nicht gefunden</div>} />
                </Routes>
                <Toaster />
              </Suspense>
            </Router>
          </AppLockProvider>
        </LanguageProvider>
      </UserPreferencesProvider>
    </ThemeProvider>
  );
};

export default App;
