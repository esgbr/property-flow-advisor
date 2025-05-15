
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useAppLock } from '@/contexts/AppLockContext';
import { Shield, ShieldCheck, ShieldAlert, Lock, Fingerprint, AlertTriangle } from 'lucide-react';

const SecuritySettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { pin, lockApp, setPIN } = useAppLock();
  
  const toggleAppLock = (checked: boolean) => {
    if (checked && !pin) {
      // If enabling app lock but no PIN is set, navigate to security center
      navigate('/security');
      
      toast({
        title: t('pinRequired'),
        description: t('pleaseSetPin'),
        variant: "destructive"
      });
      
      return;
    }
    
    updatePreferences({ appLockEnabled: checked });
    
    if (checked) {
      toast({
        title: t('appLockEnabled'),
        description: t('appLockedDescription'),
      });
      
      // Lock the app immediately when enabled
      if (pin) {
        setTimeout(() => lockApp(), 500);
      }
    } else {
      toast({
        title: t('appLockDisabled'),
        description: t('appUnlockedDescription'),
      });
    }
  };
  
  const handleGotoSecurityCenter = () => {
    navigate('/security');
  };
  
  const handleTestLock = () => {
    if (pin) {
      lockApp();
      navigate('/locked');
    } else {
      toast({
        title: t('noPinSet'),
        description: t('pleaseSetupPINFirst'),
        variant: "destructive"
      });
    }
  };
  
  const securityLevel = pin ? 
    (preferences.twoFactorEnabled ? 'high' : 'medium') : 
    'low';
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>{t('securitySettings')}</CardTitle>
        </div>
        <CardDescription>{t('manageYourAccountSecurity')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3 mb-3">
            {securityLevel === 'low' && <ShieldAlert className="h-5 w-5 text-red-500" />}
            {securityLevel === 'medium' && <ShieldCheck className="h-5 w-5 text-amber-500" />}
            {securityLevel === 'high' && <ShieldCheck className="h-5 w-5 text-green-500" />}
            
            <div>
              <h3 className="font-medium">
                {t('securityLevel')}: {' '}
                <span className={
                  securityLevel === 'low' ? 'text-red-500' : 
                  securityLevel === 'medium' ? 'text-amber-500' : 
                  'text-green-500'
                }>
                  {t(securityLevel)}
                </span>
              </h3>
              <p className="text-sm text-muted-foreground">
                {securityLevel === 'low' && t('lowSecurityDescription')}
                {securityLevel === 'medium' && t('mediumSecurityDescription')}
                {securityLevel === 'high' && t('highSecurityDescription')}
              </p>
            </div>
          </div>
          
          {securityLevel === 'low' && (
            <div className="flex items-center p-2 bg-red-500/10 rounded-md border border-red-200 text-sm">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
              <span className="text-red-700 dark:text-red-300">{t('securityWarning')}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="app-lock" className="block mb-1">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {t('appLock')}
              </div>
            </Label>
            <p className="text-sm text-muted-foreground">{t('appLockDescription')}</p>
          </div>
          <Switch
            id="app-lock"
            checked={preferences.appLockEnabled || false}
            onCheckedChange={toggleAppLock}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="biometrics" className="block mb-1">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4" />
                {t('biometricAuthentication')}
              </div>
            </Label>
            <p className="text-sm text-muted-foreground">{t('biometricAuthDescription')}</p>
          </div>
          <Switch
            id="biometrics"
            checked={preferences.biometricsEnabled || false}
            onCheckedChange={(checked) => updatePreferences({ biometricsEnabled: checked })}
            disabled={!preferences.appLockEnabled}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
          <Button variant="outline" onClick={handleTestLock}>
            <Lock className="h-4 w-4 mr-2" />
            {t('testAppLock')}
          </Button>
          
          <Button onClick={handleGotoSecurityCenter}>
            <Shield className="h-4 w-4 mr-2" />
            {t('visitSecurityCenter')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
