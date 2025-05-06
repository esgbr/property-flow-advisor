
import React from 'react';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useAppLock } from '@/contexts/AppLockContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SecurityStatusProps {
  showDetails?: boolean;
  showActions?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SecurityStatus: React.FC<SecurityStatusProps> = ({
  showDetails = true,
  showActions = true,
  size = 'md',
  className
}) => {
  const { t, language } = useLanguage();
  const { hasPIN } = useAppLock();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();
  
  // Calculate security score
  const calculateSecurityScore = () => {
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
    if (preferences.notifications?.alerts) score += 10;
    
    return Math.min(score, 100);
  };
  
  const securityScore = calculateSecurityScore();
  
  const getScoreColor = () => {
    if (securityScore >= 80) return 'text-green-500';
    if (securityScore >= 50) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const getScoreLabel = () => {
    if (securityScore >= 80) return language === 'de' ? 'Hoch' : 'High';
    if (securityScore >= 50) return language === 'de' ? 'Mittel' : 'Medium';
    return language === 'de' ? 'Niedrig' : 'Low';
  };
  
  const getScoreBackground = () => {
    if (securityScore >= 80) return 'bg-green-500';
    if (securityScore >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getIcon = () => {
    if (securityScore >= 80) {
      return <ShieldCheck className={cn("text-green-500", 
        size === 'sm' ? 'h-4 w-4' : 
        size === 'md' ? 'h-5 w-5' : 
        'h-6 w-6')} />;
    }
    if (securityScore >= 50) {
      return <Shield className={cn("text-amber-500", 
        size === 'sm' ? 'h-4 w-4' : 
        size === 'md' ? 'h-5 w-5' : 
        'h-6 w-6')} />;
    }
    return <ShieldAlert className={cn("text-red-500", 
      size === 'sm' ? 'h-4 w-4' : 
      size === 'md' ? 'h-5 w-5' : 
      'h-6 w-6')} />;
  };
  
  const handleImprove = () => {
    navigate('/security');
  };
  
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-2">
        {getIcon()}
        <div className={cn("font-medium", 
          size === 'sm' ? 'text-sm' : 
          size === 'md' ? 'text-base' : 
          'text-lg'
        )}>
          {t('securityStatus')}:&nbsp;
          <span className={getScoreColor()}>{getScoreLabel()}</span>
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-2 space-y-1">
          <Progress value={securityScore} className="h-1.5" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{securityScore}%</span>
            <span>{language === 'de' ? 'Sicherheitsbewertung' : 'Security rating'}</span>
          </div>
        </div>
      )}
      
      {showActions && securityScore < 80 && (
        <Button 
          size="sm" 
          variant="outline" 
          className="mt-3" 
          onClick={handleImprove}
        >
          <Shield className="mr-2 h-4 w-4" />
          {t('improveSecurity')}
        </Button>
      )}
    </div>
  );
};

export default SecurityStatus;
