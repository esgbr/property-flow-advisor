
import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAppLock } from '@/contexts/AppLockContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Key, Lock } from 'lucide-react';
import PinInput from './app-lock/PinInput';
import BiometricButton from './app-lock/BiometricButton';

const AppLockScreen = () => {
  const { validatePin, unlockApp, useFaceId, supportsFaceId } = useAppLock();
  const { t } = useLanguage();
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const handlePinSubmit = () => {
    if (validatePin(enteredPin)) {
      unlockApp(enteredPin);
      toast.success('App unlocked!');
    } else {
      toast.error('Invalid PIN');
      setEnteredPin('');
    }
  };

  const handleFaceIdAuth = async () => {
    setIsAuthenticating(true);
    try {
      const success = await useFaceId();
      if (success) {
        // We still need to call unlockApp with a pin since our context requires it
        unlockApp(enteredPin);
        toast.success('Face ID authentication successful!');
      } else {
        toast.error('Face ID authentication failed');
      }
    } catch (error) {
      toast.error('Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Lock className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-center">{t('appLock')}</CardTitle>
          <CardDescription className="text-center">
            {t('enterPin')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <PinInput
              value={enteredPin}
              onChange={setEnteredPin}
            />
            
            <Button 
              onClick={handlePinSubmit} 
              className="w-full"
              disabled={enteredPin.length !== 4}
            >
              <Key className="mr-2 h-4 w-4" /> {t('unlock')}
            </Button>
            
            {supportsFaceId && (
              <BiometricButton 
                onClick={handleFaceIdAuth} 
                isLoading={isAuthenticating} 
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppLockScreen;
