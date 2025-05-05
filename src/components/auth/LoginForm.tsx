
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useAppLock } from '@/contexts/AppLockContext';

interface LoginFormProps {
  onToggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = useUserPreferences();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { supportsFaceId, useFaceId } = useAppLock();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: t('error'),
        description: t('pleaseEnterEmailAndPassword'),
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await loginUser(email, password);
      
      if (success) {
        toast({
          title: t('success'),
          description: t('loginSuccessful'),
        });
        navigate('/dashboard');
      } else {
        toast({
          title: t('error'),
          description: t('invalidEmailOrPassword'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: t('somethingWentWrong'),
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFaceIdLogin = async () => {
    if (!supportsFaceId) return;
    
    setIsLoading(true);
    
    try {
      const success = await useFaceId();
      
      if (success) {
        // For demo, we'll just log in a default user with Face ID
        const success = await loginUser('user@example.com', 'password');
        
        if (success) {
          toast({
            title: t('success'),
            description: t('biometricLoginSuccessful'),
          });
          navigate('/dashboard');
        }
      } else {
        toast({
          title: t('error'),
          description: t('biometricAuthFailed'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: t('somethingWentWrong'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t('login')}</CardTitle>
        <CardDescription>{t('enterYourCredentialsToLogin')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="mail@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? t('hidePassword') : t('showPassword')}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? t('loggingIn') : t('login')}
          </Button>
        </form>

        {supportsFaceId && (
          <div className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={handleFaceIdLogin}
              disabled={isLoading}
            >
              <Shield className="mr-2 h-4 w-4" />
              {t('useFaceId')}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t('dontHaveAccount')}</span>{' '}
          <Button 
            variant="link" 
            className="p-0 h-auto"
            onClick={onToggleForm}
            disabled={isLoading}
          >
            {t('register')}
          </Button>
        </div>
        
        <div className="text-center text-xs text-muted-foreground">
          <p>{t('loginDisclaimer')}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
