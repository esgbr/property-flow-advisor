import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { MarketDataProvider } from '@/contexts/MarketDataContext';
import WelcomeModal from '@/components/welcome/WelcomeModal';
import MainLayout from '@/layouts/MainLayout';
import Dashboard from '@/pages/Dashboard';
import MarketExplorerPage from '@/pages/MarketExplorerPage';
import InvestorDashboard from '@/pages/InvestorDashboard';
import FinancingPlansPage from '@/pages/FinancingPlansPage';
import { MotionConfig } from 'framer-motion';
import { A11yProvider } from '@/components/accessibility/A11yProvider';

function App() {
  return (
    <UserPreferencesProvider>
      <LanguageProvider>
        <MarketDataProvider>
          <A11yProvider>
            <MotionConfig reducedMotion="user">
              <WelcomeModal />
              <Toaster />
              
              <Routes>
                {/* Make Dashboard the home page */}
                <Route path="/" element={<MainLayout>{<Dashboard />}</MainLayout>} />
                
                {/* Legacy redirect for old index route */}
                <Route path="/index" element={<Navigate to="/" replace />} />
                
                {/* Dashboard as a regular route */}
                <Route path="/dashboard" element={<MainLayout>{<Dashboard />}</MainLayout>} />
                
                {/* Other pages */}
                <Route path="/market-explorer" element={<MainLayout>{<MarketExplorerPage />}</MainLayout>} />
                <Route path="/investor-dashboard" element={<MainLayout>{<InvestorDashboard />}</MainLayout>} />
                <Route path="/financing-plans" element={<MainLayout>{<FinancingPlansPage />}</MainLayout>} />
                
                {/* Catch all for 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MotionConfig>
          </A11yProvider>
        </MarketDataProvider>
      </LanguageProvider>
    </UserPreferencesProvider>
  );
}

export default App;
