
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { MarketDataProvider } from '@/contexts/MarketDataContext';
import { AppLockProvider } from '@/contexts/AppLockContext';
import { RewardsProvider } from '@/contexts/RewardsContext';
import { MotionConfig } from 'framer-motion';
import { A11yProvider } from '@/components/accessibility/A11yProvider';
import { Helmet } from 'react-helmet';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import MarketExplorerPage from '@/pages/MarketExplorerPage';
import InvestorDashboard from '@/pages/InvestorDashboard';
import FinancingPlansPage from '@/pages/FinancingPlansPage';
import LanguageSettings from '@/pages/LanguageSettings';

function App() {
  return (
    <UserPreferencesProvider>
      <LanguageProvider>
        <MarketDataProvider>
          <AppLockProvider>
            <RewardsProvider>
              <A11yProvider>
                <MotionConfig reducedMotion="user">
                  <Helmet>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta httpEquiv="Content-Security-Policy" 
                      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; 
                      img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://api.example.com" />
                    <meta name="description" content="PropertyFlow - Real Estate Investment Platform" />
                    <title>PropertyFlow</title>
                  </Helmet>
                  
                  <Toaster />
                  
                  <Routes>
                    {/* Make Dashboard the home page */}
                    <Route path="/" element={<MainLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="market-explorer" element={<MarketExplorerPage />} />
                      <Route path="investor-dashboard" element={<InvestorDashboard />} />
                      <Route path="financing-plans" element={<FinancingPlansPage />} />
                      <Route path="language-settings" element={<LanguageSettings />} />
                      
                      {/* Catch all for 404 */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                  </Routes>
                </MotionConfig>
              </A11yProvider>
            </RewardsProvider>
          </AppLockProvider>
        </MarketDataProvider>
      </LanguageProvider>
    </UserPreferencesProvider>
  );
}

export default App;
