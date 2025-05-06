
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Lock, Eye, EyeOff, Copy, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { checkPasswordStrength, generateSecurePassword } from '@/utils/securityUtils';
import { useAccessibility } from '@/hooks/use-accessibility';

interface SecurityUtilsProps {
  className?: string;
}

/**
 * Security utilities component 
 * Provides password generation and strength testing tools
 */
const SecurityUtils: React.FC<SecurityUtilsProps> = ({ className }) => {
  const { language } = useLanguage();
  const { announce } = useAccessibility();
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<{ 
    score: number;
    feedback: string; 
    suggestions: string[];
  }>({ score: 0, feedback: '', suggestions: [] });
  const [generatingPassword, setGeneratingPassword] = useState<boolean>(false);

  // Check password strength when password changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Check strength
    if (newPassword) {
      const strength = checkPasswordStrength(newPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, feedback: '', suggestions: [] });
    }
  };

  // Generate a secure password
  const handleGeneratePassword = () => {
    setGeneratingPassword(true);
    
    // Simulate a slight delay for better UX
    setTimeout(() => {
      const newPassword = generateSecurePassword(16);
      setPassword(newPassword);
      
      const strength = checkPasswordStrength(newPassword);
      setPasswordStrength(strength);
      
      setGeneratingPassword(false);
      
      announce(
        language === 'de'
          ? 'Sicheres Passwort wurde generiert'
          : 'Secure password has been generated',
        'polite'
      );
    }, 500);
  };

  // Copy password to clipboard
  const handleCopyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      toast.success(
        language === 'de'
          ? 'Passwort in die Zwischenablage kopiert'
          : 'Password copied to clipboard'
      );
      
      announce(
        language === 'de'
          ? 'Passwort wurde in die Zwischenablage kopiert'
          : 'Password has been copied to clipboard',
        'polite'
      );
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    
    announce(
      language === 'de'
        ? showPassword ? 'Passwort ausgeblendet' : 'Passwort angezeigt'
        : showPassword ? 'Password hidden' : 'Password shown',
      'polite'
    );
  };

  // Get color for password strength indicator
  const getStrengthColor = () => {
    if (passwordStrength.score < 30) return 'bg-red-500';
    if (passwordStrength.score < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          {language === 'de' ? 'Sicherheits-Tools' : 'Security Tools'}
        </CardTitle>
        <CardDescription>
          {language === 'de'
            ? 'Tools zur Verbesserung Ihrer Sicherheit'
            : 'Tools to enhance your security'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">
              {language === 'de' ? 'Passwortgenerator' : 'Password Generator'}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleGeneratePassword}
              disabled={generatingPassword}
              className="h-8 gap-1"
            >
              {generatingPassword ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              {language === 'de' ? 'Generieren' : 'Generate'}
            </Button>
          </div>
          
          <div className="flex mt-2">
            <div className="relative flex-grow">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={
                  language === 'de'
                    ? 'Passwort eingeben oder generieren'
                    : 'Enter or generate password'
                }
                value={password}
                onChange={handlePasswordChange}
                className="pr-20"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-10 flex items-center px-2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword
                    ? (language === 'de' ? 'Passwort ausblenden' : 'Hide password')
                    : (language === 'de' ? 'Passwort anzeigen' : 'Show password')
                  }
                </span>
              </button>
              <button
                type="button"
                onClick={handleCopyPassword}
                disabled={!password}
                className={cn(
                  "absolute inset-y-0 right-0 flex items-center px-2",
                  "text-muted-foreground hover:text-foreground",
                  !password && "opacity-50 cursor-not-allowed"
                )}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {language === 'de' ? 'Passwort kopieren' : 'Copy password'}
                </span>
              </button>
            </div>
          </div>
          
          {password && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {language === 'de' ? 'Passwortstärke' : 'Password strength'}
                </div>
                <div className="text-xs font-medium">
                  {passwordStrength.feedback}
                </div>
              </div>
              <Progress
                value={passwordStrength.score}
                max={100}
                className="h-1.5"
                indicatorClassName={getStrengthColor()}
              />
              
              {passwordStrength.suggestions.length > 0 && (
                <div className="mt-2 text-sm bg-muted/50 p-2 rounded-md">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-xs">
                        {language === 'de' ? 'Vorschläge zur Verbesserung:' : 'Improvement suggestions:'}
                      </span>
                      <ul className="text-xs list-disc pl-4 mt-1 space-y-0.5">
                        {passwordStrength.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="flex items-center gap-1.5 text-sm font-medium mb-2">
            <Lock className="h-4 w-4 text-primary" />
            {language === 'de' ? 'Sicherheits-Tipps' : 'Security Tips'}
          </h3>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• {language === 'de' ? 'Verwenden Sie für jeden Dienst ein einzigartiges Passwort' : 'Use a unique password for each service'}</li>
            <li>• {language === 'de' ? 'Aktivieren Sie 2FA, wo immer möglich' : 'Enable 2FA wherever possible'}</li>
            <li>• {language === 'de' ? 'Vermeiden Sie es, persönliche Informationen in Passwörtern zu verwenden' : 'Avoid using personal information in passwords'}</li>
            <li>• {language === 'de' ? 'Aktualisieren Sie regelmäßig Ihre Passwörter' : 'Update your passwords regularly'}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityUtils;
