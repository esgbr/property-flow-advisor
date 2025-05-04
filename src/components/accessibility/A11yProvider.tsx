
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface AccessibilityContextType {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  toggleReduceMotion: () => void;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleScreenReader: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  reduceMotion: false,
  highContrast: false,
  largeText: false,
  screenReader: false,
  toggleReduceMotion: () => {},
  toggleHighContrast: () => {},
  toggleLargeText: () => {},
  toggleScreenReader: () => {}
});

export const useAccessibility = () => useContext(AccessibilityContext);

export const A11yProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize based on user preferences or saved settings
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  
  // Check for prefers-reduced-motion media query
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(prefersReducedMotion.matches);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
    };
    
    prefersReducedMotion.addEventListener('change', handleChange);
    return () => {
      prefersReducedMotion.removeEventListener('change', handleChange);
    };
  }, []);

  // Check for prefers-contrast media query
  useEffect(() => {
    const prefersContrast = window.matchMedia('(prefers-contrast: more)');
    setHighContrast(prefersContrast.matches);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setHighContrast(event.matches);
    };
    
    prefersContrast.addEventListener('change', handleChange);
    return () => {
      prefersContrast.removeEventListener('change', handleChange);
    };
  }, []);
  
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
    
    // Save preferences
    localStorage.setItem('a11y-preferences', JSON.stringify({
      reduceMotion,
      highContrast,
      largeText,
      screenReader
    }));
    
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
      toast.success(newValue ? 'Reduced motion enabled' : 'Reduced motion disabled');
      return newValue;
    });
  };
  
  const toggleHighContrast = () => {
    setHighContrast(prev => {
      const newValue = !prev;
      toast.success(newValue ? 'High contrast enabled' : 'High contrast disabled');
      return newValue;
    });
  };
  
  const toggleLargeText = () => {
    setLargeText(prev => {
      const newValue = !prev;
      toast.success(newValue ? 'Large text enabled' : 'Large text disabled');
      return newValue;
    });
  };
  
  const toggleScreenReader = () => {
    setScreenReader(prev => {
      const newValue = !prev;
      toast.success(newValue ? 'Screen reader optimizations enabled' : 'Screen reader optimizations disabled');
      return newValue;
    });
  };
  
  const value = {
    reduceMotion,
    highContrast,
    largeText,
    screenReader,
    toggleReduceMotion,
    toggleHighContrast,
    toggleLargeText,
    toggleScreenReader
  };
  
  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
