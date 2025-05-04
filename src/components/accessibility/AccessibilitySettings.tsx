
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAccessibility } from '@/components/accessibility/A11yProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ZoomIn, ZoomOut, Eye, MonitorUp, PanelTopClose, Sun, Moon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';

const AccessibilitySettings = () => {
  const { 
    reduceMotion, 
    highContrast, 
    largeText, 
    screenReader,
    toggleReduceMotion,
    toggleHighContrast,
    toggleLargeText,
    toggleScreenReader
  } = useAccessibility();
  
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('accessibilitySettings')}</h1>
        <p className="text-muted-foreground">{t('accessibilityDescription') || 'Customize your experience to make the application more accessible.'}</p>
      </div>
      
      <Tabs defaultValue="visual" className="space-y-6">
        <TabsList>
          <TabsTrigger value="visual">{t('visual') || 'Visual'}</TabsTrigger>
          <TabsTrigger value="motion">{t('motion') || 'Motion'}</TabsTrigger>
          <TabsTrigger value="reading">{t('reading') || 'Reading'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visual">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {t('contrastSettings') || 'Contrast Settings'}
                </CardTitle>
                <CardDescription>
                  {t('contrastDescription') || 'Adjust contrast for better visibility'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="high-contrast" className="font-medium">
                      {t('highContrast') || 'High Contrast Mode'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('highContrastDescription') || 'Increases contrast between text and background'}
                    </p>
                  </div>
                  <Switch 
                    id="high-contrast"
                    checked={highContrast}
                    onCheckedChange={toggleHighContrast}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ZoomIn className="h-5 w-5" />
                  {t('textSettings') || 'Text Settings'}
                </CardTitle>
                <CardDescription>
                  {t('textSettingsDescription') || 'Adjust text size for better readability'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="large-text" className="font-medium">
                      {t('largeText') || 'Large Text Mode'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('largeTextDescription') || 'Increases the size of text across the application'}
                    </p>
                  </div>
                  <Switch 
                    id="large-text"
                    checked={largeText} 
                    onCheckedChange={toggleLargeText}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="motion">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PanelTopClose className="h-5 w-5" />
                {t('animationSettings') || 'Animation Settings'}
              </CardTitle>
              <CardDescription>
                {t('animationSettingsDescription') || 'Adjust animation preferences'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reduce-motion" className="font-medium">
                    {t('reduceMotion') || 'Reduce Motion'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('reduceMotionDescription') || 'Reduces or eliminates animations and transitions'}
                  </p>
                </div>
                <Switch 
                  id="reduce-motion"
                  checked={reduceMotion}
                  onCheckedChange={toggleReduceMotion}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reading">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MonitorUp className="h-5 w-5" />
                {t('screenReaderSettings') || 'Screen Reader Settings'}
              </CardTitle>
              <CardDescription>
                {t('screenReaderSettingsDescription') || 'Optimize for screen readers'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="screen-reader" className="font-medium">
                    {t('screenReaderMode') || 'Screen Reader Optimizations'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('screenReaderModeDescription') || 'Enhances the experience for screen reader users'}
                  </p>
                </div>
                <Switch 
                  id="screen-reader"
                  checked={screenReader}
                  onCheckedChange={toggleScreenReader}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('accessibilityHelp') || 'Need Help?'}</CardTitle>
          <CardDescription>
            {t('accessibilityHelpDescription') || 'Additional resources for accessibility support'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            {t('accessibilityHelpText') || 'If you need additional support for accessibility features, please contact our support team.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilitySettings;
