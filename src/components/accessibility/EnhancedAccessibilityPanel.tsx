
import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Accessibility, Check, Monitor, Sun, Moon, Contrast, Type, MousePointer, Globe, VolumeX, Volume2 } from 'lucide-react';
import { useAccessibility } from '@/hooks/use-accessibility';
import { useScreenReader } from '@/hooks/use-screen-reader';
import { cn } from '@/lib/utils';
import { useAppTheme } from '@/components/theme-provider';

interface EnhancedAccessibilityPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Enhanced accessibility panel with more options and better organization
 */
const EnhancedAccessibilityPanel: React.FC<EnhancedAccessibilityPanelProps> = ({
  open,
  onOpenChange
}) => {
  const { language } = useLanguage();
  const { isDarkMode, setTheme } = useAppTheme();
  const { announce } = useScreenReader();
  const { 
    largeText, 
    setLargeText,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    screenReader,
    setScreenReader,
    dyslexiaFriendly,
    setDyslexiaFriendly,
    cursorSize,
    setCursorSize
  } = useAccessibility();
  
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(largeText ? 2 : 1);
  const [contrastLevel, setContrastLevel] = useState<number>(highContrast ? 2 : 1);
  const [soundEffects, setSoundEffects] = useState<boolean>(false);
  
  // Update accessibility options when slider values change
  useEffect(() => {
    setLargeText(fontSizeLevel > 1);
  }, [fontSizeLevel, setLargeText]);
  
  useEffect(() => {
    setHighContrast(contrastLevel > 1);
  }, [contrastLevel, setHighContrast]);
  
  // Announce when panel is opened
  useEffect(() => {
    if (open) {
      announce(
        language === 'de'
          ? 'Barrierefreiheit-Panel geöffnet'
          : 'Accessibility panel opened',
        'polite'
      );
    }
  }, [open, announce, language]);
  
  // Handle theme changes
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setTheme(theme);
    
    announce(
      language === 'de'
        ? `Design auf ${theme === 'light' ? 'Hell' : theme === 'dark' ? 'Dunkel' : 'System'} geändert`
        : `Theme changed to ${theme}`,
      'polite'
    );
  };
  
  // Apply font size changes
  const getFontSizeLabel = () => {
    switch (fontSizeLevel) {
      case 1: return language === 'de' ? 'Normal' : 'Normal';
      case 2: return language === 'de' ? 'Mittel' : 'Medium';
      case 3: return language === 'de' ? 'Groß' : 'Large';
      default: return language === 'de' ? 'Normal' : 'Normal';
    }
  };
  
  // Apply contrast level changes
  const getContrastLabel = () => {
    switch (contrastLevel) {
      case 1: return language === 'de' ? 'Standard' : 'Standard';
      case 2: return language === 'de' ? 'Hoch' : 'High';
      case 3: return language === 'de' ? 'Sehr hoch' : 'Very high';
      default: return language === 'de' ? 'Standard' : 'Standard';
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            {language === 'de' ? 'Barrierefreiheit' : 'Accessibility'}
          </SheetTitle>
          <SheetDescription>
            {language === 'de'
              ? 'Passen Sie die Einstellungen an, um die Barrierefreiheit zu verbessern'
              : 'Adjust settings to improve accessibility'}
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="display">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="display">
              <Monitor className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Anzeige' : 'Display'}
            </TabsTrigger>
            <TabsTrigger value="content">
              <Type className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Inhalt' : 'Content'}
            </TabsTrigger>
            <TabsTrigger value="interaction">
              <MousePointer className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Interaktion' : 'Interaction'}
            </TabsTrigger>
          </TabsList>
          
          {/* Display Tab */}
          <TabsContent value="display" className="space-y-6">
            {/* Theme Selection */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                {language === 'de' ? 'Farbschema' : 'Color Theme'}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={isDarkMode === false ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange('light')}
                  className="w-full"
                >
                  <Sun className="h-4 w-4 mr-2" />
                  {language === 'de' ? 'Hell' : 'Light'}
                </Button>
                <Button
                  variant={isDarkMode === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange('dark')}
                  className="w-full"
                >
                  <Moon className="h-4 w-4 mr-2" />
                  {language === 'de' ? 'Dunkel' : 'Dark'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleThemeChange('system')}
                  className="w-full"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  {language === 'de' ? 'System' : 'System'}
                </Button>
              </div>
            </div>
            
            {/* Font Size */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>
                  {language === 'de' ? 'Textgröße' : 'Text Size'}
                </Label>
                <span className="text-sm">{getFontSizeLabel()}</span>
              </div>
              <Slider
                min={1}
                max={3}
                step={1}
                value={[fontSizeLevel]}
                onValueChange={(values) => setFontSizeLevel(values[0])}
              />
            </div>
            
            {/* Contrast */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="flex items-center">
                  <Contrast className="h-4 w-4 mr-2" />
                  {language === 'de' ? 'Kontrast' : 'Contrast'}
                </Label>
                <span className="text-sm">{getContrastLabel()}</span>
              </div>
              <Slider
                min={1}
                max={3}
                step={1}
                value={[contrastLevel]}
                onValueChange={(values) => setContrastLevel(values[0])}
              />
            </div>
            
            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2">
                {language === 'de' ? 'Bewegungen reduzieren' : 'Reduce Motion'}
              </Label>
              <Switch
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
              />
            </div>
          </TabsContent>
          
          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            {/* Dyslexia Friendly */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  {language === 'de' ? 'Legasthenie-freundlich' : 'Dyslexia Friendly'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {language === 'de'
                    ? 'Spezielle Schriftart und Textabstand für bessere Lesbarkeit'
                    : 'Special font and text spacing for better readability'
                  }
                </p>
              </div>
              <Switch
                checked={dyslexiaFriendly}
                onCheckedChange={setDyslexiaFriendly}
              />
            </div>
            
            {/* Screen Reader Support */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  {language === 'de' ? 'Bildschirmleser-Unterstützung' : 'Screen Reader Support'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {language === 'de'
                    ? 'Verbesserte Hinweise für Bildschirmleser'
                    : 'Enhanced cues for screen readers'
                  }
                </p>
              </div>
              <Switch
                checked={screenReader}
                onCheckedChange={setScreenReader}
              />
            </div>
            
            {/* Language */}
            <div className="space-y-2">
              <Label className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                {language === 'de' ? 'Sprache' : 'Language'}
              </Label>
              <RadioGroup defaultValue={language} className="grid grid-cols-2 gap-2">
                <div>
                  <RadioGroupItem
                    value="en"
                    id="language-en"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="language-en"
                    className={cn(
                      "flex items-center justify-center border rounded-md p-2",
                      "cursor-pointer hover:bg-muted peer-data-[state=checked]:border-primary",
                      "peer-data-[state=checked]:bg-primary/10"
                    )}
                  >
                    {language === "en" && (
                      <Check className="h-4 w-4 mr-2 text-primary" />
                    )}
                    English
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="de"
                    id="language-de"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="language-de"
                    className={cn(
                      "flex items-center justify-center border rounded-md p-2",
                      "cursor-pointer hover:bg-muted peer-data-[state=checked]:border-primary",
                      "peer-data-[state=checked]:bg-primary/10"
                    )}
                  >
                    {language === "de" && (
                      <Check className="h-4 w-4 mr-2 text-primary" />
                    )}
                    Deutsch
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Sound Effects */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  {soundEffects ? (
                    <Volume2 className="h-4 w-4 mr-2" />
                  ) : (
                    <VolumeX className="h-4 w-4 mr-2" />
                  )}
                  {language === 'de' ? 'Soundeffekte' : 'Sound Effects'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {language === 'de'
                    ? 'Auditive Rückmeldungen bei Interaktionen'
                    : 'Audio feedback for interactions'
                  }
                </p>
              </div>
              <Switch
                checked={soundEffects}
                onCheckedChange={setSoundEffects}
              />
            </div>
          </TabsContent>
          
          {/* Interaction Tab */}
          <TabsContent value="interaction" className="space-y-6">
            {/* Cursor Size */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>
                  {language === 'de' ? 'Cursor-Größe' : 'Cursor Size'}
                </Label>
                <span className="text-sm">
                  {cursorSize === 'normal'
                    ? (language === 'de' ? 'Normal' : 'Normal')
                    : cursorSize === 'large'
                    ? (language === 'de' ? 'Groß' : 'Large')
                    : (language === 'de' ? 'Sehr groß' : 'Extra Large')
                  }
                </span>
              </div>
              
              <RadioGroup 
                value={cursorSize} 
                onValueChange={(value) => setCursorSize(value as 'normal' | 'large' | 'x-large')}
              >
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <RadioGroupItem
                      value="normal"
                      id="cursor-normal"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="cursor-normal"
                      className={cn(
                        "flex flex-col items-center justify-center rounded-md border-2 p-2",
                        "hover:bg-muted peer-data-[state=checked]:border-primary",
                        "cursor-pointer peer-focus:ring-2 peer-focus:ring-primary"
                      )}
                    >
                      <span className="text-xs">•</span>
                      <span className="text-xs mt-1">
                        {language === 'de' ? 'Normal' : 'Normal'}
                      </span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem
                      value="large"
                      id="cursor-large"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="cursor-large"
                      className={cn(
                        "flex flex-col items-center justify-center rounded-md border-2 p-2",
                        "hover:bg-muted peer-data-[state=checked]:border-primary",
                        "cursor-pointer peer-focus:ring-2 peer-focus:ring-primary"
                      )}
                    >
                      <span className="text-lg">•</span>
                      <span className="text-xs mt-1">
                        {language === 'de' ? 'Groß' : 'Large'}
                      </span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem
                      value="x-large"
                      id="cursor-x-large"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="cursor-x-large"
                      className={cn(
                        "flex flex-col items-center justify-center rounded-md border-2 p-2",
                        "hover:bg-muted peer-data-[state=checked]:border-primary",
                        "cursor-pointer peer-focus:ring-2 peer-focus:ring-primary"
                      )}
                    >
                      <span className="text-2xl">•</span>
                      <span className="text-xs mt-1">
                        {language === 'de' ? 'Sehr groß' : 'X-Large'}
                      </span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            {/* Keyboard Navigation */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>
                  {language === 'de' ? 'Verbesserte Tastaturnavigation' : 'Enhanced Keyboard Navigation'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {language === 'de'
                    ? 'Bessere Sichtbarkeit des Fokus bei Tastaturnavigation'
                    : 'Better focus visibility during keyboard navigation'
                  }
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-xs text-muted-foreground border-t pt-6">
          <p>
            {language === 'de'
              ? 'Wir arbeiten kontinuierlich daran, die Barrierefreiheit unserer Anwendung zu verbessern. Wenn Sie Vorschläge haben, kontaktieren Sie uns bitte.'
              : 'We are continuously working to improve the accessibility of our application. If you have suggestions, please contact us.'
            }
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EnhancedAccessibilityPanel;
