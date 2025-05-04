
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

type ThemeType = 'light' | 'dark' | 'system';

const ThemeContext = React.createContext({
  theme: 'system' as ThemeType | undefined,
  setTheme: (_theme: ThemeType) => {},
  isDarkMode: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function useTheme() {
  const [theme, setThemeState] = React.useState<ThemeType | undefined>(
    typeof window !== 'undefined' 
      ? (localStorage.getItem('real-estate-theme') as ThemeType) || 'system' 
      : 'light'
  );
  
  const isDarkMode = React.useMemo(() => {
    if (theme === 'system') {
      return typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : false;
    }
    return theme === 'dark';
  }, [theme]);
  
  const setTheme = React.useCallback((newTheme: ThemeType) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('real-estate-theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      
      // Set the class for dark mode
      if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);
  
  // Toggle theme function for easier access
  const toggleTheme = React.useCallback(() => {
    if (theme === 'system') {
      setTheme(isDarkMode ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  }, [setTheme, theme, isDarkMode]);
  
  // Initialize theme from localStorage on component mount
  React.useEffect(() => {
    // Check for system preference if no theme set
    if (!localStorage.getItem('real-estate-theme')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme('system');
    } else {
      const savedTheme = localStorage.getItem('real-estate-theme') as ThemeType | null;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }
    
    // Add listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme, theme]);

  return { theme, setTheme, isDarkMode, toggleTheme };
}

// Create a component provider for theme context
export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const themeContext = useTheme();
  
  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
}

// Simplified hook for consuming theme context
export function useAppTheme() {
  return React.useContext(ThemeContext);
}
