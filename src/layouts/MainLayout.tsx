
import React from 'react';
import { cn } from '@/lib/utils';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAccessibility } from '@/components/accessibility/A11yProvider';
import SkipToContent from '@/components/accessibility/SkipToContent';
import StickyTopNav from '@/components/navigation/StickyTopNav';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  contentId?: string;
  withPadding?: boolean;
  withContainer?: boolean;
}

/**
 * A layout component that ensures proper scrolling and consistent layout across all pages
 */
const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className,
  contentId = 'main-content',
  withPadding = true,
  withContainer = true,
}) => {
  const { preferences } = useUserPreferences();
  const { largeText } = useAccessibility();

  return (
    <div className={cn(
      "flex flex-col h-full overflow-hidden",
      className
    )}>
      <StickyTopNav />
      <SkipToContent contentId={contentId} />
      <main 
        id={contentId}
        className={cn(
          "flex-1 overflow-y-auto",
          withPadding && "py-6 mt-14", // Added mt-14 to account for sticky nav
          largeText && "text-lg"
        )}
      >
        {withContainer ? (
          <div className={cn(
            "container mx-auto",
            withPadding && "px-4"
          )}>
            {children}
          </div>
        ) : children}
      </main>
    </div>
  );
};

export default MainLayout;
