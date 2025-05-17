
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useToast } from '@/components/ui/use-toast';

export const DarkModeToggle = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();

  const toggleDarkMode = () => {
    const newDarkMode = !preferences.darkMode;
    
    // Update preferences
    updatePreferences({ darkMode: newDarkMode });
    
    // Update DOM class for immediate effect
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Show toast for feedback
    toast({
      title: newDarkMode ? 'Dark mode enabled' : 'Light mode enabled',
      description: newDarkMode 
        ? 'The application will now use a darker color scheme.'
        : 'The application will now use a lighter color scheme.',
      duration: 2000,
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleDarkMode}
      className="rounded-full"
      aria-label={preferences.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {preferences.darkMode ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </Button>
  );
};

export default DarkModeToggle;
