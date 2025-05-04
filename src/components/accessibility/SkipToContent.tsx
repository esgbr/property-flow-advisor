
import React, { useState, useCallback } from 'react';

interface SkipToContentProps {
  contentId: string;
  label?: string;
}

/**
 * Enhanced Skip to Content component that provides better keyboard accessibility
 * and announces to screen readers when skipping to main content.
 */
const SkipToContent: React.FC<SkipToContentProps> = ({ 
  contentId, 
  label = 'Skip to main content' 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSkip = useCallback(() => {
    const element = document.getElementById(contentId);
    if (element) {
      // Add tabIndex temporarily if it doesn't exist
      const hadTabIndex = element.hasAttribute('tabIndex');
      if (!hadTabIndex) {
        element.setAttribute('tabIndex', '-1');
      }
      
      // Focus the element
      element.focus({ preventScroll: false });
      
      // Remove tabIndex after focus if we added it
      if (!hadTabIndex) {
        setTimeout(() => element.removeAttribute('tabIndex'), 1000);
      }
      
      // Announce to screen readers
      announceToScreenReader(`Skipped to ${element.getAttribute('aria-label') || 'main content'}`);
      
      // Add a visible focus indicator temporarily
      const originalOutline = element.style.outline;
      element.style.outline = '2px solid var(--primary)';
      setTimeout(() => {
        element.style.outline = originalOutline;
      }, 1500);
    }
  }, [contentId]);
  
  // Helper function to announce messages to screen readers
  const announceToScreenReader = (message: string) => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'assertive');
    announcer.setAttribute('role', 'status');
    announcer.classList.add('sr-only');
    announcer.textContent = message;
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  };
  
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
      onClick={(e) => {
        e.preventDefault();
        handleSkip();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSkip();
        }
      }}
      aria-label={label}
    >
      {label}
    </a>
  );
};

export default SkipToContent;
