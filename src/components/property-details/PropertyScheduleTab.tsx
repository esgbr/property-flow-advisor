
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import AppLockSettings from '@/components/AppLockSettings';

const PropertyScheduleTab = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{t('schedule')}</CardTitle>
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
