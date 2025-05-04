
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
      className={`sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${largeText ? 'text-lg' : ''}`}
    >
      Skip to content
    </a>
  );
};

export default SkipToContent;
