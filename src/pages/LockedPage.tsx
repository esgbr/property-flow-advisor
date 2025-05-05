
import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppLock } from '@/contexts/AppLockContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useToast } from '@/components/ui/use-toast';
import { Lock, Fingerprint, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const LockedPage: React.FC = () => {
  const { isLocked, unlockApp, supportsFaceId, useFaceId } = useAppLock();
  const { isAuthenticated, preferences } = useUserPreferences();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Wenn nicht authentifiziert, zur Anmeldeseite umleiten
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  // Wenn nicht gesperrt, zur ursprünglichen Seite oder zum Dashboard umleiten
  if (!isLocked) {
    const destination = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={destination} replace />;
  }
  
  // PIN prüfen und entsperren
  const handleUnlock = () => {
    if (pin.length < 4) {
      toast({
        title: t('error'),
        description: t('invalidPIN'),
        variant: 'destructive',
      });
      return;
    }
    
    setIsVerifying(true);
    
    setTimeout(() => {
      const success = unlockApp(pin);
      
      if (success) {
        toast({
          title: t('success'),
          description: t('appUnlocked'),
        });
        
        // Zur ursprünglichen Seite oder zum Dashboard umleiten
        const destination = location.state?.from?.pathname || '/dashboard';
        navigate(destination, { replace: true });
      } else {
        toast({
          title: t('error'),
          description: t('incorrectPIN'),
          variant: 'destructive',
        });
      }
      
      setIsVerifying(false);
    }, 500);
  };
  
  // Mit FaceID entsperren
  const handleFaceIdUnlock = async () => {
    if (!supportsFaceId) return;
    
    setIsVerifying(true);
    
    try {
      const success = await useFaceId();
      
      if (success) {
        toast({
          title: t('success'),
          description: t('appUnlocked'),
        });
        
        // Zur ursprünglichen Seite oder zum Dashboard umleiten
        const destination = location.state?.from?.pathname || '/dashboard';
        navigate(destination, { replace: true });
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: t('faceIdFailed'),
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t('appLocked')}</CardTitle>
          <CardDescription>
            {preferences.name 
              ? t('welcomeBack') + ', ' + preferences.name
              : t('enterPINToUnlock')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Input
              type="password"
              placeholder={t('enterPIN')}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
              className="text-center text-lg"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUnlock();
                }
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            onClick={handleUnlock} 
            className="w-full" 
            disabled={isVerifying}
          >
            <Key className="mr-2 h-4 w-4" />
            {isVerifying ? t('verifying') : t('unlock')}
          </Button>
          
          {supportsFaceId && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleFaceIdUnlock}
              disabled={isVerifying}
            >
              <Fingerprint className="mr-2 h-4 w-4" />
              {t('useFaceID')}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default LockedPage;
