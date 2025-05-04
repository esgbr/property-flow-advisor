
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import AccessibilitySettingsButton from '@/components/accessibility/AccessibilitySettingsButton';

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <header className="border-b border-border bg-background">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <div className="ml-auto flex items-center space-x-3">
          <AccessibilitySettingsButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
