
import React from 'react';
import { useAccessibility } from './A11yProvider';

interface SkipToContentProps {
  contentId: string;
}

const SkipToContent: React.FC<SkipToContentProps> = ({ contentId }) => {
  const { largeText, highContrast } = useAccessibility();
  
  return (
    <a
      href={`#${contentId}`}
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 
        focus:p-4 focus:bg-primary focus:text-primary-foreground 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary 
        focus:rounded-md focus:shadow-lg transition-colors
        ${largeText ? 'text-lg p-5' : ''}
        ${highContrast ? 'focus:border-2 focus:border-background' : ''}
      `}
      aria-label="Skip to main content"
      data-testid="skip-to-content"
      onKeyDown={(e) => {
        // Handle space key for activation
        if (e.key === ' ') {
          e.preventDefault();
          document.getElementById(contentId)?.focus();
        }
      }}
    >
      Skip to content
    </a>
  );
};

export default SkipToContent;
