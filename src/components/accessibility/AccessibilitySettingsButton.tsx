
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from './A11yProvider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAnnouncement } from '@/utils/accessibilityUtils';

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
  const { announce } = useAnnouncement();
  const [isFocused, setIsFocused] = useState(false);
  
  // Count active accessibility settings to show badge
  const activeSettings = [reduceMotion, highContrast, largeText, screenReader].filter(Boolean).length;
  
  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate('/accessibility');
      announce('Navigating to accessibility settings', false);
    }
  };
  
  // Handle button activation
  const handleClick = () => {
    navigate('/accessibility');
    announce('Navigating to accessibility settings', false);
  };

  // Get descriptive text for active settings
  const getActiveSettingsDescription = (): string => {
    if (activeSettings === 0) return t('accessibilitySettings') || 'Accessibility Settings';
    
    const activeFeatures = [];
    if (reduceMotion) activeFeatures.push('reduced motion');
    if (highContrast) activeFeatures.push('high contrast');
    if (largeText) activeFeatures.push('large text');
    if (screenReader) activeFeatures.push('screen reader optimizations');
    
    return `${t('accessibilitySettings') || 'Accessibility Settings'}: ${activeFeatures.join(', ')}`;
  };
  
  // Icon selection based on active features
  const getIcon = () => {
    return screenReader ? <Eye className={`h-5 w-5 ${activeSettings > 0 ? 'text-primary' : ''}`} /> :
           <Settings className={`h-5 w-5 ${activeSettings > 0 ? 'text-primary' : ''}`} />;
  };
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`relative hover:scale-105 transition-transform hover:bg-primary/10 
              ${highContrast ? 'border-2' : ''} 
              ${activeSettings > 0 ? 'ring-1 ring-primary' : ''}
              ${screenReader ? 'bg-primary/5' : ''}
              ${isFocused ? 'ring-2 ring-primary ring-offset-2' : ''}
            `}
            aria-label={getActiveSettingsDescription()}
            data-testid="accessibility-settings-button"
          >
            {getIcon()}
            {activeSettings > 0 && (
              <span 
                className={`absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center ${highContrast ? 'border border-background' : ''}`}
                aria-hidden="true"
                title={getActiveSettingsDescription()}
              >
                {activeSettings}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className={`${highContrast ? 'border-2' : ''} max-w-[250px] ${largeText ? 'text-base p-3' : ''}`}
        >
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
