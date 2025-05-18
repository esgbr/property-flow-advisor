
import React, { useState, useCallback, useEffect } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Grid, Move, Plus, Save, Settings, Undo } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Define widget types
export type WidgetType = 'portfolio' | 'market' | 'calculator' | 'alerts' | 'news' | 'taxes';

// Widget configuration
export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: Record<string, string>;
  visible: boolean;
  position: number;
  size: 'small' | 'medium' | 'large';
}

interface CustomizableDashboardLayoutProps {
  children: React.ReactNode;
  availableWidgets: WidgetConfig[];
  onLayoutChange?: (widgets: WidgetConfig[]) => void;
}

const CustomizableDashboardLayout: React.FC<CustomizableDashboardLayoutProps> = ({
  children,
  availableWidgets,
  onLayoutChange,
}) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  // Get saved dashboard widgets or use available widgets as default
  const [widgets, setWidgets] = useState<WidgetConfig[]>(
    preferences.dashboardWidgets?.length 
      ? preferences.dashboardWidgets 
      : availableWidgets
  );
  
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [editingWidget, setEditingWidget] = useState<WidgetConfig | null>(null);
  
  // Update widgets when preferences change
  useEffect(() => {
    if (preferences.dashboardWidgets?.length) {
      setWidgets(preferences.dashboardWidgets);
    }
  }, [preferences.dashboardWidgets]);
  
  // Save layout to user preferences
  const saveLayout = useCallback(() => {
    updatePreferences({ dashboardWidgets: widgets });
    toast({
      title: t('layoutSaved'),
      description: t('dashboardCustomizationComplete'),
      duration: 2000,
    });
    // Notify parent component about layout change
    if (onLayoutChange) {
      onLayoutChange(widgets);
    }
  }, [widgets, updatePreferences, toast, t, onLayoutChange]);
  
  // Reset layout to default
  const resetLayout = useCallback(() => {
    setWidgets(availableWidgets);
    updatePreferences({ dashboardWidgets: availableWidgets });
    toast({
      title: t('layoutReset'),
      description: t('dashboardDefaultsRestored'),
      duration: 2000,
    });
    if (onLayoutChange) {
      onLayoutChange(availableWidgets);
    }
  }, [availableWidgets, updatePreferences, toast, t, onLayoutChange]);
  
  // Toggle widget visibility
  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, visible: !widget.visible }
          : widget
      )
    );
  }, []);
  
  // Change widget size
  const changeWidgetSize = useCallback((widgetId: string, size: 'small' | 'medium' | 'large') => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, size }
          : widget
      )
    );
  }, []);
  
  // Move widget up in order
  const moveWidgetUp = useCallback((widgetId: string) => {
    setWidgets(prev => {
      const index = prev.findIndex(w => w.id === widgetId);
      if (index <= 0) return prev;
      
      const newWidgets = [...prev];
      const widget = newWidgets[index];
      const prevWidget = newWidgets[index - 1];
      
      // Swap positions
      newWidgets[index - 1] = { ...widget, position: widget.position - 1 };
      newWidgets[index] = { ...prevWidget, position: prevWidget.position + 1 };
      
      return newWidgets.sort((a, b) => a.position - b.position);
    });
  }, []);
  
  // Move widget down in order
  const moveWidgetDown = useCallback((widgetId: string) => {
    setWidgets(prev => {
      const index = prev.findIndex(w => w.id === widgetId);
      if (index === -1 || index >= prev.length - 1) return prev;
      
      const newWidgets = [...prev];
      const widget = newWidgets[index];
      const nextWidget = newWidgets[index + 1];
      
      // Swap positions
      newWidgets[index + 1] = { ...widget, position: widget.position + 1 };
      newWidgets[index] = { ...nextWidget, position: nextWidget.position - 1 };
      
      return newWidgets.sort((a, b) => a.position - b.position);
    });
  }, []);
  
  // Open widget settings
  const openWidgetSettings = useCallback((widget: WidgetConfig) => {
    setEditingWidget(widget);
  }, []);
  
  // Close widget settings
  const closeWidgetSettings = useCallback(() => {
    setEditingWidget(null);
  }, []);
  
  // Update widget settings
  const updateWidgetSettings = useCallback((updatedWidget: WidgetConfig) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === updatedWidget.id 
          ? updatedWidget
          : widget
      )
    );
    closeWidgetSettings();
  }, [closeWidgetSettings]);
  
  return (
    <div className="space-y-4">
      {/* Dashboard controls */}
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsCustomizing(true)}
          className="flex items-center gap-1"
        >
          <Settings className="h-4 w-4" />
          <span>{t('customizeDashboard')}</span>
        </Button>
      </div>
      
      {/* Render children (dashboard content) */}
      {children}
      
      {/* Customization dialog */}
      <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('dashboardCustomization')}</DialogTitle>
            <DialogDescription>
              {t('selectWidgets')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            {widgets.map((widget) => (
              <div 
                key={widget.id}
                className="flex items-center justify-between py-2 border-b"
              >
                <div className="flex items-center">
                  <Switch
                    id={`widget-${widget.id}`}
                    checked={widget.visible}
                    onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                  />
                  <Label htmlFor={`widget-${widget.id}`} className="ml-2 cursor-pointer">
                    {widget.title[language] || widget.title.en}
                  </Label>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openWidgetSettings(widget)}
                    className="h-8 w-8 p-0"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">{t('widgetSettings')}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveWidgetUp(widget.id)}
                    className="h-8 w-8 p-0"
                    disabled={widgets.indexOf(widget) === 0}
                  >
                    <Move className="h-4 w-4 rotate-90" />
                    <span className="sr-only">Move up</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveWidgetDown(widget.id)}
                    className="h-8 w-8 p-0"
                    disabled={widgets.indexOf(widget) === widgets.length - 1}
                  >
                    <Move className="h-4 w-4 -rotate-90" />
                    <span className="sr-only">Move down</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <Button variant="outline" onClick={resetLayout}>
              <Undo className="h-4 w-4 mr-1" />
              {t('resetLayout')}
            </Button>
            <div className="space-x-2">
              <Button variant="ghost" onClick={() => setIsCustomizing(false)}>
                {t('cancelChanges')}
              </Button>
              <Button onClick={() => { saveLayout(); setIsCustomizing(false); }}>
                <Save className="h-4 w-4 mr-1" />
                {t('applyChanges')}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Widget settings dialog */}
      <Dialog open={!!editingWidget} onOpenChange={(open) => !open && closeWidgetSettings()}>
        {editingWidget && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('widgetSettings')}</DialogTitle>
              <DialogDescription>
                {editingWidget.title[language] || editingWidget.title.en}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <Label>{t('widgetSize')}</Label>
                  <RadioGroup
                    value={editingWidget.size}
                    onValueChange={(value) => 
                      setEditingWidget({
                        ...editingWidget,
                        size: value as 'small' | 'medium' | 'large'
                      })
                    }
                    className="flex space-x-2 mt-2"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="small" id="size-small" />
                      <Label htmlFor="size-small" className="cursor-pointer">{t('small')}</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="medium" id="size-medium" />
                      <Label htmlFor="size-medium" className="cursor-pointer">{t('medium')}</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="large" id="size-large" />
                      <Label htmlFor="size-large" className="cursor-pointer">{t('large')}</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="ghost" onClick={closeWidgetSettings}>
                {t('cancelChanges')}
              </Button>
              <Button onClick={() => updateWidgetSettings(editingWidget)}>
                {t('applyChanges')}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default CustomizableDashboardLayout;
