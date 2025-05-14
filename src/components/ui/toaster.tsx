
import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useAccessibility } from "@/components/accessibility/A11yProvider";
import { useAnnouncement } from "@/utils/accessibilityUtils";
import { useEffect } from "react";

export function Toaster() {
  const { toasts } = useToast();
  const { highContrast, largeText, screenReader } = useAccessibility();
  const { announce } = useAnnouncement();
  
  // Announce new toasts for screen reader users
  useEffect(() => {
    if (screenReader && toasts.length > 0) {
      // Announce only the most recent toast
      const latestToast = toasts[0];
      if (latestToast) {
        const message = latestToast.title 
          ? `${latestToast.title}: ${latestToast.description || ''}`
          : latestToast.description || '';
          
        if (message) {
          // Convert any non-string message to string before announcing
          const isDestructive = latestToast.variant === 'destructive';
          announce(String(message), isDestructive ? 'assertive' : 'polite');
        }
      }
    }
  }, [toasts, screenReader, announce]);

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props} 
            className={`
              ${highContrast ? 'border-2 border-foreground' : ''}
              ${largeText ? 'text-lg p-4' : ''}
            `}
            // Add proper ARIA roles for improved screen reader announcement
            role={props.variant === 'destructive' ? 'alert' : 'status'}
            aria-live={props.variant === 'destructive' ? 'assertive' : 'polite'}
          >
            <div className="grid gap-1">
              {title && <ToastTitle className={largeText ? 'text-lg' : ''}>{title}</ToastTitle>}
              {description && (
                <ToastDescription className={largeText ? 'text-base' : ''}>{description}</ToastDescription>
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
