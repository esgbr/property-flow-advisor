
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageStatus from '@/components/language/LanguageStatus';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SkipToContent from '@/components/accessibility/SkipToContent';

const LanguageSettings = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <SkipToContent contentId="language-settings-content" />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('languageSettings')}</h1>
          <p className="text-muted-foreground">{t('manageLanguagePreferences')}</p>
        </div>
        <LanguageSwitcher />
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6" id="language-settings-content">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="translations">Translation Status</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="focus:outline-none">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('currentLanguage')}</CardTitle>
                <CardDescription>{t('activeLanguageDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <LanguageSwitcher />
                  <p>{t('switchLanguageDescription')}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('interfaceLanguage')}</CardTitle>
                <CardDescription>{t('interfaceLanguageDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  {t('interfaceLanguageInfo')}
                </p>
                <div className="flex gap-2">
                  <LanguageSwitcher />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="translations" className="focus:outline-none">
          <LanguageStatus />
        </TabsContent>
        
        <TabsContent value="preferences" className="focus:outline-none">
          <Card>
            <CardHeader>
              <CardTitle>{t('languagePreferences')}</CardTitle>
              <CardDescription>{t('languagePreferencesDescription')}</CardDescription>
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

export default LanguageSettings;
