
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAccessibility } from '@/components/accessibility/A11yProvider';
import SkipToContent from '@/components/accessibility/SkipToContent';
import StickyTopNav from '@/components/navigation/StickyTopNav';
import GlobalFocusStyles from '@/components/accessibility/GlobalFocusStyles';
import { isIOS, initializeIOSOptimizations } from '@/utils/iosUtils';
import '../styles/ios-specific.css';
import '../styles/accessibility.css';

interface EnhancedMainLayoutProps {
  children: React.ReactNode;
  className?: string;
  contentId?: string;
  withPadding?: boolean;
  withContainer?: boolean;
}

/**
 * Enhanced layout component with iOS optimizations, improved accessibility, and dark mode support
 */
const EnhancedMainLayout: React.FC<EnhancedMainLayoutProps> = ({
  children,
  className,
  contentId = 'main-content',
  withPadding = true,
  withContainer = true,
}) => {
  const { preferences } = useUserPreferences();
  const { largeText } = useAccessibility();
  const isIOSDevice = isIOS();

  // Initialize iOS optimizations on component mount
  useEffect(() => {
    if (isIOSDevice) {
      initializeIOSOptimizations();
    }
  }, [isIOSDevice]);

  return (
    <div className={cn(
      "flex flex-col min-h-screen w-full",
      isIOSDevice && "ios-device",
      preferences.darkMode && "dark",
      className
    )}>
      {/* Apply global focus and accessibility styles */}
      <GlobalFocusStyles />
      
      <StickyTopNav />
      <SkipToContent contentId={contentId} />
      
      <main 
        id={contentId}
        className={cn(
          "flex-1 overflow-y-auto bg-background text-foreground",
          withPadding && "py-6 mt-16", // Ensure content isn't hidden under navbar
          largeText && "text-lg",
          isIOSDevice && "ios-scroll"
        )}
        tabIndex={-1} // Makes the main content area focusable for skip links
      >
        {withContainer ? (
          <div className={cn(
            "container mx-auto",
            withPadding && "px-4 pb-8",
            isIOSDevice && "ios-safe-padding-bottom"
          )}>
            {children}
          </div>
        ) : children}
      </main>
    </div>
  );
};

export default EnhancedMainLayout;
