
import { createContext, useContext, useState, useEffect } from 'react';
import { announce } from '@/utils/accessibilityUtils';

interface AccessibilityContextProps {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  dyslexiaFriendly: boolean;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleReduceMotion: () => void;
  toggleScreenReader: () => void;
  toggleDyslexiaFriendly: () => void;
  announce: (message: string, politeness?: 'polite' | 'assertive') => void;
}

const AccessibilityContext = createContext<AccessibilityContextProps>({
  highContrast: false,
  largeText: false,
  reduceMotion: false,
  screenReader: false,
  dyslexiaFriendly: false,
  toggleHighContrast: () => {},
  toggleLargeText: () => {},
  toggleReduceMotion: () => {},
  toggleScreenReader: () => {},
  toggleDyslexiaFriendly: () => {},
  announce: () => {},
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [dyslexiaFriendly, setDyslexiaFriendly] = useState(false);

  // Load saved preferences on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('accessibility-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setHighContrast(parsedSettings.highContrast || false);
        setLargeText(parsedSettings.largeText || false);
        setReduceMotion(parsedSettings.reduceMotion || false);
        setScreenReader(parsedSettings.screenReader || false);
        setDyslexiaFriendly(parsedSettings.dyslexiaFriendly || false);
      } else {
        // Check system preferences as default
        checkSystemPreferences();
      }
    } catch (error) {
      console.error('Error loading accessibility settings', error);
    }
  }, []);

  // Check system preferences
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
  };

  // Save settings when they change
  useEffect(() => {
    try {
      localStorage.setItem('accessibility-settings', JSON.stringify({
        highContrast,
        largeText,
        reduceMotion,
        screenReader,
        dyslexiaFriendly,
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

      if (dyslexiaFriendly) {
        rootElement.classList.add('dyslexia-friendly');
      } else {
        rootElement.classList.remove('dyslexia-friendly');
      }
      
    } catch (error) {
      console.error('Error saving accessibility settings', error);
    }
  }, [highContrast, largeText, reduceMotion, screenReader, dyslexiaFriendly]);

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
    announce(
      `High contrast mode ${!highContrast ? 'enabled' : 'disabled'}`,
      'polite'
    );
  };

  const toggleLargeText = () => {
    setLargeText(prev => !prev);
    announce(
      `Large text mode ${!largeText ? 'enabled' : 'disabled'}`,
      'polite'
    );
  };

  const toggleReduceMotion = () => {
    setReduceMotion(prev => !prev);
    announce(
      `Reduced motion mode ${!reduceMotion ? 'enabled' : 'disabled'}`,
      'polite'
    );
  };

  const toggleScreenReader = () => {
    setScreenReader(prev => !prev);
    announce(
      `Screen reader optimizations ${!screenReader ? 'enabled' : 'disabled'}`,
      'polite'
    );
  };

  const toggleDyslexiaFriendly = () => {
    setDyslexiaFriendly(prev => !prev);
    announce(
      `Dyslexia friendly mode ${!dyslexiaFriendly ? 'enabled' : 'disabled'}`,
      'polite'
    );
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        largeText,
        reduceMotion,
        screenReader,
        dyslexiaFriendly,
        toggleHighContrast,
        toggleLargeText,
        toggleReduceMotion,
        toggleScreenReader,
        toggleDyslexiaFriendly,
        announce,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);

export default useAccessibility;
