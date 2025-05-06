
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Check, RefreshCcw } from 'lucide-react';
import { logSecurityEvent } from '@/utils/securityUtils';
import { Progress } from '@/components/ui/progress';

interface TwoFactorAuthProps {
  onVerify: (code: string) => Promise<boolean>;
  onCancel?: () => void;
  phoneNumber?: string;
  email?: string;
  method?: '2fa' | 'email' | 'sms';
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({
  onVerify,
  onCancel,
  phoneNumber,
  email,
  method = '2fa'
}) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  // Countdown timer for code expiration
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);
  
  // Reset state when method changes
  useEffect(() => {
    setCode('');
    setError(null);
    setIsVerified(false);
    setIsLoading(false);
  }, [method]);
  
  const handleVerify = async () => {
    if (code.length !== 6) {
      setError(t('invalidCodeLength'));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await onVerify(code);
      
      if (success) {
        setIsVerified(true);
        toast.success(t('verificationSuccessful'));
        
        // Log successful verification
        logSecurityEvent('login', {
          method: '2fa',
          success: true
        }, {
          notifyUser: false,
          severity: 'info'
        });
      } else {
        setError(t('invalidCode'));
        
        // Log failed verification
        logSecurityEvent('login_failure', {
          method: '2fa',
          reason: 'invalid_code'
        }, {
          severity: 'warning'
        });
      }
    } catch (err) {
      setError(t('verificationError'));
      console.error('2FA verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendCode = () => {
    if (!canResend) return;
    
    setCanResend(false);
    setCountdown(30);
    setError(null);
    
    // Here you would implement the actual code resending logic
    toast.info(t('codeSentAgain'), {
      description: method === 'email' ? email : phoneNumber
    });
    
    // Log resend event
    logSecurityEvent('login', {
      method: '2fa',
      action: 'resend_code'
    });
  };
  
  const getTitle = () => {
    switch (method) {
      case 'email':
        return t('verifyYourEmail');
      case 'sms':
        return t('verifyYourPhone');
      default:
        return t('twoFactorAuthentication');
    }
  };
  
  const getDescription = () => {
    switch (method) {
      case 'email':
        return t('enterCodeSentToEmail', { email: anonymizeEmail(email) });
      case 'sms':
        return t('enterCodeSentToPhone', { phone: anonymizePhone(phoneNumber) });
      default:
        return t('enterAuthenticatorCode');
    }
  };
  
  // Helper functions to anonymize sensitive data
  const anonymizeEmail = (email?: string) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    return `${localPart.substring(0, 2)}***@${domain}`;
  };
  
  const anonymizePhone = (phone?: string) => {
    if (!phone) return '';
    return phone.replace(/(\+\d{1,3}|\d{1,4})(.*)(\d{2})/, '$1******$3');
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{getTitle()}</CardTitle>
          {isVerified && <Check className="h-5 w-5 text-green-500" />}
        </div>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <InputOTP 
          maxLength={6}
          value={code} 
          onChange={setCode}
          disabled={isLoading || isVerified}
          render={({ slots }) => (
            <div className="flex justify-center gap-1 sm:gap-2">
              {slots.map((slot, index) => (
                <InputOTPGroup key={index}>
                  <InputOTPSlot {...slot} />
                </InputOTPGroup>
              ))}
            </div>
          )}
        />
        
        {error && (
          <p className="text-destructive text-sm text-center">{error}</p>
        )}
        
        {!isVerified && (
          <div className="text-center text-sm text-muted-foreground">
            {!canResend ? (
              <div className="space-y-2">
                <p>{t('codeExpires')}: {countdown}s</p>
                <Progress value={(countdown / 30) * 100} className="h-1" />
              </div>
            ) : (
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto"
                onClick={handleResendCode}
                disabled={!canResend}
              >
                <RefreshCcw className="h-3 w-3 mr-1" />
                {t('resendCode')}
              </Button>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading || isVerified}
          >
            {t('cancel')}
          </Button>
        )}
        
        <Button 
          className={onCancel ? "" : "w-full"}
          onClick={handleVerify}
          disabled={code.length !== 6 || isLoading || isVerified}
        >
          <Shield className="mr-2 h-4 w-4" />
          {isLoading ? t('verifying') : t('verify')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TwoFactorAuth;
