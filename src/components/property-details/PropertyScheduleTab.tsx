
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AppLockSettings from '@/components/AppLockSettings';

const PropertyScheduleTab = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('schedule')}</CardTitle>
            <LanguageSwitcher />
          </div>
          <CardDescription>{t('propertyDetails')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Schedule and appointments will be displayed here.</p>
        </CardContent>
      </Card>
      
      <AppLockSettings />
    </div>
  );
};

export default PropertyScheduleTab;
