
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, Type, Zap, Cpu } from 'lucide-react';
import { useAccessibility } from '@/hooks/use-accessibility';
import { useLanguage } from '@/contexts/LanguageContext';

export interface EnhancedAccessibilityPanelProps {
  className?: string;
}

const EnhancedAccessibilityPanel: React.FC<EnhancedAccessibilityPanelProps> = ({ className = '' }) => {
  const { language } = useLanguage();
  const { 
    highContrast, 
    largeText, 
    reduceMotion,
    dyslexiaFriendly,
    toggleHighContrast, 
    toggleLargeText, 
    toggleReduceMotion,
    toggleDyslexiaFriendly,
    announce 
  } = useAccessibility();

  const handleResetSettings = () => {
    if (highContrast) toggleHighContrast();
    if (largeText) toggleLargeText();
    if (reduceMotion) toggleReduceMotion();
    if (dyslexiaFriendly) toggleDyslexiaFriendly();
    
    announce(
      language === 'de' 
        ? 'Barrierefreiheitseinstellungen zurückgesetzt' 
        : 'Accessibility settings reset', 
      'polite'
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="mr-2 h-5 w-5" />
          {language === 'de' ? 'Barrierefreiheit' : 'Accessibility'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <Label htmlFor="high-contrast" className="cursor-pointer">
              {language === 'de' ? 'Hoher Kontrast' : 'High Contrast'}
            </Label>
          </div>
          <Switch 
            id="high-contrast" 
            checked={highContrast} 
            onCheckedChange={toggleHighContrast}
            aria-label={language === 'de' ? 'Hoher Kontrast' : 'High Contrast'}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-primary" />
            <Label htmlFor="large-text" className="cursor-pointer">
              {language === 'de' ? 'Große Schrift' : 'Large Text'}
            </Label>
          </div>
          <Switch 
            id="large-text" 
            checked={largeText} 
            onCheckedChange={toggleLargeText}
            aria-label={language === 'de' ? 'Große Schrift' : 'Large Text'}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            <Label htmlFor="reduced-motion" className="cursor-pointer">
              {language === 'de' ? 'Reduzierte Bewegung' : 'Reduced Motion'}
            </Label>
          </div>
          <Switch 
            id="reduced-motion" 
            checked={reduceMotion} 
            onCheckedChange={toggleReduceMotion}
            aria-label={language === 'de' ? 'Reduzierte Bewegung' : 'Reduced Motion'}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-primary" />
            <Label htmlFor="dyslexia-friendly" className="cursor-pointer">
              {language === 'de' ? 'Legasthenie-freundlich' : 'Dyslexia Friendly'}
            </Label>
          </div>
          <Switch 
            id="dyslexia-friendly" 
            checked={dyslexiaFriendly} 
            onCheckedChange={toggleDyslexiaFriendly}
            aria-label={language === 'de' ? 'Legasthenie-freundlich' : 'Dyslexia Friendly'}
          />
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4" 
          onClick={handleResetSettings}
          aria-label={language === 'de' ? 'Einstellungen zurücksetzen' : 'Reset settings'}
        >
          {language === 'de' ? 'Zurücksetzen' : 'Reset to Defaults'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedAccessibilityPanel;
