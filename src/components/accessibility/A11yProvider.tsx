
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface AccessibilityContextType {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  toggleReduceMotion: () => void;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleScreenReader: () => void;
  resetAllSettings: () => void;
  applySystemSettings: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  reduceMotion: false,
  highContrast: false,
  largeText: false,
  screenReader: false,
  toggleReduceMotion: () => {},
  toggleHighContrast: () => {},
  toggleLargeText: () => {},
  toggleScreenReader: () => {},
  resetAllSettings: () => {},
  applySystemSettings: () => {},
});

export const useAccessibility = () => useContext(AccessibilityContext);

export const A11yProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize based on user preferences or saved settings
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const { updatePreferences } = useUserPreferences();
  
  // Check for prefers-reduced-motion media query
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      // Only auto-apply if the user hasn't explicitly set this preference
      if (localStorage.getItem('a11y-preferences-motion-user-set') !== 'true') {
        setReduceMotion(event.matches);
        saveToLocalStorage({ reduceMotion: event.matches });
      }
    };
    
    // Initial check for system preference
    if (localStorage.getItem('a11y-preferences-motion-user-set') !== 'true') {
      setReduceMotion(prefersReducedMotion.matches);
    }
    
    prefersReducedMotion.addEventListener('change', handleReducedMotionChange);
    return () => {
      prefersReducedMotion.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  // Check for prefers-contrast media query
  useEffect(() => {
    const prefersContrast = window.matchMedia('(prefers-contrast: more)');
    const handleContrastChange = (event: MediaQueryListEvent) => {
      // Only auto-apply if the user hasn't explicitly set this preference
      if (localStorage.getItem('a11y-preferences-contrast-user-set') !== 'true') {
        setHighContrast(event.matches);
        saveToLocalStorage({ highContrast: event.matches });
      }
    };
    
    // Initial check for system preference
    if (localStorage.getItem('a11y-preferences-contrast-user-set') !== 'true') {
      setHighContrast(prefersContrast.matches);
    }
    
    prefersContrast.addEventListener('change', handleContrastChange);
    return () => {
      prefersContrast.removeEventListener('change', handleContrastChange);
    };
  }, []);
  
  // Check for prefers-larger-text media query (Safari specific)
  useEffect(() => {
    const prefersLargerText = window.matchMedia('(prefers-larger-text)');
    const handleTextSizeChange = (event: MediaQueryListEvent) => {
      // Only auto-apply if the user hasn't explicitly set this preference
      if (localStorage.getItem('a11y-preferences-text-user-set') !== 'true') {
        setLargeText(event.matches);
        saveToLocalStorage({ largeText: event.matches });
      }
    };
    
    // Initial check for system preference
    if (localStorage.getItem('a11y-preferences-text-user-set') !== 'true' && prefersLargerText.matches) {
      setLargeText(true);
    }
    
    prefersLargerText.addEventListener('change', handleTextSizeChange);
    return () => {
      prefersLargerText.removeEventListener('change', handleTextSizeChange);
    };
  }, []);
  
  // Helper function to save to localStorage
  const saveToLocalStorage = (settings: Partial<{
    reduceMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
  }>) => {
    try {
      const currentSettings = JSON.parse(localStorage.getItem('a11y-preferences') || '{}');
      const newSettings = { ...currentSettings, ...settings };
      localStorage.setItem('a11y-preferences', JSON.stringify(newSettings));
      
      // FIX: Update the user preferences with individual properties instead of using 'accessibilitySettings'
      // This ensures we're only using properties that exist in the UserPreferences type
      if (settings.reduceMotion !== undefined) updatePreferences({ reduceMotion: settings.reduceMotion });
      if (settings.highContrast !== undefined) updatePreferences({ highContrast: settings.highContrast });
      if (settings.largeText !== undefined) updatePreferences({ largeText: settings.largeText });
      if (settings.screenReader !== undefined) updatePreferences({ screenReader: settings.screenReader });
    } catch (error) {
      console.error('Failed to save accessibility preferences', error);
    }
  };
  
  // Apply accessibility settings to the document
  useEffect(() => {
    // Apply reduce motion
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);
    
    // Apply high contrast
    document.documentElement.classList.toggle('high-contrast', highContrast);
    
    // Apply large text
    document.documentElement.classList.toggle('large-text', largeText);
    
    // Apply screen reader optimizations
    document.documentElement.classList.toggle('screen-reader', screenReader);
  }, [reduceMotion, highContrast, largeText, screenReader]);
  
  // Load saved preferences on mount
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('a11y-preferences');
      if (savedPreferences) {
        const { 
          reduceMotion: savedReduceMotion,
          highContrast: savedHighContrast,
          largeText: savedLargeText,
          screenReader: savedScreenReader
        } = JSON.parse(savedPreferences);
        
        if (savedReduceMotion !== undefined) setReduceMotion(savedReduceMotion);
        if (savedHighContrast !== undefined) setHighContrast(savedHighContrast);
        if (savedLargeText !== undefined) setLargeText(savedLargeText);
        if (savedScreenReader !== undefined) setScreenReader(savedScreenReader);
      }
    } catch (error) {
      console.error('Failed to load accessibility preferences', error);
    }
  }, []);
  
  const toggleReduceMotion = () => {
    setReduceMotion(prev => {
      const newValue = !prev;
      saveToLocalStorage({ reduceMotion: newValue });
      localStorage.setItem('a11y-preferences-motion-user-set', 'true');
      toast.success(newValue ? 'Reduced motion enabled' : 'Reduced motion disabled');
      return newValue;
    });
  };
  
  const toggleHighContrast = () => {
    setHighContrast(prev => {
      const newValue = !prev;
      saveToLocalStorage({ highContrast: newValue });
      localStorage.setItem('a11y-preferences-contrast-user-set', 'true');
      toast.success(newValue ? 'High contrast enabled' : 'High contrast disabled');
      return newValue;
    });
  };
  
  const toggleLargeText = () => {
    setLargeText(prev => {
      const newValue = !prev;
      saveToLocalStorage({ largeText: newValue });
      localStorage.setItem('a11y-preferences-text-user-set', 'true');
      toast.success(newValue ? 'Large text enabled' : 'Large text disabled');
      return newValue;
    });
  };
  
  const toggleScreenReader = () => {
    setScreenReader(prev => {
      const newValue = !prev;
      saveToLocalStorage({ screenReader: newValue });
      toast.success(newValue ? 'Screen reader optimizations enabled' : 'Screen reader optimizations disabled');
      return newValue;
    });
  };
  
  // Reset all settings to default
  const resetAllSettings = () => {
    setReduceMotion(false);
    setHighContrast(false);
    setLargeText(false);
    setScreenReader(false);
    saveToLocalStorage({
      reduceMotion: false,
      highContrast: false,
      largeText: false,
      screenReader: false
    });
    localStorage.removeItem('a11y-preferences-motion-user-set');
    localStorage.removeItem('a11y-preferences-contrast-user-set');
    localStorage.removeItem('a11y-preferences-text-user-set');
    toast.success('All accessibility settings reset to defaults');
  };
  
  // Apply system settings
  const applySystemSettings = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
    const prefersLargeText = window.matchMedia('(prefers-larger-text)').matches;
    
    setReduceMotion(prefersReducedMotion);
    setHighContrast(prefersHighContrast);
    setLargeText(prefersLargeText);
    
    saveToLocalStorage({
      reduceMotion: prefersReducedMotion,
      highContrast: prefersHighContrast,
      largeText: prefersLargeText
    });
    
    localStorage.removeItem('a11y-preferences-motion-user-set');
    localStorage.removeItem('a11y-preferences-contrast-user-set');
    localStorage.removeItem('a11y-preferences-text-user-set');
    
    toast.success('Applied system accessibility preferences');
  };
  
  const contextValue = useMemo(() => ({
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
  }), [reduceMotion, highContrast, largeText, screenReader]);
  
  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};
