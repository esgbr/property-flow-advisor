
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, AlertTriangle, CheckCircle, Settings, Eye, EyeOff, Fingerprint } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppLock } from '@/contexts/AppLockContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SecurityDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { isLocked, lockApp, hasPIN, supportsFaceId } = useAppLock();
  const { preferences, updatePreferences } = useUserPreferences();
  const navigate = useNavigate();
  const [showSecurityTips, setShowSecurityTips] = useState(true);
  
  // Calculate security score
  const calculateSecurityScore = () => {
    let score = 0;
    
    // Basic account security
    if (preferences.email) score += 10;
    
    // Password strength (simplified)
    score += 20;
    
    // App lock
    if (hasPIN) score += 30;
    
    // Notifications for security
    if (preferences.notifications?.alerts) score += 10;
    
    // Biometric auth
    if (preferences.appLockMethod === 'biometric') score += 30;
    
    return Math.min(score, 100);
  };
  
  const securityScore = calculateSecurityScore();
  
  const getScoreColor = () => {
    if (securityScore >= 80) return 'bg-green-500';
    if (securityScore >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  const getScoreLabel = () => {
    if (securityScore >= 80) return language === 'de' ? 'Hoch' : 'High';
    if (securityScore >= 50) return language === 'de' ? 'Mittel' : 'Medium';
    return language === 'de' ? 'Niedrig' : 'Low';
  };
  
  const handleSetupAppLock = () => {
    navigate('/settings?tab=security&setup=true');
  };
  
  const handleLockApp = () => {
    if (lockApp) {
      lockApp();
      toast.success(language === 'de' ? 'App gesperrt' : 'App locked');
    }
  };
  
  const securityRecommendations = [
    {
      id: 'pin',
      title: language === 'de' ? 'App-Sperre einrichten' : 'Set up app lock',
      description: language === 'de' 
        ? 'Schützen Sie Ihre Daten mit einer PIN oder Biometrie' 
        : 'Protect your data with a PIN or biometrics',
      action: handleSetupAppLock,
      actionLabel: language === 'de' ? 'Einrichten' : 'Set up',
      isDone: hasPIN,
      icon: <Lock className="h-4 w-4" />
    },
    {
      id: 'biometric',
      title: language === 'de' ? 'Biometrische Authentifizierung' : 'Biometric authentication',
      description: language === 'de' 
        ? 'Verwenden Sie Ihren Fingerabdruck oder Gesicht für mehr Sicherheit' 
        : 'Use your fingerprint or face for enhanced security',
      action: handleSetupAppLock,
      actionLabel: language === 'de' ? 'Aktivieren' : 'Enable',
      isDone: preferences.appLockMethod === 'biometric',
      icon: <Fingerprint className="h-4 w-4" />,
      isAvailable: supportsFaceId
    },
    {
      id: 'alerts',
      title: language === 'de' ? 'Sicherheitswarnungen aktivieren' : 'Enable security alerts',
      description: language === 'de'
        ? 'Erhalten Sie Benachrichtigungen über verdächtige Aktivitäten' 
        : 'Get notified about suspicious activities',
      action: () => navigate('/settings?tab=notifications'),
      actionLabel: language === 'de' ? 'Aktivieren' : 'Enable',
      isDone: preferences.notifications?.alerts === true,
      icon: <AlertTriangle className="h-4 w-4" />
    }
  ].filter(item => item.isAvailable !== false);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="mr-2 h-7 w-7 text-primary" />
            {language === 'de' ? 'Sicherheitszentrale' : 'Security Center'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'de' 
              ? 'Überwachen und verbessern Sie Ihre Kontosicherheit' 
              : 'Monitor and enhance your account security'
            }
          </p>
        </div>
        
        {hasPIN && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLockApp}
            disabled={isLocked}
          >
            <Lock className="mr-2 h-4 w-4" />
            {language === 'de' ? 'App sperren' : 'Lock app'}
          </Button>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Security score */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('securityScore')}</CardTitle>
            <CardDescription>{t('securityScoreDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{securityScore}%</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="stroke-current text-muted"
                    fill="none"
                    strokeWidth="3"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    strokeDasharray="100, 100"
                  />
                  <path
                    className={`stroke-current ${getScoreColor()}`}
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    strokeDasharray={`${securityScore}, 100`}
                  />
                </svg>
              </div>
              <Badge variant={securityScore >= 80 ? "outline" : "secondary"}>
                {getScoreLabel()}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('securityStatus')}</CardTitle>
            <CardDescription>{t('currentSecuritySettings')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{t('appLock')}</span>
              </div>
              <Badge variant={hasPIN ? "default" : "outline"} className={hasPIN ? "bg-green-500" : ""}>
                {hasPIN ? t('enabled') : t('disabled')}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Fingerprint className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{t('biometricAuth')}</span>
              </div>
              <Badge variant={preferences.appLockMethod === 'biometric' ? "default" : "outline"} className={preferences.appLockMethod === 'biometric' ? "bg-green-500" : ""}>
                {preferences.appLockMethod === 'biometric' ? t('enabled') : t('disabled')}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{t('securityAlerts')}</span>
              </div>
              <Badge variant={preferences.notifications?.alerts ? "default" : "outline"} className={preferences.notifications?.alerts ? "bg-green-500" : ""}>
                {preferences.notifications?.alerts ? t('enabled') : t('disabled')}
              </Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate('/settings?tab=security')}
            >
              <Settings className="mr-2 h-4 w-4" />
              {t('securitySettings')}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Security tips */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg">{t('securityTips')}</CardTitle>
              <CardDescription>{t('securityTipsDescription')}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSecurityTips(!showSecurityTips)}
            >
              {showSecurityTips ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </CardHeader>
          {showSecurityTips && (
            <CardContent className="text-sm space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <p>{t('useStrongPassword')}</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <p>{t('enableTwoFactor')}</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <p>{t('regularlyUpdatePassword')}</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <p>{t('checkLoginHistory')}</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
      
      {/* Recommendations */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">{t('securityRecommendations')}</CardTitle>
          <CardDescription>{t('suggestedSecurityImprovements')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {securityRecommendations
            .filter(rec => !rec.isDone)
            .slice(0, 3)
            .map(recommendation => (
              <Alert key={recommendation.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <AlertTitle className="flex items-center">
                    {recommendation.icon}
                    <span className="ml-2">{recommendation.title}</span>
                  </AlertTitle>
                  <AlertDescription>
                    {recommendation.description}
                  </AlertDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 sm:mt-0"
                  onClick={recommendation.action}
                >
                  {recommendation.actionLabel}
                </Button>
              </Alert>
            ))}
            
          {securityRecommendations.filter(rec => !rec.isDone).length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium">{t('allSecurityRecommendationsComplete')}</h3>
              <p className="text-muted-foreground mt-1">
                {t('yourAccountIsWellProtected')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
