import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppLock } from '@/contexts/AppLockContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { toast } from '@/components/ui/use-toast';
import { Lock, Unlock, AlertTriangle, Fingerprint } from 'lucide-react';

const AppLockScreen: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { unlockApp, isLocked, setIsLocked } = useAppLock();
  const [pin, setPin] = useState('');
  const { preferences } = useUserPreferences();
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Redirect if not locked
    if (!isLocked) {
      navigate('/dashboard');
    }
  }, [isLocked, navigate]);

  const handleUnlock = () => {
    if (pin === localStorage.getItem('appPin')) {
      unlockApp();
      navigate('/dashboard');
    } else {
      setError(t('incorrectPIN'));
      toast({
        title: t('unlockFailed'),
        description: t('incorrectPIN'),
        variant: 'destructive',
      });
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: t('resetPIN'),
      description: t('contactSupportToResetPIN'),
      duration: 5000,
    });
  };

  const handleBiometricUnlock = () => {
    toast({
      title: t('biometricUnlock'),
      description: t('biometricUnlockNotImplemented'),
      duration: 5000,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-6 space-y-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t('appLocked')}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {t('enterYourPIN')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Input
              type="password"
              placeholder="••••"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              className="text-center text-2xl font-mono tracking-widest"
              maxLength={4}
            />
            {error && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>
          <Button onClick={handleUnlock} className="w-full">
            <Unlock className="w-4 h-4 mr-2" />
            {t('unlock')}
          </Button>
          {preferences.biometricsEnabled && (
            <Button variant="outline" onClick={handleBiometricUnlock} className="w-full">
              <Fingerprint className="w-4 h-4 mr-2" />
              {t('unlockWithBiometrics')}
            </Button>
          )}
        </CardContent>
        <div className="text-center text-sm text-muted-foreground">
          <button onClick={handleForgotPassword} className="hover:underline">
            {t('forgotPIN')}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AppLockScreen;
