
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Fingerprint } from 'lucide-react';
import { useAppLock } from '@/contexts/AppLockContext';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const AppLockScreen: React.FC = () => {
  const [pin, setPin] = useState('');
  const { unlockApp, supportsFaceId, useFaceId } = useAppLock();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUnlock = () => {
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
        <CardContent>
          <div className="space-y-4">
            <Input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
            
            {supportsFaceId && (
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 mt-4"
                onClick={handleFaceId}
                disabled={isLoading}
              >
                <Fingerprint className="h-5 w-5" />
                {isLoading ? t('verifying') : t('useFaceId')}
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleUnlock}
            disabled={!pin}
          >
            {t('unlock')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppLockScreen;
