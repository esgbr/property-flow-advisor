
import React, { useState, useEffect } from 'react';
import { Shield, Fingerprint, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface BiometricAuthProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
  className?: string;
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({
  onSuccess,
  onCancel,
  title,
  description,
  className
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  // Check if biometric auth is available
  useEffect(() => {
    const checkAvailability = async () => {
      // In a real app, you would check if the device supports biometrics
      // For now, we'll just simulate based on the browser's capabilities
      const isModernDevice = 
        'FaceDetector' in window || 
        'PublicKeyCredential' in window || 
        'credentials' in navigator;
      
      setIsAvailable(isModernDevice);
    };
    
    checkAvailability();
  }, []);
  
  const handleAuthenticate = async () => {
    if (!isAvailable) {
      toast({
        title: t('error'),
        description: t('biometricsNotAvailable'),
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, you would use the Web Authentication API
      // For now, we'll just simulate the authentication process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Authentication successful
      setIsComplete(true);
      toast({
        title: t('success'),
        description: t('biometricAuthSuccessful'),
      });
      
      // Wait a moment before calling onSuccess
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 500);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('biometricAuthFailed'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className={cn("max-w-sm mx-auto", className)}>
      <CardHeader className="text-center">
        <CardTitle>{title || t('biometricAuthentication')}</CardTitle>
        <CardDescription>
          {description || t('useBiometricToAuthenticate')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all",
          isLoading ? "bg-primary/10 animate-pulse" : "bg-primary/5",
          isComplete ? "bg-green-100 dark:bg-green-900/20" : ""
        )}>
          {isComplete ? (
            <Check className="h-12 w-12 text-green-500" />
          ) : (
            <Fingerprint className={cn(
              "h-12 w-12",
              isLoading ? "text-primary animate-pulse" : "text-muted-foreground"
            )} />
          )}
        </div>
        
        <div className="flex gap-3 w-full mt-4">
          {!isComplete && (
            <>
              <Button 
                variant="default" 
                className="flex-1"
                onClick={handleAuthenticate}
                disabled={isLoading || !isAvailable}
              >
                <Shield className="mr-2 h-4 w-4" />
                {isLoading 
                  ? t('authenticating') 
                  : t('authenticate')
                }
              </Button>
              
              {onCancel && (
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  {t('cancel')}
                </Button>
              )}
            </>
          )}
          
          {isComplete && onSuccess && (
            <Button 
              variant="default" 
              className="flex-1"
              onClick={onSuccess}
            >
              {t('continue')}
            </Button>
          )}
        </div>
        
        {!isAvailable && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            {t('biometricsNotSupportedByDevice')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BiometricAuth;
