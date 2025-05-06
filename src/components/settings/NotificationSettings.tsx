
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';

const NotificationSettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { t } = useLanguage();
  
  const toggleEmailNotifications = (checked: boolean) => {
    updatePreferences({ emailNotifications: checked });
  };
  
  const toggleDesktopNotifications = (checked: boolean) => {
    updatePreferences({ desktopNotifications: checked });
    
    // Request permission for desktop notifications if needed
    if (checked && 'Notification' in window) {
      Notification.requestPermission();
    }
  };
  
  const toggleNotificationSetting = (type: string, checked: boolean) => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        [type]: checked
      }
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('notificationSettings')}</CardTitle>
        <CardDescription>{t('manageHowYouReceiveNotifications')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">{t('emailNotifications')}</Label>
          <Switch
            id="email-notifications"
            checked={preferences.emailNotifications}
            onCheckedChange={toggleEmailNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="desktop-notifications">{t('desktopNotifications')}</Label>
          <Switch
            id="desktop-notifications"
            checked={preferences.desktopNotifications}
            onCheckedChange={toggleDesktopNotifications}
          />
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">{t('notificationTypes')}</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="security-notifications">{t('securityAlerts')}</Label>
              <Switch
                id="security-notifications"
                checked={preferences.notifications?.security || false}
                onCheckedChange={(checked) => toggleNotificationSetting('security', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="price-notifications">{t('priceAlerts')}</Label>
              <Switch
                id="price-notifications"
                checked={preferences.notifications?.price || false}
                onCheckedChange={(checked) => toggleNotificationSetting('price', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="news-notifications">{t('newsUpdates')}</Label>
              <Switch
                id="news-notifications"
                checked={preferences.notifications?.news || false}
                onCheckedChange={(checked) => toggleNotificationSetting('news', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="portfolio-notifications">{t('portfolioUpdates')}</Label>
              <Switch
                id="portfolio-notifications"
                checked={preferences.notifications?.portfolio || false}
                onCheckedChange={(checked) => toggleNotificationSetting('portfolio', checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
