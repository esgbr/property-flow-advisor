
import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppTheme } from '@/components/theme-provider';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme, isDarkMode } = useAppTheme();
  const { updatePreferences } = useUserPreferences();
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    updatePreferences({ theme: newTheme });
  };

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative focus-visible:ring-2 focus-visible:ring-offset-2"
                aria-label="Change theme"
              >
                <Sun className={`h-5 w-5 transition-all ${theme === 'light' ? 'opacity-100 scale-100' : 'opacity-0 scale-0 absolute'}`} />
                <Moon className={`h-5 w-5 transition-all ${theme === 'dark' ? 'opacity-100 scale-100' : 'opacity-0 scale-0 absolute'}`} />
                <Monitor className={`h-5 w-5 transition-all ${theme === 'system' ? 'opacity-100 scale-100' : 'opacity-0 scale-0 absolute'}`} />
                <span className="sr-only">
                  {theme === 'light' ? 'Light mode' : theme === 'dark' ? 'Dark mode' : 'System preference'}
                </span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Change theme</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange('light')} className={theme === 'light' ? 'bg-accent' : ''}>
          <Sun className="h-4 w-4 mr-2" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('dark')} className={theme === 'dark' ? 'bg-accent' : ''}>
          <Moon className="h-4 w-4 mr-2" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('system')} className={theme === 'system' ? 'bg-accent' : ''}>
          <Monitor className="h-4 w-4 mr-2" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
