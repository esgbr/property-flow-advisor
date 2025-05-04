
import React from 'react';
import { useAccessibility } from './A11yProvider';

interface SkipToContentProps {
  contentId: string;
}

const SkipToContent: React.FC<SkipToContentProps> = ({ contentId }) => {
  const { largeText } = useAccessibility();
  
  return (
    <a
      href={`#${contentId}`}
      className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:rounded-md focus:shadow-lg ${largeText ? 'text-lg' : ''}`}
      aria-label="Skip to main content"
      data-testid="skip-to-content"
    >
      Skip to content
    </a>
  );
};

export default SkipToContent;
