
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useAppLock } from '../contexts/AppLockContext';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { Fingerprint, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AppLockScreen: React.FC = () => {
  const { unlockApp, useFaceId, isBiometricEnabled } = useAppLock();
  const { preferences } = useUserPreferences();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const pinInputRef = useRef<HTMLInputElement>(null);
  const biometricsEnabled = preferences.biometricsEnabled || false;

  useEffect(() => {
    // Auto-focus the PIN input for better keyboard accessibility
    pinInputRef.current?.focus();
  }, []);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    setPin(newValue);
    
    if (error) setError('');
  };

  const handleUnlock = () => {
    if (pin.length === 0) {
      setError('Please enter your PIN');
      return;
    }

    const success = unlockApp(pin);
    
    if (success) {
      toast({
        title: "Unlocked",
        description: "App successfully unlocked",
      });
    } else {
      const newAttemptsLeft = attemptsLeft - 1;
      setAttemptsLeft(newAttemptsLeft);
      setError(`Incorrect PIN. ${newAttemptsLeft} attempts left.`);
      setPin('');

      if (newAttemptsLeft <= 0) {
        // In a real app, you would implement a timeout or additional security measures
        toast({
          title: "Too many attempts",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const success = await useFaceId();
      
      if (success) {
        toast({
          title: "Biometric Authentication",
          description: "Successfully authenticated",
        });
      } else {
        toast({
          title: "Authentication Failed",
          description: "Biometric authentication unsuccessful",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Biometric authentication unavailable",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-background p-4"
      data-testid="app-lock-screen"
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Lock className="h-6 w-6" aria-hidden="true" />
            App Locked
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                ref={pinInputRef}
                type={showPin ? "text" : "password"}
                placeholder="Enter PIN"
                value={pin}
                onChange={handlePinChange}
                onKeyDown={handleKeyDown}
                inputMode="numeric"
                pattern="[0-9]*"
                aria-label="Enter PIN to unlock"
                aria-invalid={!!error}
                aria-describedby={error ? "pin-error" : undefined}
                className="pr-10"
                maxLength={6}
                autoComplete="off"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPin(!showPin)}
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {error && (
              <p id="pin-error" className="text-sm font-medium text-destructive">
                {error}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            className="w-full" 
            onClick={handleUnlock}
            disabled={attemptsLeft <= 0}
          >
            Unlock
          </Button>
          
          {isBiometricEnabled && biometricsEnabled && (
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2" 
              onClick={handleBiometricAuth}
            >
              <Fingerprint className="h-5 w-5" aria-hidden="true" />
              Use Biometrics
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppLockScreen;
