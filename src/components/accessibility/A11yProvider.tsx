
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  largeText: boolean;
  setLargeText: (value: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
  screenReader: boolean;
  setScreenReader: (value: boolean) => void;
}

const defaultSettings: AccessibilityContextType = {
  highContrast: false,
  setHighContrast: () => {},
  largeText: false,
  setLargeText: () => {},
  reduceMotion: false,
  setReduceMotion: () => {},
  screenReader: false,
  setScreenReader: () => {},
};

const AccessibilityContext = createContext<AccessibilityContextType>(defaultSettings);

export const useAccessibility = () => useContext(AccessibilityContext);

export interface A11yProviderProps {
  children: React.ReactNode;
}

export const A11yProvider: React.FC<A11yProviderProps> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  
  // Load saved preferences
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('a11y-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setHighContrast(parsedSettings.highContrast || false);
        setLargeText(parsedSettings.largeText || false);
        setReduceMotion(parsedSettings.reduceMotion || false);
        setScreenReader(parsedSettings.screenReader || false);
      } else {
        // Check system preferences as default if no saved settings
        checkSystemPreferences();
      }
    } catch (error) {
      console.error('Error loading accessibility settings', error);
    }
    
    // Set up a hidden screen reader announcer
    const existingAnnouncer = document.getElementById('a11y-announcer');
    if (!existingAnnouncer) {
      const announcer = document.createElement('div');
      announcer.id = 'a11y-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      
      // Make it invisible but available to screen readers
      announcer.style.position = 'absolute';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.padding = '0';
      announcer.style.overflow = 'hidden';
      announcer.style.clip = 'rect(0, 0, 0, 0)';
      announcer.style.whiteSpace = 'nowrap';
      announcer.style.border = '0';
      
      document.body.appendChild(announcer);
    }
  }, []);
  
  // Check system preferences for accessibility
  const checkSystemPreferences = () => {
    // Reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setReduceMotion(true);
    }
    
    // Check for high contrast mode
    const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
    if (prefersHighContrast) {
      setHighContrast(true);
    }
    
    // Check if user might be using a screen reader (though this isn't reliable)
    const hasDisplayCutout = window.matchMedia('(display-mode: standalone)').matches;
    if (hasDisplayCutout) {
      setScreenReader(true);
    }
  };
  
  // Save settings when they change
  useEffect(() => {
    try {
      localStorage.setItem('a11y-settings', JSON.stringify({
        highContrast,
        largeText,
        reduceMotion,
        screenReader
      }));
      
      // Apply settings to document
      const rootElement = document.documentElement;
      
      if (highContrast) {
        rootElement.classList.add('high-contrast');
      } else {
        rootElement.classList.remove('high-contrast');
      }
      
      if (largeText) {
        rootElement.classList.add('large-text');
      } else {
        rootElement.classList.remove('large-text');
      }
      
      if (reduceMotion) {
        rootElement.classList.add('reduce-motion');
      } else {
        rootElement.classList.remove('reduce-motion');
      }
      
      if (screenReader) {
        rootElement.setAttribute('aria-live', 'polite');
      } else {
        rootElement.removeAttribute('aria-live');
      }
      
    } catch (error) {
      console.error('Error saving accessibility settings', error);
    }
  }, [highContrast, largeText, reduceMotion, screenReader]);
  
  return (
    <AccessibilityContext.Provider 
      value={{
        highContrast,
        setHighContrast,
        largeText,
        setLargeText,
        reduceMotion,
        setReduceMotion,
        screenReader,
        setScreenReader
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export default useAccessibility;
