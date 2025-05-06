
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface A11yContextType {
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  largeText: boolean;
  toggleLargeText: () => void;
  screenReader: boolean;
  toggleScreenReader: () => void;
  announceToScreenReader: (message: string) => void;
}

const A11yContext = createContext<A11yContextType>({
  reduceMotion: false,
  toggleReduceMotion: () => {},
  highContrast: false,
  toggleHighContrast: () => {},
  largeText: false,
  toggleLargeText: () => {},
  screenReader: false,
  toggleScreenReader: () => {},
  announceToScreenReader: () => {}
});

export const A11yProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  // Initialize state from preferences or media queries
  const [reduceMotion, setReduceMotion] = useState(() => {
    // Check preference or system setting
    return preferences.accessibility?.reduceMotion || 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  
  const [highContrast, setHighContrast] = useState(() => {
    return preferences.accessibility?.highContrast || 
      window.matchMedia('(prefers-contrast: more)').matches;
  });
  
  const [largeText, setLargeText] = useState(() => {
    return preferences.accessibility?.largeText || false;
  });
  
  const [screenReader, setScreenReader] = useState(() => {
    return preferences.accessibility?.screenReader || false;
  });
  
  // Announcement area for screen readers
  const [announcement, setAnnouncement] = useState('');
  
  // Apply accessibility settings when they change
  useEffect(() => {
    const html = document.documentElement;
    
    if (reduceMotion) {
      html.classList.add('reduce-motion');
    } else {
      html.classList.remove('reduce-motion');
    }
    
    if (highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
    
    if (largeText) {
      html.classList.add('large-text');
    } else {
      html.classList.remove('large-text');
    }
    
  }, [reduceMotion, highContrast, largeText]);
  
  // Listen for system preference changes
  useEffect(() => {
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');
    
    const handleReduceMotionChange = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches);
    };
    
    const handleContrastChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };
    
    reduceMotionQuery.addEventListener('change', handleReduceMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);
    
    return () => {
      reduceMotionQuery.removeEventListener('change', handleReduceMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);
  
  // Screen reader announcements
  const announceToScreenReader = (message: string) => {
    setAnnouncement(message);
    
    // Clear announcement after screen readers have had time to announce it
    setTimeout(() => {
      setAnnouncement('');
    }, 1000);
  };
  
  // Toggle functions
  const toggleReduceMotion = () => {
    const newValue = !reduceMotion;
    setReduceMotion(newValue);
    updatePreferences({
      accessibility: {
        ...(preferences.accessibility || {}),
        reduceMotion: newValue
      }
    });
  };
  
  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    updatePreferences({
      accessibility: {
        ...(preferences.accessibility || {}),
        highContrast: newValue
      }
    });
  };
  
  const toggleLargeText = () => {
    const newValue = !largeText;
    setLargeText(newValue);
    updatePreferences({
      accessibility: {
        ...(preferences.accessibility || {}),
        largeText: newValue
      }
    });
  };
  
  const toggleScreenReader = () => {
    const newValue = !screenReader;
    setScreenReader(newValue);
    updatePreferences({
      accessibility: {
        ...(preferences.accessibility || {}),
        screenReader: newValue
      }
    });
  };
  
  return (
    <A11yContext.Provider
      value={{
        reduceMotion,
        toggleReduceMotion,
        highContrast,
        toggleHighContrast,
        largeText,
        toggleLargeText,
        screenReader,
        toggleScreenReader,
        announceToScreenReader
      }}
    >
      {children}
      
      {/* Hidden announcement area for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </A11yContext.Provider>
  );
};

export const useA11y = () => useContext(A11yContext);

export default A11yContext;
