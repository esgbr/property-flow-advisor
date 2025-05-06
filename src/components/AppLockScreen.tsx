
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Fingerprint } from 'lucide-react';
import { useAppLock } from '@/contexts/AppLockContext';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import BiometricAuth from '@/components/auth/BiometricAuth';
import PinInput from '@/components/app-lock/PinInput';
import BiometricButton from '@/components/app-lock/BiometricButton';

const AppLockScreen: React.FC = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const { unlockApp, supportsFaceId, useFaceId } = useAppLock();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUnlock = () => {
    if (pin.length < 4) {
      setError(true);
      return;
    }
    
    if (unlockApp(pin)) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
      toast({
        title: t('appUnlocked'),
        description: t('welcomeBack'),
      });
    } else {
      toast({
        title: t('error'),
        description: t('invalidPIN'),
        variant: 'destructive',
      });
      setPin('');
      setError(true);
    }
  };
  
  const handleFaceId = async () => {
    setIsLoading(true);
    try {
      const success = await useFaceId();
      if (success) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from);
        toast({
          title: t('appUnlocked'),
          description: t('welcomeBack'),
        });
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: t('faceIdFailed'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePinChange = (value: string) => {
    setPin(value);
    setError(false);
    
    // Auto-submit when PIN is complete
    if (value.length === 4) {
      setTimeout(() => {
        if (unlockApp(value)) {
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from);
          toast({
            title: t('appUnlocked'),
            description: t('welcomeBack'),
          });
        } else {
          toast({
            title: t('error'),
            description: t('invalidPIN'),
            variant: 'destructive',
          });
          setPin('');
          setError(true);
        }
      }, 300);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-background/80">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t('appLocked')}</CardTitle>
          <CardDescription>{t('enterPINToUnlock')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PinInput
            value={pin}
            onChange={handlePinChange}
            maxLength={4}
            label={t('enterPIN')}
            error={error}
            errorMessage={t('invalidPIN')}
          />
          
          {supportsFaceId && (
            <div className="pt-4">
              <BiometricButton
                onClick={handleFaceId}
                isLoading={isLoading}
                type="faceId"
                disabled={isLoading}
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleUnlock}
            disabled={!pin || isLoading}
          >
            {t('unlock')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppLockScreen;
