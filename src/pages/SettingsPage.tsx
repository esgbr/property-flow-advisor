
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import ProfileSettings from '@/components/settings/ProfileSettings';
import DisplaySettings from '@/components/settings/DisplaySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import LanguageSettings from '@/components/settings/LanguageSettings';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { RefreshCcw } from 'lucide-react';

const SettingsPage = () => {
  const { language, t } = useLanguage();
  const { resetPreferences } = useUserPreferences();
  const navigate = useNavigate();
  
  const handleResetOnboarding = () => {
    if (resetPreferences) {
      resetPreferences({
        onboardingCompleted: false
      });
      toast.success(language === 'de' ? 'Onboarding-Einstellungen zurückgesetzt' : 'Onboarding settings have been reset');
      navigate('/onboarding');
    }
  };
  
  // Get tab from URL params
  const tabFromUrl = new URLSearchParams(window.location.search).get('tab') || 'profile';

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">{t('settings')}</h1>
      
      <Tabs defaultValue={tabFromUrl}>
        <TabsList>
          <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
          <TabsTrigger value="display">{t('display')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('notifications')}</TabsTrigger>
          <TabsTrigger value="language">{t('language')}</TabsTrigger>
          <TabsTrigger value="security">{t('security')}</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="display">
            <DisplaySettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="language">
            <LanguageSettings />
          </TabsContent>
          
          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
        </div>
      </Tabs>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{language === 'de' ? 'Onboarding zurücksetzen' : 'Reset Onboarding'}</CardTitle>
          <CardDescription>
            {language === 'de' 
              ? 'Setzen Sie den Onboarding-Prozess zurück, um Ihre Präferenzen neu zu konfigurieren' 
              : 'Reset the onboarding process to reconfigure your preferences'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleResetOnboarding}
            variant="outline"
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            {language === 'de' ? 'Onboarding-Prozess neu starten' : 'Restart Onboarding Process'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
