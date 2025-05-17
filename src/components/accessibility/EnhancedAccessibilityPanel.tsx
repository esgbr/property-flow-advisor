
import React from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import FocusStyleSelector from './FocusStyleSelector';

const EnhancedAccessibilityPanel: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const {
    highContrast = false,
    largeText = false,
    reduceMotion = false,
    screenReader = false,
    dyslexiaFriendly = false,
    keyboardMode = false
  } = preferences.accessibility || {};

  // Function to toggle settings
  const toggleSetting = (setting: string, value: boolean) => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        [setting]: value
      }
    });
    
    toast({
      title: t('settingUpdated'),
      description: value ? t(`${setting}Enabled`) : t(`${setting}Disabled`),
      duration: 2000,
    });
  };

  // Reset all accessibility settings
  const resetSettings = () => {
    updatePreferences({
      accessibility: {
        highContrast: false,
        largeText: false,
        reduceMotion: false,
        screenReader: false,
        dyslexiaFriendly: false,
        keyboardMode: false,
        focusStyle: 'default'
      }
    });
    
    toast({
      title: t('settingsReset'),
      description: t('accessibilitySettingsReset'),
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">{t('accessibilitySettings')}</h2>
        <p className="text-sm text-muted-foreground">{t('accessibilityDescription')}</p>
      </div>
      
      <Tabs defaultValue="visual">
        <TabsList className="mb-4">
          <TabsTrigger value="visual">{t('visual')}</TabsTrigger>
          <TabsTrigger value="interaction">{t('interaction')}</TabsTrigger>
          <TabsTrigger value="content">{t('content')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visual" className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="high-contrast">{t('highContrast')}</Label>
                <p className="text-sm text-muted-foreground">{t('highContrastDescription')}</p>
              </div>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={(checked) => toggleSetting('highContrast', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="large-text">{t('largeText')}</Label>
                <p className="text-sm text-muted-foreground">{t('largeTextDescription')}</p>
              </div>
              <Switch
                id="large-text"
                checked={largeText}
                onCheckedChange={(checked) => toggleSetting('largeText', checked)}
              />
            </div>
            
            <FocusStyleSelector />
          </div>
        </TabsContent>
        
        <TabsContent value="interaction" className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reduce-motion">{t('reduceMotion')}</Label>
                <p className="text-sm text-muted-foreground">{t('reduceMotionDescription')}</p>
              </div>
              <Switch
                id="reduce-motion"
                checked={reduceMotion}
                onCheckedChange={(checked) => toggleSetting('reduceMotion', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="keyboard-mode">{t('keyboardMode')}</Label>
                <p className="text-sm text-muted-foreground">{t('keyboardModeDescription')}</p>
              </div>
              <Switch
                id="keyboard-mode"
                checked={keyboardMode}
                onCheckedChange={(checked) => toggleSetting('keyboardMode', checked)}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="screen-reader">{t('screenReader')}</Label>
                <p className="text-sm text-muted-foreground">{t('screenReaderDescription')}</p>
              </div>
              <Switch
                id="screen-reader"
                checked={screenReader}
                onCheckedChange={(checked) => toggleSetting('screenReader', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dyslexia-friendly">{t('dyslexiaFriendly')}</Label>
                <p className="text-sm text-muted-foreground">{t('dyslexiaFriendlyDescription')}</p>
              </div>
              <Switch
                id="dyslexia-friendly"
                checked={dyslexiaFriendly}
                onCheckedChange={(checked) => toggleSetting('dyslexiaFriendly', checked)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Separator />
      
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={resetSettings}>
          {t('resetToDefaults')}
        </Button>
        
        <Button variant="secondary">
          {t('done')}
        </Button>
      </div>
    </div>
  );
};

export default EnhancedAccessibilityPanel;
