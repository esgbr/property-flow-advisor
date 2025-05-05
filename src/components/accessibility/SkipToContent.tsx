
import React, { KeyboardEvent, useRef, useEffect, useState } from 'react';
import { useAccessibility } from './A11yProvider';
import { useAnnouncement } from '@/utils/accessibilityUtils';

interface SkipToContentProps {
  contentId: string;
  label?: string;
}

const SkipToContent: React.FC<SkipToContentProps> = ({ 
  contentId, 
  label = "Skip to content" 
}) => {
  const { largeText, highContrast, screenReader } = useAccessibility();
  const { announce } = useAnnouncement();
  const skipLinkRef = useRef<HTMLAnchorElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
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

  // Show and hide the skip link visually when it has focus
  const handleFocus = () => setIsVisible(true);
  const handleBlur = () => setIsVisible(false);
  
  return (
    <a
      ref={skipLinkRef}
      href={`#${contentId}`}
      className={`
        fixed top-0 left-0 z-50 transform -translate-y-full transition-transform duration-200
        p-4 bg-primary text-primary-foreground rounded-md shadow-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary 
        ${isVisible ? 'translate-y-2' : ''}
        ${largeText ? 'text-lg p-5' : ''}
        ${highContrast ? 'border-2 border-background focus:outline-4 focus:outline-white' : ''}
      `}
      aria-label={label}
      data-testid="skip-to-content"
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
    >
      {label}
    </a>
  );
};

export default SkipToContent;
