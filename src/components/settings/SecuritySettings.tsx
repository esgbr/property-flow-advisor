
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SecuritySettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const toggleAppLock = (checked: boolean) => {
    updatePreferences({ appLockEnabled: checked });
    
    if (checked) {
      toast.success(t('appLockEnabled'));
    } else {
      toast.success(t('appLockDisabled'));
    }
  };
  
  const handleGotoSecurityCenter = () => {
    navigate('/security');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('securitySettings')}</CardTitle>
        <CardDescription>{t('manageYourAccountSecurity')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="app-lock" className="block mb-1">{t('appLock')}</Label>
            <p className="text-sm text-muted-foreground">{t('appLockDescription')}</p>
          </div>
          <Switch
            id="app-lock"
            checked={preferences.appLockEnabled || false}
            onCheckedChange={toggleAppLock}
          />
        </div>
        
        <div>
          <Button variant="outline" onClick={handleGotoSecurityCenter}>
            {t('visitSecurityCenter')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
