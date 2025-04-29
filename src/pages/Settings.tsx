
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AppLockSettings from '@/components/AppLockSettings';

const Settings = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            <SettingsIcon className="inline-block mr-2 h-8 w-8" />
            {t('settings')}
          </h1>
          <p className="text-muted-foreground">{t('settingsDescription')}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('language')}</CardTitle>
            <CardDescription>{t('languageDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t('currentLanguage')}</p>
                <p className="text-sm text-muted-foreground">{t('selectLanguage')}</p>
              </div>
              <LanguageSwitcher />
            </div>
          </CardContent>
        </Card>
        
        <AppLockSettings />
      </div>
    </div>
  );
};

export default Settings;
