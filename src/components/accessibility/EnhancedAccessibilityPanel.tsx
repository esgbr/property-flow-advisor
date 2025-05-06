
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Settings, Type, EyeOff, MousePointer, Ear, Keyboard } from 'lucide-react';
import { useAccessibility } from '@/hooks/use-accessibility';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import useAnnouncement from '@/utils/announcer';

/**
 * Enhanced accessibility panel with additional settings
 * Provides settings for visual, motor, and cognitive accessibility
 */
const EnhancedAccessibilityPanel: React.FC = () => {
  const { language } = useLanguage();
  const {
    highContrast,
    largeText,
    reducedMotion,
    dyslexiaFriendly,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    toggleDyslexiaFriendly
  } = useAccessibility();
  const { announce } = useAnnouncement();
  
  const [isOpen, setIsOpen] = React.useState(false);
  const [cursorSize, setCursorSize] = React.useState(1);
  const [focusIndicator, setFocusIndicator] = React.useState<'default' | 'enhanced' | 'high'>('default');
  
  // Announce when panel is opened
  useEffect(() => {
    if (isOpen) {
      announce(
        language === 'de'
          ? 'Barrierefreiheitseinstellungen geöffnet'
          : 'Accessibility settings opened',
        'polite'
      );
    }
  }, [isOpen, announce, language]);
  
  // Apply cursor size
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    if (cursorSize > 1) {
      htmlElement.style.setProperty('--cursor-scale', cursorSize.toString());
      document.body.classList.add('custom-cursor');
    } else {
      htmlElement.style.removeProperty('--cursor-scale');
      document.body.classList.remove('custom-cursor');
    }
  }, [cursorSize]);
  
  // Apply focus indicator style
  useEffect(() => {
    const body = document.body;
    body.classList.remove('focus-default', 'focus-enhanced', 'focus-high');
    
    if (focusIndicator === 'enhanced') {
      body.classList.add('focus-enhanced');
    } else if (focusIndicator === 'high') {
      body.classList.add('focus-high');
    } else {
      body.classList.add('focus-default');
    }
  }, [focusIndicator]);
  
  // Handle focus indicator change
  const handleFocusIndicatorChange = (value: string) => {
    setFocusIndicator(value as 'default' | 'enhanced' | 'high');
    
    announce(
      language === 'de'
        ? `Fokusindikator auf ${value === 'default' ? 'Standard' : value === 'enhanced' ? 'Verbessert' : 'Hoch'} gesetzt`
        : `Focus indicator set to ${value}`,
      'polite'
    );
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label={language === 'de' ? 'Barrierefreiheitseinstellungen' : 'Accessibility settings'}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:max-w-none">
        <SheetHeader>
          <SheetTitle>
            {language === 'de' ? 'Barrierefreiheitseinstellungen' : 'Accessibility Settings'}
          </SheetTitle>
          <SheetDescription>
            {language === 'de' 
              ? 'Passen Sie die Einstellungen an Ihre Bedürfnisse an' 
              : 'Customize settings to meet your needs'}
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="visual" className="mt-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="visual" className="flex flex-col items-center py-2">
              <EyeOff className="h-4 w-4 mb-1" />
              <span className="text-xs">
                {language === 'de' ? 'Visuell' : 'Visual'}
              </span>
            </TabsTrigger>
            <TabsTrigger value="motor" className="flex flex-col items-center py-2">
              <MousePointer className="h-4 w-4 mb-1" />
              <span className="text-xs">
                {language === 'de' ? 'Motorik' : 'Motor'}
              </span>
            </TabsTrigger>
            <TabsTrigger value="cognitive" className="flex flex-col items-center py-2">
              <Type className="h-4 w-4 mb-1" />
              <span className="text-xs">
                {language === 'de' ? 'Kognitiv' : 'Cognitive'}
              </span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex flex-col items-center py-2">
              <Ear className="h-4 w-4 mb-1" />
              <span className="text-xs">
                {language === 'de' ? 'Audio' : 'Audio'}
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-contrast" className="text-base">
                    {language === 'de' ? 'Hoher Kontrast' : 'High Contrast'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de' 
                      ? 'Erhöht den Kontrast für bessere Sichtbarkeit' 
                      : 'Increases contrast for better visibility'}
                  </p>
                </div>
                <Switch 
                  id="high-contrast" 
                  checked={highContrast} 
                  onCheckedChange={toggleHighContrast} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="large-text" className="text-base">
                    {language === 'de' ? 'Große Schrift' : 'Large Text'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de' 
                      ? 'Vergrößert die Schrift für bessere Lesbarkeit' 
                      : 'Makes text larger for better readability'}
                  </p>
                </div>
                <Switch 
                  id="large-text" 
                  checked={largeText} 
                  onCheckedChange={toggleLargeText} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reduced-motion" className="text-base">
                    {language === 'de' ? 'Reduzierte Bewegung' : 'Reduced Motion'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de' 
                      ? 'Reduziert Animationen und Bewegungen' 
                      : 'Reduces animations and motion effects'}
                  </p>
                </div>
                <Switch 
                  id="reduced-motion" 
                  checked={reducedMotion} 
                  onCheckedChange={toggleReducedMotion} 
                />
              </div>
              
              <div>
                <Label className="text-base mb-2 block">
                  {language === 'de' ? 'Fokusindikator' : 'Focus Indicator'}
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  {language === 'de' 
                    ? 'Legt fest, wie deutlich der Fokus angezeigt wird' 
                    : 'Sets how prominently focus is displayed'}
                </p>
                <Select 
                  value={focusIndicator} 
                  onValueChange={handleFocusIndicatorChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">
                      {language === 'de' ? 'Standard' : 'Default'}
                    </SelectItem>
                    <SelectItem value="enhanced">
                      {language === 'de' ? 'Verbessert' : 'Enhanced'}
                    </SelectItem>
                    <SelectItem value="high">
                      {language === 'de' ? 'Stark' : 'High Visibility'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="motor" className="space-y-4">
            <div>
              <Label className="text-base mb-2 block">
                {language === 'de' ? 'Mauszeigergrӧße' : 'Cursor Size'}
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                {language === 'de' 
                  ? 'Stellen Sie die Größe des Mauszeigers ein' 
                  : 'Adjust the size of the cursor'}
              </p>
              <div className="flex gap-4 items-center">
                <Slider
                  min={1}
                  max={3}
                  step={0.5}
                  value={[cursorSize]}
                  onValueChange={([value]) => setCursorSize(value)}
                  className="flex-1"
                />
                <span className="w-10 text-center">
                  {cursorSize}x
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div>
                <Label htmlFor="keyboard-nav" className="text-base">
                  {language === 'de' ? 'Tastaturnavigation' : 'Keyboard Navigation'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' 
                    ? 'Verbesserte Tastaturnavigation' 
                    : 'Enhanced keyboard navigation'}
                </p>
              </div>
              <Switch id="keyboard-nav" />
            </div>
            
            <div className="pt-4">
              <Button variant="secondary" className="w-full" disabled>
                <Keyboard className="h-4 w-4 mr-2" />
                {language === 'de' ? 'Tastaturkürzel anpassen' : 'Customize Keyboard Shortcuts'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="cognitive" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dyslexia-friendly" className="text-base">
                  {language === 'de' ? 'Legasthenie-freundlich' : 'Dyslexia-friendly'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' 
                    ? 'Optimiert Schrift und Layout für Lesefreundlichkeit' 
                    : 'Optimizes font and layout for readability'}
                </p>
              </div>
              <Switch 
                id="dyslexia-friendly" 
                checked={dyslexiaFriendly} 
                onCheckedChange={toggleDyslexiaFriendly} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="plain-language" className="text-base">
                  {language === 'de' ? 'Einfache Sprache' : 'Plain Language'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' 
                    ? 'Vereinfacht komplexe Texte (wenn verfügbar)' 
                    : 'Simplifies complex text (when available)'}
                </p>
              </div>
              <Switch id="plain-language" disabled />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reduce-distractions" className="text-base">
                  {language === 'de' ? 'Ablenkungen reduzieren' : 'Reduce Distractions'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' 
                    ? 'Vereinfacht die Benutzeroberfläche' 
                    : 'Simplifies the interface'}
                </p>
              </div>
              <Switch id="reduce-distractions" disabled />
            </div>
          </TabsContent>
          
          <TabsContent value="audio" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="screen-reader-friendly" className="text-base">
                  {language === 'de' ? 'Bildschirmleser-freundlich' : 'Screen Reader Friendly'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' 
                    ? 'Optimiert für Screenreader-Kompatibilität' 
                    : 'Optimizes for screen reader compatibility'}
                </p>
              </div>
              <Switch id="screen-reader-friendly" defaultChecked disabled />
            </div>
            
            <div>
              <Label className="text-base mb-2 block">
                {language === 'de' ? 'Ankündigungen' : 'Announcements'}
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                {language === 'de' 
                  ? 'Wählen Sie aus, welche Inhalte angekündigt werden sollen' 
                  : 'Choose which content should be announced'}
              </p>
              <Select defaultValue="important">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {language === 'de' ? 'Alle Ankündigungen' : 'All announcements'}
                  </SelectItem>
                  <SelectItem value="important">
                    {language === 'de' ? 'Nur wichtige' : 'Important only'}
                  </SelectItem>
                  <SelectItem value="minimal">
                    {language === 'de' ? 'Minimal' : 'Minimal'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <Button className="w-full">
            {language === 'de' ? 'Einstellungen speichern' : 'Save Settings'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EnhancedAccessibilityPanel;
