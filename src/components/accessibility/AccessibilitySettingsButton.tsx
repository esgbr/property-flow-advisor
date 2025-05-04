
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from './A11yProvider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

interface AccessibilitySettingsButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'secondary' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const AccessibilitySettingsButton: React.FC<AccessibilitySettingsButtonProps> = ({
  variant = 'outline',
  size = 'icon',
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { reduceMotion, highContrast, largeText, screenReader } = useAccessibility();
  
  // Count active accessibility settings to show badge
  const activeSettings = [reduceMotion, highContrast, largeText, screenReader].filter(Boolean).length;
  
  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate('/accessibility');
    }
  };

  // Get descriptive text for active settings
  const getActiveSettingsDescription = (): string => {
    if (activeSettings === 0) return '';
    
    const activeFeatures = [];
    if (reduceMotion) activeFeatures.push('reduced motion');
    if (highContrast) activeFeatures.push('high contrast');
    if (largeText) activeFeatures.push('large text');
    if (screenReader) activeFeatures.push('screen reader optimizations');
    
    return `Active features: ${activeFeatures.join(', ')}`;
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={() => navigate('/accessibility')}
            onKeyDown={handleKeyDown}
            className={`relative hover:scale-105 transition-transform ${highContrast ? 'border-2' : ''}`}
            aria-label={t('accessibilitySettings') || 'Accessibility Settings'}
            data-testid="accessibility-settings-button"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
            {activeSettings > 0 && (
              <span 
                className={`absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center ${highContrast ? 'border border-background' : ''}`}
                aria-label={`${activeSettings} active accessibility features`}
                title={getActiveSettingsDescription()}
              >
                {activeSettings}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className={highContrast ? 'border-2' : ''}>
          <p>{t('accessibilitySettings') || 'Accessibility Settings'}</p>
          {activeSettings > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {getActiveSettingsDescription()}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AccessibilitySettingsButton;
