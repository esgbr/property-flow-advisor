
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppTheme } from '@/components/theme-provider';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function ThemeToggle() {
  const { theme, setTheme, isDarkMode } = useAppTheme();
  const { updatePreferences } = useUserPreferences();
  
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
    updatePreferences({ theme: newTheme });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="focus-visible:ring-2 focus-visible:ring-offset-2"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={isDarkMode}
          >
            <Sun className={`h-5 w-5 transition-opacity ${isDarkMode ? 'opacity-0 absolute' : 'opacity-100'}`} />
            <Moon className={`h-5 w-5 transition-opacity ${isDarkMode ? 'opacity-100' : 'opacity-0 absolute'}`} />
            <span className="sr-only">
              {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
