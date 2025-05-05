
import React, { KeyboardEvent, useRef, useEffect } from 'react';
import { useAccessibility } from './A11yProvider';
import { useAnnouncement } from '@/utils/accessibilityUtils';

interface SkipToContentProps {
  contentId: string;
}

const SkipToContent: React.FC<SkipToContentProps> = ({ contentId }) => {
  const { largeText, highContrast, screenReader } = useAccessibility();
  const { announce } = useAnnouncement();
  const skipLinkRef = useRef<HTMLAnchorElement>(null);
  
  // Ensure the skip link is always the first focusable element when the page loads
  useEffect(() => {
    const handleInitialFocus = (e: KeyboardEvent) => {
      // Only handle Tab key
      if (e.key === 'Tab' && !e.shiftKey) {
        if (document.activeElement === document.body) {
          if (skipLinkRef.current) {
            skipLinkRef.current.focus();
            e.preventDefault();
          }
        }
      }
    };

    // Add event listener to detect initial tab navigation
    document.addEventListener('keydown', handleInitialFocus as any);
    
    return () => {
      document.removeEventListener('keydown', handleInitialFocus as any);
    };
  }, []);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    // Handle space key for activation
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const contentElement = document.getElementById(contentId);
      if (contentElement) {
        contentElement.focus();
        // Announce the action for screen readers
        if (screenReader) {
          announce('Skipped to main content', 'assertive');
        }
        
        // Scroll to the content element
        contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };
  
  const handleClick = () => {
    // Focus the content after a short delay to allow the browser to navigate
    setTimeout(() => {
      const contentElement = document.getElementById(contentId);
      if (contentElement) {
        contentElement.focus();
        
        // Announce the action for screen readers
        if (screenReader) {
          announce('Skipped to main content', 'assertive');
        }
      }
    }, 100);
  };
  
  return (
    <a
      ref={skipLinkRef}
      href={`#${contentId}`}
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 
        focus:p-4 focus:bg-primary focus:text-primary-foreground 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary 
        focus:rounded-md focus:shadow-lg transition-colors
        ${largeText ? 'text-lg p-5' : ''}
        ${highContrast ? 'focus:border-2 focus:border-background focus:outline-4 focus:outline-white' : ''}
      `}
      aria-label="Skip to main content"
      data-testid="skip-to-content"
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      tabIndex={0}
    >
      Skip to content
    </a>
  );
};

export default SkipToContent;
