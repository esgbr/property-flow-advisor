
import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useAppLock } from '@/contexts/AppLockContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Lock, Key, Shield } from 'lucide-react';

const AppLockSettings = () => {
  const { pin, setPin, lockApp, unlockApp, isLocked, supportsFaceId } = useAppLock();
  const { t } = useLanguage();
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [step, setStep] = useState<'create' | 'confirm'>(pin ? 'confirm' : 'create');

  const handleToggleLock = (enabled: boolean) => {
    if (enabled) {
      if (pin) {
        lockApp();
        toast.success('App locked!');
      } else {
        toast.error('Please set a PIN first');
      }
    } else if (pin) {
      // Pass the pin to unlock the app (required by our interface)
      unlockApp(pin);
      toast.success('App unlocked!');
    }
  };

  const handleCreatePin = () => {
    if (step === 'create') {
      setStep('confirm');
      return;
    }

    if (newPin === confirmPin) {
      setPin(newPin);
      toast.success('PIN set successfully!');
      setNewPin('');
      setConfirmPin('');
      setStep('create');
    } else {
      toast.error('PINs do not match!');
      setConfirmPin('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="mr-2 h-5 w-5" /> {t('appLock')}
        </CardTitle>
        <CardDescription>
          Secure your app with PIN or Face ID
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="app-lock-toggle">{t('lock')}</Label>
          <Switch
            id="app-lock-toggle"
            checked={isLocked}
            onCheckedChange={handleToggleLock}
          />
        </div>
        
        <div className="space-y-4">
          <div className="text-sm font-medium">
            {step === 'create' ? 'Set a PIN' : 'Confirm your PIN'}
          </div>
          
          <InputOTP
            maxLength={4}
            value={step === 'create' ? newPin : confirmPin}
            onChange={step === 'create' ? setNewPin : setConfirmPin}
            render={({ slots }) => (
              <InputOTPGroup>
                {slots.map((slot, index) => (
                  <InputOTPSlot key={index} {...slot} index={index} />
                ))}
              </InputOTPGroup>
            )}
          />
          
          <Button 
            onClick={handleCreatePin} 
            disabled={(step === 'create' && newPin.length !== 4) || 
                     (step === 'confirm' && confirmPin.length !== 4)}
            className="w-full"
          >
            <Key className="mr-2 h-4 w-4" />
            {step === 'create' ? 'Continue' : 'Save PIN'}
          </Button>
          
          {supportsFaceId && (
            <div className="mt-4 flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span className="text-sm">Face ID is available on this device</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppLockSettings;
