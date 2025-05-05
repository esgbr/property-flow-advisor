
import React, { useState } from 'react';
import { useAppLock } from '@/contexts/AppLockContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { Lock, Fingerprint, ShieldCheck } from 'lucide-react';

const AppLockSettings: React.FC = () => {
  const { pin, setPIN, hasPIN, supportsFaceId } = useAppLock();
  const { t } = useLanguage();
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [useBiometrics, setUseBiometrics] = useState(false);
  
  const handleSetPin = () => {
    // Validierung
    if (!newPin || !confirmPin) {
      setError(t('pleaseEnterBothPins'));
      return;
    }
    
    if (newPin !== confirmPin) {
      setError(t('pinsDontMatch'));
      return;
    }
    
    if (newPin.length < 4) {
      setError(t('pinTooShort'));
      return;
    }
    
    // PIN setzen
    setPIN(newPin);
    setNewPin('');
    setConfirmPin('');
    setError('');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          {t('appLockSettings')}
        </CardTitle>
        <CardDescription>
          {t('appLockDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {hasPIN ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 flex">
              <ShieldCheck className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-700 dark:text-green-300">
                  {t('appLockEnabled')}
                </h4>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  {t('appLockEnabledDescription')}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Label htmlFor="new-pin">{t('enterNewPIN')}</Label>
              <Input 
                id="new-pin" 
                type="password" 
                placeholder="••••" 
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                maxLength={6}
              />
              
              <Label htmlFor="confirm-pin">{t('confirmPIN')}</Label>
              <Input 
                id="confirm-pin" 
                type="password" 
                placeholder="••••" 
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                maxLength={6}
              />
              
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
          )}
        </div>
        
        {supportsFaceId && (
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <Fingerprint className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="use-biometrics">{t('useBiometricsToUnlock')}</Label>
            </div>
            <Switch
              id="use-biometrics"
              checked={useBiometrics}
              onCheckedChange={setUseBiometrics}
              disabled={!hasPIN}
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!hasPIN ? (
          <Button onClick={handleSetPin} disabled={!newPin || !confirmPin}>
            {t('setupPIN')}
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setPIN('')}>
            {t('resetPIN')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AppLockSettings;
