
import React, { useState, useCallback } from 'react';

interface SkipToContentProps {
  contentId: string;
  label?: string;
}

/**
 * Component that provides a skip link for keyboard users to bypass navigation
 * and go directly to the main content. This improves accessibility.
 */
const SkipToContent: React.FC<SkipToContentProps> = ({ 
  contentId, 
  label = 'Skip to main content' 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSkip = useCallback(() => {
    const element = document.getElementById(contentId);
    if (element) {
      element.setAttribute('tabIndex', '-1');
      element.focus({ preventScroll: false });
      
      // Remove tabIndex after focus to avoid leaving tab stops
      setTimeout(() => element.removeAttribute('tabIndex'), 1000);
      
      // Announce to screen readers
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'assertive');
      announcer.setAttribute('role', 'status');
      announcer.className = 'sr-only';
      announcer.textContent = 'Skipped to main content';
      document.body.appendChild(announcer);
      
      setTimeout(() => {
        document.body.removeChild(announcer);
      }, 1000);
    }
  }, [contentId]);
  
  return (
    <a
      href={`#${contentId}`}
      className={`
        fixed top-2 left-2 z-50 bg-primary text-primary-foreground 
        px-4 py-2 rounded-md transform transition-transform duration-200 focus:outline-2
        focus:outline-offset-2 focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${isFocused ? 'translate-y-0' : '-translate-y-full'}
      `}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={handleSkip}
    >
      {label}
    </a>
  );
};

export default SkipToContent;
