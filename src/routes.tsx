
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import EnhancedMainLayout from './layouts/EnhancedMainLayout';
import MarketAnalysisPage from './pages/MarketAnalysisPage';
import InvestorToolsPage from './pages/InvestorToolsPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFound from './pages/NotFound';
import UnauthorizedPage from './pages/UnauthorizedPage';

/**
 * Main application routes
 * Uses ProtectedRoute to secure routes that require authentication
 */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/auth" 
        element={
          <EnhancedMainLayout>
            <AuthPage />
          </EnhancedMainLayout>
        } 
      />
      
      <Route 
        path="/unauthorized" 
        element={
          <EnhancedMainLayout>
            <UnauthorizedPage />
          </EnhancedMainLayout>
        } 
      />
      
      {/* Protected routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <EnhancedMainLayout>
              <DashboardPage />
            </EnhancedMainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <EnhancedMainLayout>
              <SettingsPage />
            </EnhancedMainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/market-analysis" 
        element={
          <ProtectedRoute>
            <EnhancedMainLayout>
              <MarketAnalysisPage />
            </EnhancedMainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/investor-tools" 
        element={
          <ProtectedRoute>
            <EnhancedMainLayout>
              <InvestorToolsPage />
            </EnhancedMainLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* 404 - Not Found Route */}
      <Route 
        path="*" 
        element={
          <EnhancedMainLayout>
            <NotFound />
          </EnhancedMainLayout>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
