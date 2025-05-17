
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Settings, Save, LayoutGrid, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type WidgetType = 'portfolio' | 'market' | 'calculator' | 'alerts' | 'news' | 'taxes';

interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: Record<string, string>;
  visible: boolean;
  position: number;
  size: 'small' | 'medium' | 'large';
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: 'portfolio-summary',
    type: 'portfolio',
    title: { en: 'Portfolio Summary', de: 'Portfolio-Übersicht' },
    visible: true,
    position: 0,
    size: 'large',
  },
  {
    id: 'market-trends',
    type: 'market',
    title: { en: 'Market Trends', de: 'Markttrends' },
    visible: true,
    position: 1,
    size: 'medium',
  },
  {
    id: 'quick-calculator',
    type: 'calculator',
    title: { en: 'Quick Calculator', de: 'Schnellrechner' },
    visible: true,
    position: 2,
    size: 'medium',
  },
  {
    id: 'property-alerts',
    type: 'alerts',
    title: { en: 'Property Alerts', de: 'Immobilien-Benachrichtigungen' },
    visible: true,
    position: 3,
    size: 'small',
  },
  {
    id: 'real-estate-news',
    type: 'news',
    title: { en: 'Real Estate News', de: 'Immobilien-Nachrichten' },
    visible: false,
    position: 4,
    size: 'medium',
  },
  {
    id: 'tax-calendar',
    type: 'taxes',
    title: { en: 'Tax Calendar', de: 'Steuerkalender' },
    visible: false,
    position: 5,
    size: 'small',
  },
];

const CustomizableDashboard: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  // Load saved widget configuration or use defaults
  const [widgets, setWidgets] = useState<WidgetConfig[]>(
    preferences.dashboardWidgets || DEFAULT_WIDGETS
  );
  
  // Track customization mode
  const [isCustomizing, setIsCustomizing] = useState(false);
  
  const toggleCustomizationMode = () => {
    setIsCustomizing(!isCustomizing);
    
    if (isCustomizing) {
      // Save widget configuration when exiting customization mode
      updatePreferences({ dashboardWidgets: widgets });
      toast({
        title: t('dashboardSaved'),
        description: t('dashboardSavedDescription'),
        duration: 3000,
      });
    }
  };
  
  const toggleWidgetVisibility = (id: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, visible: !widget.visible } : widget
    ));
  };
  
  const moveWidgetUp = (id: string) => {
    const index = widgets.findIndex(w => w.id === id);
    if (index <= 0) return;
    
    const newWidgets = [...widgets];
    [newWidgets[index - 1].position, newWidgets[index].position] = 
      [newWidgets[index].position, newWidgets[index - 1].position];
    
    setWidgets([...newWidgets].sort((a, b) => a.position - b.position));
  };
  
  const moveWidgetDown = (id: string) => {
    const index = widgets.findIndex(w => w.id === id);
    if (index >= widgets.length - 1) return;
    
    const newWidgets = [...widgets];
    [newWidgets[index + 1].position, newWidgets[index].position] = 
      [newWidgets[index].position, newWidgets[index + 1].position];
    
    setWidgets([...newWidgets].sort((a, b) => a.position - b.position));
  };
  
  const changeWidgetSize = (id: string, size: 'small' | 'medium' | 'large') => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, size } : widget
    ));
  };
  
  const resetDashboard = () => {
    setWidgets(DEFAULT_WIDGETS);
    toast({
      title: t('dashboardReset'),
      description: t('dashboardResetDescription'),
      duration: 3000,
    });
  };
  
  const renderWidgetContent = (widget: WidgetConfig) => {
    // Placeholder content - in a real app, you'd render actual components based on widget type
    const widgetSizeClass = {
      small: 'h-64',
      medium: 'h-80',
      large: 'h-96',
    };
    
    return (
      <div className={cn("flex items-center justify-center p-4", widgetSizeClass[widget.size])}>
        <p className="text-muted-foreground">{t('widgetContent')}: {widget.title[language]}</p>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('dashboard')}</h2>
        
        <div className="flex gap-2">
          {isCustomizing && (
            <>
              <Button variant="outline" onClick={resetDashboard}>
                {t('resetDashboard')}
              </Button>
              
              <Button onClick={toggleCustomizationMode} variant="default">
                <Save className="mr-2 h-4 w-4" />
                {t('saveDashboard')}
              </Button>
            </>
          )}
          
          {!isCustomizing && (
            <Button onClick={toggleCustomizationMode} variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              {t('customizeDashboard')}
            </Button>
          )}
        </div>
      </div>
      
      {isCustomizing ? (
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboardCustomization')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {widgets.map((widget) => (
                <div key={widget.id} className="flex items-center justify-between border p-4 rounded-md">
                  <div>
                    <h4 className="font-medium">{widget.title[language]}</h4>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div>
                      <Tabs defaultValue={widget.size} onValueChange={(value) => 
                        changeWidgetSize(widget.id, value as 'small' | 'medium' | 'large')
                      }>
                        <TabsList>
                          <TabsTrigger value="small">{t('small')}</TabsTrigger>
                          <TabsTrigger value="medium">{t('medium')}</TabsTrigger>
                          <TabsTrigger value="large">{t('large')}</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    
                    <Button variant="ghost" size="icon" onClick={() => moveWidgetUp(widget.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m18 15-6-6-6 6"/>
                      </svg>
                    </Button>
                    
                    <Button variant="ghost" size="icon" onClick={() => moveWidgetDown(widget.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </Button>
                    
                    <Button
                      variant={widget.visible ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleWidgetVisibility(widget.id)}
                    >
                      {widget.visible ? t('visible') : t('hidden')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {widgets
            .filter(widget => widget.visible)
            .sort((a, b) => a.position - b.position)
            .map(widget => (
              <Card 
                key={widget.id}
                className={cn({
                  'col-span-1': widget.size === 'small',
                  'col-span-1 md:col-span-2 lg:col-span-1': widget.size === 'medium',
                  'col-span-1 md:col-span-2 lg:col-span-2': widget.size === 'large',
                })}
              >
                <CardHeader>
                  <CardTitle>{widget.title[language]}</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderWidgetContent(widget)}
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default CustomizableDashboard;
