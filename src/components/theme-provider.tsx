
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function useTheme() {
  const context = React.useContext(
    React.createContext({
      theme: undefined as string | undefined,
      setTheme: (_theme: string) => {},
    })
  );
  
  const [theme, setThemeState] = React.useState<string | undefined>(
    typeof window !== 'undefined' 
      ? localStorage.getItem('real-estate-theme') || 'light' 
      : 'light'
  );
  
  const setTheme = React.useCallback((newTheme: string) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('real-estate-theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      
      // Also set the class for dark mode
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);
  
  // Initialize theme from localStorage on component mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('real-estate-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  return { theme, setTheme };
}
