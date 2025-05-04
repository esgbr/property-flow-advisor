
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Settings as SettingsIcon, UserCheck, RefreshCw, Bell, Shield, BarChart, Calendar, MapPin, Building, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AppLockSettings from '@/components/AppLockSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import AIAssistant from '@/components/ai/AIAssistant';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate } from 'react-router-dom';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

const Settings = () => {
  const { t } = useLanguage();
  const { preferences, updatePreferences, resetOnboarding } = useUserPreferences();
  const navigate = useNavigate();

  const handleToggleSetting = (key: keyof typeof preferences) => {
    updatePreferences({ [key]: !preferences[key as keyof typeof preferences] });
    
    toast({
      title: t('settingUpdated'),
      description: t('yourPreferencesHaveBeenSaved'),
    });
  };

  const handleExperienceLevelChange = (value: string) => {
    // Convert string to valid experienceLevel type
    const level = value as "beginner" | "intermediate" | "expert";
    updatePreferences({ experienceLevel: level });
    
    toast({
      title: t('experienceLevelUpdated'),
      description: t('yourExperienceLevelHasBeenUpdated'),
    });
  };

  const handleMarketChange = (market: string) => {
    // Convert string to valid market type
    updatePreferences({ investmentMarket: market as InvestmentMarket });
    
    toast({
      title: t('marketPreferenceUpdated'),
      description: t('yourMarketPreferenceHasBeenUpdated'),
    });
  };

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
        <AIAssistant variant="icon" title={t('settingsAssistant')} description={t('helpWithSettings')} />
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">{t('general')}</TabsTrigger>
          <TabsTrigger value="market">{t('market')}</TabsTrigger>
          <TabsTrigger value="security">{t('security')}</TabsTrigger>
          <TabsTrigger value="preferences">{t('preferences')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('analytics')}</TabsTrigger>
          <TabsTrigger value="integration">{t('integrations')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="grid gap-6 md:grid-cols-2">
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
          
          <Card>
            <CardHeader>
              <CardTitle>{t('experienceLevel')}</CardTitle>
              <CardDescription>{t('setYourRealEstateExperienceLevel')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="beginner" 
                    name="experience" 
                    checked={preferences.experienceLevel === 'beginner'} 
                    onChange={() => handleExperienceLevelChange('beginner')}
                  />
                  <Label htmlFor="beginner">{t('beginner')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="intermediate" 
                    name="experience" 
                    checked={preferences.experienceLevel === 'intermediate'} 
                    onChange={() => handleExperienceLevelChange('intermediate')} 
                  />
                  <Label htmlFor="intermediate">{t('intermediate')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="expert" 
                    name="experience" 
                    checked={preferences.experienceLevel === 'expert'} 
                    onChange={() => handleExperienceLevelChange('expert')}
                  />
                  <Label htmlFor="expert">{t('expert')}</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                {t('investmentMarket')}
              </CardTitle>
              <CardDescription>{t('selectYourPrimaryInvestmentMarket')}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={preferences.investmentMarket} 
                onValueChange={handleMarketChange}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-4 hover:bg-accent/10">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="germany" id="germany" />
                    <Label htmlFor="germany">Germany</Label>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg">🇩🇪</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-4 hover:bg-accent/10">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="austria" id="austria" />
                    <Label htmlFor="austria">Austria</Label>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg">🇦🇹</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-4 hover:bg-accent/10">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="switzerland" id="switzerland" />
                    <Label htmlFor="switzerland">Switzerland</Label>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg">🇨🇭</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-4 hover:bg-accent/10">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="france" id="france" />
                    <Label htmlFor="france">France</Label>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg">🇫🇷</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-4 hover:bg-accent/10">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="usa" id="usa" />
                    <Label htmlFor="usa">USA</Label>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg">🇺🇸</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-4 hover:bg-accent/10">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="canada" id="canada" />
                    <Label htmlFor="canada">Canada</Label>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg">🇨🇦</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-4 hover:bg-accent/10">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="global" id="global" />
                    <Label htmlFor="global">Global</Label>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Globe className="h-6 w-6" />
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-4 hover:bg-accent/10">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <MapPin className="h-6 w-6" />
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                {t('marketPreferenceDescription')}
              </div>
              <Button onClick={() => navigate('/market-analysis')}>
                <Building className="mr-2 h-4 w-4" />
                {t('viewMarketAnalysis')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="grid gap-6 md:grid-cols-2">
          <AppLockSettings />
          
          <Card>
            <CardHeader>
              <CardTitle>
                <Shield className="inline-block mr-2 h-5 w-5" />
                {t('securitySettings')}
              </CardTitle>
              <CardDescription>{t('advancedSecurityOptions')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 justify-between">
                <div>
                  <Label htmlFor="ddos-protection">{t('ddosProtection')}</Label>
                  <p className="text-sm text-muted-foreground">{t('enableAdvancedProtection')}</p>
                </div>
                <Switch 
                  id="ddos-protection"
                  checked={true}
                  disabled
                />
              </div>
              <Separator />
              <div className="flex items-center space-x-2 justify-between">
                <div>
                  <Label htmlFor="auto-logout">{t('autoLogout')}</Label>
                  <p className="text-sm text-muted-foreground">{t('automaticallyLogout')}</p>
                </div>
                <Switch 
                  id="auto-logout"
                  checked={preferences.onboardingCompleted}
                  onCheckedChange={() => handleToggleSetting('onboardingCompleted')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <UserCheck className="inline-block mr-2 h-5 w-5" />
                {t('userPreferences')}
              </CardTitle>
              <CardDescription>{t('customizeYourExperience')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 justify-between">
                <div>
                  <Label htmlFor="dark-mode">{t('darkMode')}</Label>
                  <p className="text-sm text-muted-foreground">{t('enableDarkMode')}</p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={preferences.darkMode}
                  onCheckedChange={() => handleToggleSetting('darkMode')}
                />
              </div>
              <Separator />
              <div className="flex items-center space-x-2 justify-between">
                <div>
                  <Label htmlFor="notifications">{t('notifications')}</Label>
                  <p className="text-sm text-muted-foreground">{t('enableNotifications')}</p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={preferences.notificationsEnabled}
                  onCheckedChange={() => handleToggleSetting('notificationsEnabled')}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                <RefreshCw className="inline-block mr-2 h-5 w-5" />
                {t('onboardingProcess')}
              </CardTitle>
              <CardDescription>{t('resetOnboardingDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">{t('resetOnboardingExplanation')}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={resetOnboarding}>
                {t('resetOnboarding')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                <BarChart className="inline-block mr-2 h-5 w-5" />
                {t('analyticsSettings')}
              </CardTitle>
              <CardDescription>{t('dataCollectionSettings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 justify-between">
                <div>
                  <Label htmlFor="analytics-consent">{t('analyticsConsent')}</Label>
                  <p className="text-sm text-muted-foreground">{t('allowAnonymousUsageData')}</p>
                </div>
                <Switch 
                  id="analytics-consent"
                  checked={preferences.analyticsConsent}
                  onCheckedChange={() => handleToggleSetting('analyticsConsent')}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-medium">{t('dataPolicies')}</h3>
                <p className="text-sm text-muted-foreground">{t('dataPoliciesDescription')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integration" className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <Calendar className="inline-block mr-2 h-5 w-5" />
                {t('calendarIntegration')}
              </CardTitle>
              <CardDescription>{t('connectToYourCalendar')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 justify-between">
                <div>
                  <Label htmlFor="google-calendar">{t('googleCalendar')}</Label>
                  <p className="text-sm text-muted-foreground">{t('syncWithGoogleCalendar')}</p>
                </div>
                <Button variant="outline" size="sm">
                  {t('connect')}
                </Button>
              </div>
              <Separator />
              <div className="flex items-center space-x-2 justify-between">
                <div>
                  <Label htmlFor="outlook-calendar">{t('outlookCalendar')}</Label>
                  <p className="text-sm text-muted-foreground">{t('syncWithOutlookCalendar')}</p>
                </div>
                <Button variant="outline" size="sm">
                  {t('connect')}
                </Button>
              </div>
              <Separator />
              <div className="flex items-center space-x-2 justify-between">
                <div>
                  <Label htmlFor="apple-calendar">{t('appleCalendar')}</Label>
                  <p className="text-sm text-muted-foreground">{t('syncWithAppleCalendar')}</p>
                </div>
                <Button variant="outline" size="sm">
                  {t('connect')}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('otherIntegrations')}</CardTitle>
              <CardDescription>{t('connectToThirdPartyServices')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 justify-between">
                <div>
                  <p className="font-medium">Google Drive</p>
                  <p className="text-sm text-muted-foreground">{t('storeDocumentsInGoogleDrive')}</p>
                </div>
                <Button variant="outline" size="sm">
                  {t('connect')}
                </Button>
              </div>
              <Separator />
              <div className="flex items-center space-x-2 justify-between">
                <div>
                  <p className="font-medium">Dropbox</p>
                  <p className="text-sm text-muted-foreground">{t('storeDocumentsInDropbox')}</p>
                </div>
                <Button variant="outline" size="sm">
                  {t('connect')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
