
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import EnhancedMainLayout from './layouts/EnhancedMainLayout';

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
    </Routes>
  );
};

export default AppRoutes;
