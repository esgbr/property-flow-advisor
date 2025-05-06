
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
      }
    } catch (error) {
      console.error('Error loading accessibility settings', error);
    }
  }, []);
  
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
