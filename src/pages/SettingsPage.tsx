
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Settings, Languages, Shield, User, Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SkipToContent from '@/components/accessibility/SkipToContent';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAppLock } from '@/contexts/AppLockContext';

const SettingsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const { hasPIN, setPIN } = useAppLock();
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <SkipToContent contentId="settingsContent" />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" id="settingsTitle">{t('settings')}</h1>
          <p className="text-muted-foreground">{t('personalizeYourExperience')}</p>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="space-y-6" id="settingsContent">
        <TabsList className="w-full md:w-auto flex flex-wrap" aria-labelledby="settingsTitle">
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            {t('general')}
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center">
            <Languages className="mr-2 h-4 w-4" />
            {t('language')}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            {t('security')}
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            {t('account')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            {t('notifications')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="focus:outline-none focus-visible:ring-2">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('theme')}</CardTitle>
                <CardDescription>{t('chooseYourTheme')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeToggle />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('preferences')}</CardTitle>
                <CardDescription>{t('userPreferences')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/onboarding')} variant="outline">
                  {t('resetOnboarding')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="language" className="focus:outline-none focus-visible:ring-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('language')}</CardTitle>
              <CardDescription>{t('chooseYourLanguage')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <LanguageSwitcher />
              </div>
              <Button onClick={() => navigate('/language-settings')} variant="outline">
                {t('languageSettings')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="focus:outline-none focus-visible:ring-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('security')}</CardTitle>
              <CardDescription>{t('securitySettings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">{t('appLock')}</h3>
                {hasPIN ? (
                  <p className="text-sm text-muted-foreground">{t('appLockEnabled')}</p>
                ) : (
                  <Button onClick={() => setPIN('1234')} variant="outline">
                    {t('setupPIN')}
                  </Button>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-2">{t('passwordStrength')}</h3>
                <p className="text-sm text-muted-foreground">{t('passwordLength')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="focus:outline-none focus-visible:ring-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('account')}</CardTitle>
              <CardDescription>{t('accountSettings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">{t('user')}</h3>
                <p className="text-sm text-muted-foreground">{preferences.name || t('user')}</p>
                <p className="text-sm text-muted-foreground">{preferences.email || ''}</p>
              </div>
              <div>
                <Button variant="outline">{t('updateProfile')}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="focus:outline-none focus-visible:ring-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('notifications')}</CardTitle>
              <CardDescription>{t('notificationPreferences')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{t('comingSoon')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
