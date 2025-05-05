import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { MarketDataProvider } from '@/contexts/MarketDataContext';
import WelcomeModal from '@/components/welcome/WelcomeModal';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import MarketExplorerPage from '@/pages/MarketExplorerPage';
import InvestorDashboard from '@/pages/InvestorDashboard';
import { MotionConfig } from 'framer-motion';
import { AccessibilityProvider } from '@/components/accessibility/A11yProvider';

function App() {
  return (
    <UserPreferencesProvider>
      <LanguageProvider>
        <MarketDataProvider>
          <AccessibilityProvider>
            <MotionConfig reducedMotion="user">
              <Router>
                <WelcomeModal />
                <Toaster />
                
                <Routes>
                  {/* Make Dashboard the home page */}
                  <Route path="/" element={<Layout><Dashboard /></Layout>} />
                  
                  {/* Legacy redirect for old index route */}
                  <Route path="/index" element={<Navigate to="/" replace />} />
                  
                  {/* Dashboard as a regular route */}
                  <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                  
                  {/* Other pages */}
                  <Route path="/market-explorer" element={<Layout><MarketExplorerPage /></Layout>} />
                  <Route path="/investor-dashboard" element={<Layout><InvestorDashboard /></Layout>} />
                  
                  {/* Catch all for 404 */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </MotionConfig>
          </AccessibilityProvider>
        </MarketDataProvider>
      </LanguageProvider>
    </UserPreferencesProvider>
  );
}

export default App;
