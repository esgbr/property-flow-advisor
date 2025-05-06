
import React, { useState } from 'react';
import SecurityDashboard from '@/components/security/SecurityDashboard';
import AuthGuard from '@/components/auth/AuthGuard';
import { Shield, Lock, AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAppLock } from '@/contexts/AppLockContext';

const SecurityPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();
  const { hasPIN } = useAppLock();
  const [activeTab, setActiveTab] = useState<string>('overview');

  const handleSetupSecurity = () => {
    navigate('/settings?tab=security&setup=true');
  };

  return (
    <AuthGuard>
      <div className="container mx-auto py-6">
        <div className="mb-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{t('securityCenter')}</h1>
              <p className="text-muted-foreground mt-1">
                {t('securityCenterDescription')}
              </p>
            </div>
          </div>
        </div>

        {!hasPIN && (
          <Alert className="mb-6 border-amber-500 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-500">{t('securityRecommendation')}</AlertTitle>
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span>{t('enableAppLockRecommendation')}</span>
              <Button 
                size="sm"
                variant="outline" 
                className="border-amber-500 text-amber-500 hover:bg-amber-500/20"
                onClick={handleSetupSecurity}
              >
                <Lock className="mr-2 h-4 w-4" />
                {t('setupAppLock')}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs 
          defaultValue="overview" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="overview">
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t('overview')}</span>
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Lock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t('securitySettings')}</span>
            </TabsTrigger>
            <TabsTrigger value="activity">
              <UserCheck className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t('activity')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-primary" />
                    {t('appLock')}
                  </CardTitle>
                  <CardDescription>{t('appLockDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{t('appLockExplanation')}</p>
                  <Button 
                    variant={hasPIN ? "outline" : "default"} 
                    onClick={handleSetupSecurity}
                  >
                    {hasPIN ? t('managePIN') : t('setupPIN')}
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                    {t('securityAlerts')}
                  </CardTitle>
                  <CardDescription>{t('securityAlertsDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{t('securityAlertsExplanation')}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/settings?tab=notifications')}
                  >
                    {t('manageAlerts')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>{t('recentActivity')}</CardTitle>
                <CardDescription>{t('recentActivityDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {preferences.lastActive ? (
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <UserCheck className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t('lastLogin')}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(preferences.lastActive).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <p>{t('noRecentActivity')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
};

export default SecurityPage;
