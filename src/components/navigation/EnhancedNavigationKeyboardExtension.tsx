
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation';
import { toast } from '@/hooks/use-toast';

type KeyboardNavItem = {
  id: string;
  label: string;
  path: string;
  key: string;
  alt?: boolean;
  ctrl?: boolean;
  shift?: boolean;
};

interface EnhancedNavigationKeyboardExtensionProps {
  navigationItems?: KeyboardNavItem[];
  showShortcutHints?: boolean;
}

/**
 * This component adds keyboard navigation capabilities to the application
 * It doesn't render anything visually but sets up global keyboard handlers
 */
const EnhancedNavigationKeyboardExtension: React.FC<EnhancedNavigationKeyboardExtensionProps> = ({
  navigationItems = [],
  showShortcutHints = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Create keyboard shortcuts from navigation items
  const customShortcuts = navigationItems.map(item => ({
    key: item.key,
    alt: item.alt ?? true,
    ctrl: item.ctrl ?? false,
    shift: item.shift ?? false,
    description: `Navigate to ${item.label}`,
    action: () => navigate(item.path)
  }));
  
  // Add help shortcut
  customShortcuts.push({
    key: '?',
    ctrl: true, 
    description: 'Show keyboard shortcuts',
    action: () => showAllShortcuts()
  });
  
  // Set up keyboard navigation
  const { showAllShortcuts } = useKeyboardNavigation(customShortcuts);
  
  // Show shortcut hints when enabled
  useEffect(() => {
    if (showShortcutHints) {
      const timeoutId = setTimeout(() => {
        toast({
          title: "Keyboard Navigation Available",
          description: "Press Ctrl+? to view all keyboard shortcuts",
          duration: 5000,
        });
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [showShortcutHints]);
  
  return null; // This component doesn't render anything
};

export default EnhancedNavigationKeyboardExtension;
