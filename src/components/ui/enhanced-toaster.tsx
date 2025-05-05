
import React, { useEffect } from 'react';
import { Toaster as SonnerToaster, toast } from 'sonner';
import { useTheme } from 'next-themes';
import { useAccessibility } from '@/components/accessibility/A11yProvider';
import { useAnnouncement } from '@/utils/announcer';

export interface EnhancedToasterProps {
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
  duration?: number;
  className?: string;
}

export const EnhancedToaster: React.FC<EnhancedToasterProps> = ({
  position = 'top-right',
  duration = 5000,
  className = '',
}) => {
  const { theme } = useTheme();
  const { highContrast, largeText, screenReader, reduceMotion } = useAccessibility();
  const { announce } = useAnnouncement();
  
  // Set up a listener to announce new toasts for screen reader users
  useEffect(() => {
    if (!screenReader) return;
    
    // Create a mutation observer to watch for new toast elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) return;
        
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            const role = element.getAttribute('role');
            
            // Only handle newly added toasts
            if ((role === 'status' || role === 'alert') && element.classList.contains('toast')) {
              // Extract toast content for announcement
              const titleEl = element.querySelector('[data-toast-title]');
              const descEl = element.querySelector('[data-toast-description]');
              
              const title = titleEl?.textContent || '';
              const description = descEl?.textContent || '';
              const message = title ? `${title}: ${description}` : description;
              
              if (message) {
                // Use assertive for alerts, polite for status
                announce(message, role === 'alert', 2000);
              }
            }
          }
        });
      });
    });
    
    // Start observing the document body for toast container changes
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    return () => observer.disconnect();
  }, [screenReader, announce]);
  
  return (
    <SonnerToaster
      theme={theme as "light" | "dark" | "system"}
      className={`enhanced-toaster group ${className}`}
      position={position}
      duration={duration}
      closeButton
      expand={largeText}
      richColors
      toastOptions={{
        classNames: {
          toast: `group toast group-[.enhanced-toaster]:bg-background 
            group-[.enhanced-toaster]:text-foreground 
            group-[.enhanced-toaster]:border-border group-[.enhanced-toaster]:shadow-lg
            ${highContrast ? 'group-[.enhanced-toaster]:border-2' : ''}
            ${largeText ? 'group-[.enhanced-toaster]:text-lg group-[.enhanced-toaster]:p-4' : ''}`,
          title: `group-[.toast]:font-semibold ${largeText ? 'group-[.toast]:text-lg' : ''}`,
          description: `group-[.toast]:text-muted-foreground ${largeText ? 'group-[.toast]:text-base' : ''}`,
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton: `${highContrast ? 'group-[.toast]:border group-[.toast]:border-border' : ''}`,
        },
        unstyled: false,
        duration: duration,
        invert: false,
        // Disable animation if reduce motion is enabled
        animationDuration: reduceMotion ? 0 : 150,
      }}
    />
  );
};

// Extend the toast object with enhanced functions
type EnhancedToast = typeof toast & {
  success: (message: string | React.ReactNode, description?: string | React.ReactNode) => void;
  error: (message: string | React.ReactNode, description?: string | React.ReactNode) => void;
  warning: (message: string | React.ReactNode, description?: string | React.ReactNode) => void;
  info: (message: string | React.ReactNode, description?: string | React.ReactNode) => void;
};

// Export the enhanced toast functions
export const enhancedToast = toast as EnhancedToast;
