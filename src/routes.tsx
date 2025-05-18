
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import EnhancedMainLayout from './layouts/EnhancedMainLayout';
import MarketAnalysisPage from './pages/MarketAnalysisPage';
import InvestorToolsPage from './pages/InvestorToolsPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={
        <EnhancedMainLayout>
          <DashboardPage />
        </EnhancedMainLayout>
      } />
      <Route path="/settings" element={
        <EnhancedMainLayout>
          <SettingsPage />
        </EnhancedMainLayout>
      } />
      <Route path="/market-analysis" element={
        <EnhancedMainLayout>
          <MarketAnalysisPage />
        </EnhancedMainLayout>
      } />
      <Route path="/investor-tools" element={
        <EnhancedMainLayout>
          <InvestorToolsPage />
        </EnhancedMainLayout>
      } />
    </Routes>
  );
};

export default AppRoutes;
