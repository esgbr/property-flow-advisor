
import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { AppLockProvider } from '@/contexts/AppLockContext'; // Fixed import path
import { RewardsProvider } from '@/contexts/RewardsContext';
import { MarketDataProvider } from '@/contexts/MarketDataContext';
import { A11yProvider } from '@/components/accessibility/A11yProvider';
import { EnhancedToaster } from '@/components/ui/enhanced-toaster';
import EnhancedRoutes from '@/components/router/EnhancedRoutes';
import { TooltipProvider } from '@/components/ui/tooltip'; // Import TooltipProvider

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="real-estate-theme">
      <LanguageProvider>
        <UserPreferencesProvider>
          <AppLockProvider>
            <RewardsProvider>
              <MarketDataProvider>
                <A11yProvider>
                  <TooltipProvider> {/* Add global TooltipProvider */}
                    <EnhancedRoutes />
                    <EnhancedToaster />
                  </TooltipProvider>
                </A11yProvider>
              </MarketDataProvider>
            </RewardsProvider>
          </AppLockProvider>
        </UserPreferencesProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
