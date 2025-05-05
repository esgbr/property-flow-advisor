
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Monitor, Eye, Palette, ZoomIn, RotateCcw } from 'lucide-react';
import { useAccessibility } from './A11yProvider';
import { toast } from 'sonner';
import { useAnnouncement } from '@/utils/announcer';

interface AccessibilitySectionProps {
  className?: string;
}

const AccessibilitySection: React.FC<AccessibilitySectionProps> = ({ className }) => {
  const { 
    reduceMotion, 
    highContrast, 
    largeText, 
    screenReader,
    toggleReduceMotion,
    toggleHighContrast,
    toggleLargeText, 
    toggleScreenReader,
    resetAllSettings,
    applySystemSettings
  } = useAccessibility();
  
  const { announce } = useAnnouncement();
  
  const handleResetSettings = () => {
    resetAllSettings();
    toast.success('Accessibility settings reset to defaults');
    announce('Accessibility settings reset to defaults', true);
  };
  
  const handleApplySystemSettings = () => {
    applySystemSettings();
    toast.success('Applied system accessibility settings');
    announce('Applied system accessibility settings', true);
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Accessibility Settings</CardTitle>
        <CardDescription>
          Customize your experience to make the application more accessible
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full bg-primary/10">
              <RotateCcw className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Reduce Motion</p>
              <p className="text-sm text-muted-foreground">
                Minimize animations and motion effects
              </p>
            </div>
          </div>
          <Switch 
            checked={reduceMotion} 
            onCheckedChange={toggleReduceMotion} 
            aria-label="Toggle reduce motion"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">High Contrast</p>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
          </div>
          <Switch 
            checked={highContrast} 
            onCheckedChange={toggleHighContrast} 
            aria-label="Toggle high contrast"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full bg-primary/10">
              <ZoomIn className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Large Text</p>
              <p className="text-sm text-muted-foreground">
                Increase text size throughout the application
              </p>
            </div>
          </div>
          <Switch 
            checked={largeText} 
            onCheckedChange={toggleLargeText} 
            aria-label="Toggle large text"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Screen Reader Optimizations</p>
              <p className="text-sm text-muted-foreground">
                Additional optimizations for screen readers
              </p>
            </div>
          </div>
          <Switch 
            checked={screenReader} 
            onCheckedChange={toggleScreenReader} 
            aria-label="Toggle screen reader optimizations"
          />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-between">
        <Button 
          variant="outline" 
          onClick={handleResetSettings}
          className="flex-1"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
        <Button 
          variant="outline" 
          onClick={handleApplySystemSettings}
          className="flex-1"
        >
          <Monitor className="mr-2 h-4 w-4" />
          Use System Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccessibilitySection;
