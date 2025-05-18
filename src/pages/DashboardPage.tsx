
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomizableDashboard from '@/components/dashboard/CustomizableDashboard';
import EnhancedPortfolioDashboard from '@/components/portfolio/EnhancedPortfolioDashboard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import EnhancedLanguageSwitcher from '@/components/language/EnhancedLanguageSwitcher';
import { DarkModeToggle } from '@/components/theme/DarkModeToggle';
import AccessibilitySettingsButton from '@/components/accessibility/AccessibilitySettingsButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Sun, Moon, PanelLeft, PanelRight } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const { preferences } = useUserPreferences();
  const [viewMode, setViewMode] = useState<'simple' | 'advanced'>(
    preferences.experienceLevel === 'beginner' ? 'simple' : 'advanced'
  );

  return (
    <div className="container mx-auto py-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('welcome')}</h1>
        <div className="flex items-center space-x-2">
          <EnhancedLanguageSwitcher />
          <DarkModeToggle />
          <AccessibilitySettingsButton />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('viewMode')}</CardTitle>
          <CardDescription>{t('selectViewModeDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button
              variant={viewMode === 'simple' ? 'default' : 'outline'}
              onClick={() => setViewMode('simple')}
              className="flex-1"
            >
              <PanelLeft className="mr-2 h-4 w-4" />
              {t('simpleMode')}
            </Button>
            <Button
              variant={viewMode === 'advanced' ? 'default' : 'outline'}
              onClick={() => setViewMode('advanced')}
              className="flex-1"
            >
              <PanelRight className="mr-2 h-4 w-4" />
              {t('advancedMode')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'simple' ? (
        <EnhancedPortfolioDashboard />
      ) : (
        <CustomizableDashboard />
      )}
    </div>
  );
};

export default DashboardPage;
