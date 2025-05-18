
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/hooks/use-accessibility';

interface EnhancedToastProps {
  highContrast?: boolean;
  largeText?: boolean;
}

/**
 * Enhanced toast component with accessibility features
 */
export const EnhancedToast: React.FC<EnhancedToastProps> = ({
  highContrast = false,
  largeText = false,
}) => {
  const { toasts } = useToast();
  const { screenReader } = useAccessibility();
  
  // Announce new toasts for screen reader users
  useEffect(() => {
    if (screenReader && toasts.length > 0) {
      // Get the most recent toast
      const latestToast = toasts[0];
      
      // Create an element for screen reader announcement
      const announcementNode = document.createElement('div');
      announcementNode.setAttribute('aria-live', latestToast.variant === 'destructive' ? 'assertive' : 'polite');
      announcementNode.setAttribute('class', 'sr-only');
      
      // Construct the announcement text
      let message = '';
      if (latestToast.title) {
        message += String(latestToast.title) + ': ';
      }
      if (latestToast.description) {
        message += String(latestToast.description);
      }
      
      announcementNode.textContent = message;
      
      // Add to DOM
      document.body.appendChild(announcementNode);
      
      // Remove after it's announced
      setTimeout(() => {
        document.body.removeChild(announcementNode);
      }, 3000);
    }
  }, [toasts, screenReader]);

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props} 
            className={cn(
              highContrast ? 'border-2 border-foreground' : '',
              largeText ? 'text-lg p-4' : '',
              props.className
            )}
            role={props.variant === 'destructive' ? 'alert' : 'status'}
            aria-live={props.variant === 'destructive' ? 'assertive' : 'polite'}
          >
            <div className="grid gap-1">
              {title && <ToastTitle className={largeText ? 'text-lg' : ''}>{title}</ToastTitle>}
              {description && (
                <ToastDescription className={largeText ? 'text-base' : ''}>
                  {typeof description === 'string' ? description : String(description)}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose 
              className={highContrast ? 'border border-border' : ''} 
              aria-label="Close notification"
            />
          </Toast>
        )
      })}
      <ToastViewport className={largeText ? 'gap-3 p-6' : ''} />
    </ToastProvider>
  )
}
