
import { useState, useCallback, useEffect } from 'react';
import { useAppLock } from '@/contexts/AppLockContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export interface SecurityScore {
  score: number;
  level: 'low' | 'medium' | 'high';
  recommendations: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    action?: () => void;
  }[];
}

export function useSecurity() {
  const { hasPIN, supportsFaceId, isBiometricEnabled } = useAppLock();
  const { preferences } = useUserPreferences();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  const [securityScore, setSecurityScore] = useState<SecurityScore>({
    score: 0,
    level: 'low',
    recommendations: []
  });

  // Calculate security score based on various factors
  const calculateSecurityScore = useCallback(() => {
    let score = 0;
    
    // Basic account security
    if (preferences.email) score += 10;
    
    // Password strength (simplified)
    score += 20;
    
    // App lock
    if (hasPIN) score += 30;
    
    // Biometric auth
    if (preferences.appLockMethod === 'biometric') score += 30;
    
    // Notifications for security
    if (preferences.notifications?.security) score += 10;
    
    // Determine security level
    let level: 'low' | 'medium' | 'high' = 'low';
    if (score >= 80) level = 'high';
    else if (score >= 50) level = 'medium';
    
    return {
      score: Math.min(score, 100),
      level
    };
  }, [hasPIN, preferences]);

  // Generate security recommendations
  const generateRecommendations = useCallback(() => {
    const recommendations = [];
    
    // PIN recommendation
    if (!hasPIN) {
      recommendations.push({
        id: 'pin',
        title: language === 'de' ? 'PIN einrichten' : 'Set up PIN',
        description: language === 'de' 
          ? 'Schützen Sie Ihre App mit einer PIN' 
          : 'Secure your app with a PIN',
        completed: false
      });
    }
    
    // Biometrics recommendation
    if (hasPIN && supportsFaceId && !isBiometricEnabled) {
      recommendations.push({
        id: 'biometric',
        title: language === 'de' ? 'Biometrie aktivieren' : 'Enable biometrics',
        description: language === 'de' 
          ? 'Verbessern Sie die Sicherheit mit biometrischer Authentifizierung' 
          : 'Enhance security with biometric authentication',
        completed: false
      });
    }
    
    // Notifications recommendation
    if (!preferences.notifications?.security) {
      recommendations.push({
        id: 'alerts',
        title: language === 'de' ? 'Sicherheitsbenachrichtigungen aktivieren' : 'Enable security alerts',
        description: language === 'de'
          ? 'Erhalten Sie Benachrichtigungen über verdächtige Aktivitäten'
          : 'Get notified about suspicious activities',
        completed: false
      });
    }
    
    return recommendations;
  }, [hasPIN, supportsFaceId, isBiometricEnabled, preferences.notifications?.security, language]);

  // Update score and recommendations when dependencies change
  useEffect(() => {
    const { score, level } = calculateSecurityScore();
    const recommendations = generateRecommendations();
    
    setSecurityScore({
      score,
      level,
      recommendations
    });
  }, [calculateSecurityScore, generateRecommendations]);

  // Check if there was potentially suspicious activity
  const checkSuspiciousActivity = useCallback(() => {
    // This is a simplified example - in a real app, you'd have more sophisticated checks
    const lastLogin = preferences.lastActive ? new Date(preferences.lastActive) : null;
    const now = new Date();
    
    if (lastLogin && (now.getTime() - lastLogin.getTime() > 7 * 24 * 60 * 60 * 1000)) {
      // It's been over a week since last login
      toast({
        title: t('securityAlert'),
        description: t('unusualLoginTime'),
        variant: 'destructive',
      });
      return true;
    }
    
    return false;
  }, [preferences.lastActive, t, toast]);

  return {
    securityScore,
    checkSuspiciousActivity
  };
}

export default useSecurity;
