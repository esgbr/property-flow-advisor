
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useAccessibility } from '@/hooks/use-accessibility';
import { Settings, Eye, Type, MousePointer, VolumeX, Contrast, Mic } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AccessibilityPanelProps {
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ 
  children, 
  variant = 'outline',
  size = 'default'
}) => {
  const {
    highContrast,
    toggleHighContrast,
    largeText,
    toggleLargeText,
    reduceMotion,
    toggleReduceMotion,
    screenReader,
    toggleScreenReader,
    announce
  } = useAccessibility();
  const { language } = useLanguage();

  const handleTextSizeChange = (value: number[]) => {
    // Using a slider value to adjust text size (1 = normal, 2 = large, 3 = very large)
    toggleLargeText();
    announce(language === 'de' 
      ? `Textgröße auf ${value[0] === 1 ? 'normal' : value[0] === 2 ? 'groß' : 'sehr groß'} eingestellt`
      : `Text size set to ${value[0] === 1 ? 'normal' : value[0] === 2 ? 'large' : 'very large'}`
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant={variant} size={size}>
            <Settings className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Barrierefreiheit' : 'Accessibility'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {language === 'de' ? 'Barrierefreiheit-Einstellungen' : 'Accessibility Settings'}
          </DialogTitle>
          <DialogDescription>
            {language === 'de' 
              ? 'Passen Sie die Einstellungen für eine bessere Nutzung an.'
              : 'Customize settings for a better user experience.'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Contrast className="h-4 w-4" />
              <Label htmlFor="high-contrast">
                {language === 'de' ? 'Hoher Kontrast' : 'High contrast'}
              </Label>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={toggleHighContrast}
              aria-label={language === 'de' ? 'Hohen Kontrast aktivieren' : 'Enable high contrast'}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Type className="h-4 w-4" />
              <Label>
                {language === 'de' ? 'Textgröße' : 'Text size'}
              </Label>
            </div>
            <div className="px-1">
              <Slider
                defaultValue={[largeText ? 2 : 1]}
                max={3}
                min={1}
                step={1}
                onValueChange={handleTextSizeChange}
                className="my-4"
                aria-label={language === 'de' ? 'Textgröße einstellen' : 'Adjust text size'}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>A</span>
                <span className="text-base">A</span>
                <span className="text-lg">A</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MousePointer className="h-4 w-4" />
              <Label htmlFor="reduce-motion">
                {language === 'de' ? 'Bewegungen reduzieren' : 'Reduce motion'}
              </Label>
            </div>
            <Switch
              id="reduce-motion"
              checked={reduceMotion}
              onCheckedChange={toggleReduceMotion}
              aria-label={language === 'de' ? 'Bewegungen reduzieren' : 'Reduce motion'}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <Label htmlFor="screen-reader">
                {language === 'de' ? 'Bildschirmleser optimieren' : 'Optimize for screen readers'}
              </Label>
            </div>
            <Switch
              id="screen-reader"
              checked={screenReader}
              onCheckedChange={toggleScreenReader}
              aria-label={language === 'de' ? 'Für Bildschirmleser optimieren' : 'Optimize for screen readers'}
            />
          </div>
          
          <div className="rounded-md bg-muted p-4">
            <div className="flex items-start">
              <Mic className="h-5 w-5 mr-2 mt-0.5 text-primary" />
              <div>
                <h4 className="text-sm font-medium mb-1">
                  {language === 'de' ? 'Sprachassistent' : 'Voice Assistant'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' 
                    ? 'Die Sprachsteuerung ist in der Beta-Version verfügbar.'
                    : 'Voice control is available in beta version.'
                  }
                </p>
                <Button variant="secondary" size="sm" className="mt-2" onClick={() => 
                  announce(language === 'de' 
                    ? 'Sprachassistent wird geladen, bitte warten Sie einen Moment.'
                    : 'Voice assistant is loading, please wait a moment.'
                  )
                }>
                  {language === 'de' ? 'Aktivieren' : 'Activate'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessibilityPanel;
