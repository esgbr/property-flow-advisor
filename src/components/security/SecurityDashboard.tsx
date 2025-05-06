import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useAccessibility } from '@/hooks/use-accessibility';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ReloadIcon } from 'lucide-react';

const SecurityDashboard: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { language, t } = useLanguage();
  const { announce } = useAccessibility();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // State for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // State for email verification
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);
  
  const handleToggleNotification = (type: string, checked: boolean) => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        [type]: checked,
      },
    });
    
    // Announce the change for screen readers
    announce(
      language === 'de'
        ? `Benachrichtigungen für ${type} ${checked ? 'aktiviert' : 'deaktiviert'}`
        : `Notifications for ${type} ${checked ? 'enabled' : 'disabled'}`,
      'polite'
    );
  };
  
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t('allFieldsRequired'));
      announce(t('allFieldsRequired'), 'assertive');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError(t('passwordsDoNotMatch'));
      announce(t('passwordsDoNotMatch'), 'assertive');
      return;
    }
    
    // Simulate password change process
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPasswordError('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Update last password change date
      updatePreferences({ lastPasswordChange: new Date().toISOString() });
      
      toast({
        title: t('passwordChanged'),
        description: t('passwordChangedSuccessfully'),
      });
      announce(t('passwordChangedSuccessfully'), 'polite');
    }, 1500);
  };
  
  const handleVerifyEmail = () => {
    if (!verificationCode) {
      setVerificationError(t('verificationCodeRequired'));
      announce(t('verificationCodeRequired'), 'assertive');
      return;
    }
    
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationError('');
      setVerificationCode('');
      
      toast({
        title: t('emailVerified'),
        description: t('emailVerifiedSuccessfully'),
      });
      announce(t('emailVerifiedSuccessfully'), 'polite');
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('securitySettings')}</CardTitle>
          <CardDescription>{t('manageSecurity')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="security-notifications">{t('securityNotifications')}</Label>
            <Switch
              id="security-notifications"
              checked={preferences.notifications && preferences.notifications.security ? true : false}
              onCheckedChange={(checked) => handleToggleNotification('security', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="price-notifications">{t('priceNotifications')}</Label>
            <Switch
              id="price-notifications"
              checked={preferences.notifications && preferences.notifications.price ? true : false}
              onCheckedChange={(checked) => handleToggleNotification('price', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="news-notifications">{t('newsNotifications')}</Label>
            <Switch
              id="news-notifications"
              checked={preferences.notifications && preferences.notifications.news ? true : false}
              onCheckedChange={(checked) => handleToggleNotification('news', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="portfolio-notifications">{t('portfolioNotifications')}</Label>
            <Switch
              id="portfolio-notifications"
              checked={preferences.notifications && preferences.notifications.portfolio ? true : false}
              onCheckedChange={(checked) => handleToggleNotification('portfolio', checked)}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('changePassword')}</CardTitle>
          <CardDescription>{t('updatePassword')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">{t('currentPassword')}</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={t('enterCurrentPassword')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">{t('newPassword')}</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('enterNewPassword')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t('confirmPassword')}</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('confirmNewPassword')}
            />
          </div>
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
          <Button onClick={handleChangePassword} disabled={isLoading}>
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            {t('changePassword')}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('emailVerification')}</CardTitle>
          <CardDescription>{t('verifyEmailDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code">{t('verificationCode')}</Label>
            <Input
              id="verification-code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder={t('enterVerificationCode')}
            />
          </div>
          {verificationError && (
            <p className="text-sm text-red-500">{verificationError}</p>
          )}
          <Button onClick={handleVerifyEmail} disabled={isVerifying}>
            {isVerifying && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            {t('verifyEmail')}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('accountActions')}</CardTitle>
          <CardDescription>{t('manageAccount')}</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">{t('deleteAccount')}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('areYouSure')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('deleteAccountWarning')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction>{t('delete')}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
