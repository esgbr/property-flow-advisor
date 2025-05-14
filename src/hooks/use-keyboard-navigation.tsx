import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useScreenReader } from './use-screen-reader';

type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
};

export const useKeyboardNavigation = (customShortcuts: KeyboardShortcut[] = []) => {
  const navigate = useNavigate();
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([]);
  const { announceKeyEvent } = useScreenReader();
  
  // Set up default shortcuts and merge with custom shortcuts
  useEffect(() => {
    const defaultShortcuts: KeyboardShortcut[] = [
      {
        key: 'h',
        alt: true,
        description: 'Go to home',
        action: () => navigate('/')
      },
      {
        key: 'd',
        alt: true,
        description: 'Go to dashboard',
        action: () => navigate('/dashboard')
      },
      {
        key: 's',
        alt: true,
        description: 'Go to settings',
        action: () => navigate('/settings')
      },
      {
        key: 'a',
        alt: true,
        description: 'Go to accessibility settings',
        action: () => navigate('/accessibility')
      },
      {
        key: '/',
        description: 'Focus search',
        action: () => {
          const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        }
      },
      {
        key: 'Escape',
        description: 'Close dialogs or menus',
        action: () => {
          // Find any open dialogs or menus
          const closeButtons = document.querySelectorAll('[aria-label*="close" i], [aria-label*="dismiss" i], [data-state="open"] button');
          if (closeButtons.length) {
            (closeButtons[0] as HTMLElement).click();
          }
        }
      }
    ];
    
    setShortcuts([...defaultShortcuts, ...customShortcuts]);
  }, [navigate, customShortcuts]);
  
  // Set up keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea, or contentEditable element
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }
      
      const matchingShortcut = shortcuts.find(
        shortcut =>
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          !!shortcut.ctrl === event.ctrlKey &&
          !!shortcut.alt === event.altKey &&
          !!shortcut.shift === event.shiftKey
      );
      
      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
        
        // Announce the action for screen reader users
        if (announceKeyEvent) {
          announceKeyEvent(matchingShortcut.key, 'navigation');
        }
        
        // Show a toast notification for the shortcut that was used
        toast({
          title: `Keyboard Shortcut: ${matchingShortcut.description}`,
          description: getShortcutDisplayText(matchingShortcut),
          duration: 2000,
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, announceKeyEvent]);
  
  // Helper function to display keyboard shortcuts
  const getShortcutDisplayText = (shortcut: KeyboardShortcut): string => {
    const parts = [];
    
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.shift) parts.push('Shift');
    
    parts.push(shortcut.key.toUpperCase());
    
    return parts.join(' + ');
  };
  
  // Function to display all available shortcuts
  const showAllShortcuts = () => {
    toast({
      title: 'Available Keyboard Shortcuts',
      description: (
        <pre className="max-h-[300px] overflow-y-auto text-sm">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex justify-between mb-1">
              <span>{s.description}</span>
              <code className="bg-muted px-2 py-0.5 rounded ml-2">{getShortcutDisplayText(s)}</code>
            </div>
          ))}
        </pre>
      ),
      duration: 10000,
    });
  };
  
  return { shortcuts, showAllShortcuts };
};
