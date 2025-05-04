
import React, { createContext, useContext, useState, useEffect } from 'react';

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
        
        setReduceMotion((prev) => savedReduceMotion ?? prev);
        setHighContrast((prev) => savedHighContrast ?? prev);
        setLargeText((prev) => savedLargeText ?? prev);
        setScreenReader((prev) => savedScreenReader ?? prev);
      }
    } catch (error) {
      console.error('Failed to load accessibility preferences', error);
    }
  }, []);
  
  const value = {
    reduceMotion,
    highContrast,
    largeText,
    screenReader,
    toggleReduceMotion: () => setReduceMotion(prev => !prev),
    toggleHighContrast: () => setHighContrast(prev => !prev),
    toggleLargeText: () => setLargeText(prev => !prev),
    toggleScreenReader: () => setScreenReader(prev => !prev)
  };
  
  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
