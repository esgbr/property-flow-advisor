import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { checkPasswordStrength, PasswordStrength } from '@/utils/securityUtils';
import { Label } from '@/components/ui/label';

interface SecurityDashboardProps {
  className?: string;
}

interface PasswordStrengthState {
  score: number;
  feedback: string;
  suggestions: string[];
}

/**
 * Comprehensive security management component
 * Allows users to view, manage, and enhance their account security
 */
const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ className }) => {
  const { language } = useLanguage();
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrengthState>({
    score: 0,
    feedback: '',
    suggestions: [],
  });
  const [email, setEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    security: true,
    price: true,
    news: true,
    portfolio: true,
  });

  useEffect(() => {
    const strength = checkPasswordStrength(password);
    setPasswordStrength({
      score: strength.score,
      feedback: strength.feedback,
      suggestions: strength.suggestions,
    });
  }, [password]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleVerifyEmail = () => {
    // Simulate email verification process
    setIsEmailVerified(true);
  };

  const handleEnableTwoFactor = () => {
    // Simulate enabling two-factor authentication
    setIsTwoFactorEnabled(true);
  };

  const handleSecuritySettingsChange = (setting: string, value: boolean) => {
    setSecuritySettings(prevSettings => ({
      ...prevSettings,
      [setting]: value,
    }));
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'de' ? 'Passwort ändern' : 'Change Password'}
          </CardTitle>
          <CardDescription>
            {language === 'de'
              ? 'Aktualisieren Sie Ihr Passwort, um die Sicherheit zu erhöhen'
              : 'Update your password to enhance security'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">
              {language === 'de' ? 'Neues Passwort' : 'New Password'}
            </Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <Progress value={passwordStrength.score * 20} max={100} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {passwordStrength.feedback}
            </p>
            {passwordStrength.suggestions.length > 0 && (
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {passwordStrength.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            )}
          </div>
          <Button>
            {language === 'de' ? 'Passwort aktualisieren' : 'Update Password'}
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            {language === 'de' ? 'E-Mail-Adresse verwalten' : 'Manage Email Address'}
          </CardTitle>
          <CardDescription>
            {language === 'de'
              ? 'Überprüfen und aktualisieren Sie Ihre E-Mail-Adresse'
              : 'Verify and update your email address'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">
              {language === 'de' ? 'E-Mail-Adresse' : 'Email Address'}
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
            />
            {!isEmailVerified && (
              <Button variant="secondary" onClick={handleVerifyEmail}>
                {language === 'de' ? 'E-Mail verifizieren' : 'Verify Email'}
              </Button>
            )}
            {isEmailVerified && (
              <p className="text-sm text-green-500">
                {language === 'de' ? 'E-Mail verifiziert' : 'Email Verified'}
              </p>
            )}
          </div>
          <Button>
            {language === 'de' ? 'E-Mail aktualisieren' : 'Update Email'}
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            {language === 'de' ? 'Zwei-Faktor-Authentifizierung' : 'Two-Factor Authentication'}
          </CardTitle>
          <CardDescription>
            {language === 'de'
              ? 'Fügen Sie eine zusätzliche Sicherheitsebene hinzu'
              : 'Add an extra layer of security'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p>
            {language === 'de'
              ? 'Aktivieren Sie die Zwei-Faktor-Authentifizierung für zusätzlichen Schutz.'
              : 'Enable two-factor authentication for added protection.'}
          </p>
          {!isTwoFactorEnabled && (
            <Button variant="secondary" onClick={handleEnableTwoFactor}>
              {language === 'de' ? 'Aktivieren' : 'Enable'}
            </Button>
          )}
          {isTwoFactorEnabled && (
            <p className="text-sm text-green-500">
              {language === 'de' ? 'Zwei-Faktor-Authentifizierung aktiviert' : 'Two-Factor Authentication Enabled'}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            {language === 'de' ? 'Benachrichtigungseinstellungen' : 'Notification Settings'}
          </CardTitle>
          <CardDescription>
            {language === 'de'
              ? 'Passen Sie Ihre Benachrichtigungseinstellungen an'
              : 'Customize your notification preferences'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="security">
              {language === 'de' ? 'Sicherheitsbenachrichtigungen' : 'Security Notifications'}
            </Label>
            <input
              type="checkbox"
              id="security"
              checked={securitySettings.security || false}
              onChange={(e) => handleSecuritySettingsChange('security', e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="price">
              {language === 'de' ? 'Preisbenachrichtigungen' : 'Price Notifications'}
            </Label>
            <input
              type="checkbox"
              id="price"
              checked={securitySettings.price || false}
              onChange={(e) => handleSecuritySettingsChange('price', e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="news">
              {language === 'de' ? 'Nachrichtenbenachrichtigungen' : 'News Notifications'}
            </Label>
            <input
              type="checkbox"
              id="news"
              checked={securitySettings.news || false}
              onChange={(e) => handleSecuritySettingsChange('news', e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="portfolio">
              {language === 'de' ? 'Portfoliobenachrichtigungen' : 'Portfolio Notifications'}
            </Label>
            <input
              type="checkbox"
              id="portfolio"
              checked={securitySettings.portfolio || false}
              onChange={(e) => handleSecuritySettingsChange('portfolio', e.target.checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
