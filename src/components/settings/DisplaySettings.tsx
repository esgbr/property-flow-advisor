
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';

const DisplaySettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { t } = useLanguage();
  
  const toggleDarkMode = (checked: boolean) => {
    updatePreferences({ darkMode: checked });
    
    // Apply dark mode
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const toggleContrastMode = (checked: boolean) => {
    updatePreferences({ contrastMode: checked });
  };
  
  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    updatePreferences({ fontSize: size });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('displaySettings')}</CardTitle>
        <CardDescription>{t('customizeYourVisualPreferences')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">{t('darkMode')}</Label>
          <Switch
            id="dark-mode"
            checked={preferences.darkMode}
            onCheckedChange={toggleDarkMode}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="contrast-mode">{t('highContrastMode')}</Label>
          <Switch
            id="contrast-mode"
            checked={preferences.contrastMode}
            onCheckedChange={toggleContrastMode}
          />
        </div>
        
        <div>
          <Label className="mb-2 block">{t('fontSize')}</Label>
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`p-2 rounded-md border ${preferences.fontSize === 'small' ? 'border-primary bg-primary/10' : 'border-input'}`}
              onClick={() => setFontSize('small')}
            >
              <span className="text-sm">{t('small')}</span>
            </button>
            <button
              className={`p-2 rounded-md border ${preferences.fontSize === 'medium' ? 'border-primary bg-primary/10' : 'border-input'}`}
              onClick={() => setFontSize('medium')}
            >
              <span className="text-base">{t('medium')}</span>
            </button>
            <button
              className={`p-2 rounded-md border ${preferences.fontSize === 'large' ? 'border-primary bg-primary/10' : 'border-input'}`}
              onClick={() => setFontSize('large')}
            >
              <span className="text-lg">{t('large')}</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplaySettings;
