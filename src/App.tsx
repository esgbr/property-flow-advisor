
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import MainLayout from '@/components/layout/MainLayout';
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
import Calculators from '@/pages/Calculators';
import { Toaster } from '@/components/ui/sonner';
import DeutscheImmobilienTools from '@/pages/DeutscheImmobilienTools';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="real-estate-theme">
      <LanguageProvider>
        <UserPreferencesProvider>
          <AppLockProvider>
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
                <Route path="/education" element={<Education />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/deutsche-immobilien-tools" element={<DeutscheImmobilienTools />} />
              </Route>
            </Routes>
            <Toaster position="top-right" />
          </AppLockProvider>
        </UserPreferencesProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
