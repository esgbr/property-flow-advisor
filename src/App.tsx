
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AppLockProvider } from '@/contexts/AppLockContext';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import Dashboard from '@/pages/Dashboard';
import AuthPage from '@/pages/AuthPage';
import SettingsPage from '@/pages/SettingsPage';
import LanguageSettings from '@/pages/LanguageSettings';
import Calculators from '@/pages/Calculators';
import OnboardingPage from '@/pages/OnboardingPage';
import AuthGuard from '@/components/auth/AuthGuard';
import LockedPage from '@/pages/LockedPage';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserPreferencesProvider>
        <LanguageProvider>
          <AppLockProvider>
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/locked" element={<LockedPage />} />
                <Route path="/dashboard" element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                } />
                <Route path="/calculators" element={
                  <AuthGuard>
                    <Calculators />
                  </AuthGuard>
                } />
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
                <Route path="/admin-tools" element={
                  <AuthGuard requireAdmin={true}>
                    <div>Admin-Tools</div>
                  </AuthGuard>
                } />
                <Route path="*" element={<div>404 - Seite nicht gefunden</div>} />
              </Routes>
              <Toaster />
            </Router>
          </AppLockProvider>
        </LanguageProvider>
      </UserPreferencesProvider>
    </ThemeProvider>
  );
};

export default App;
