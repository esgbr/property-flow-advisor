
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Component allowing users to select their preferred focus indicator style
 */
const FocusStyleSelector: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { t } = useLanguage();
  
  const focusStyle = preferences.accessibility?.focusStyle || 'default';

  const handleFocusStyleChange = (value: string) => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        focusStyle: value,
      }
    });
    
    // Apply the selected focus style to the document
    document.body.classList.remove('focus-default', 'focus-enhanced', 'focus-high');
    document.body.classList.add(`focus-${value}`);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('focusIndicatorStyle')}</h3>
      <p className="text-sm text-muted-foreground">{t('focusIndicatorDescription')}</p>
      
      <RadioGroup 
        value={focusStyle} 
        onValueChange={handleFocusStyleChange}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="default" id="focus-default" />
          <Label htmlFor="focus-default" className="cursor-pointer">
            {t('defaultFocus')}
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="enhanced" id="focus-enhanced" />
          <Label htmlFor="focus-enhanced" className="cursor-pointer">
            {t('enhancedFocus')}
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="high" id="focus-high" />
          <Label htmlFor="focus-high" className="cursor-pointer">
            {t('highContrastFocus')}
          </Label>
        </div>
      </RadioGroup>
      
      <div className="mt-4 p-4 border rounded">
        <p className="text-sm mb-2">{t('tryFocusStylePreview')}</p>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1 border rounded">{t('focusMe')}</button>
          <a href="#" className="px-3 py-1 border rounded">{t('clickableLink')}</a>
          <input type="text" className="px-3 py-1 border rounded" placeholder={t('inputField')} />
        </div>
      </div>
    </div>
  );
};

export default FocusStyleSelector;
