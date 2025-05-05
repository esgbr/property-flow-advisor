
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

export function Toaster() {
  const { toasts } = useToast();
  const { highContrast, largeText } = useAccessibility();

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
          >
            <div className="grid gap-1">
              {title && <ToastTitle className={largeText ? 'text-lg' : ''}>{title}</ToastTitle>}
              {description && (
                <ToastDescription className={largeText ? 'text-base' : ''}>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className={highContrast ? 'border border-border' : ''} />
          </Toast>
        )
      })}
      <ToastViewport className={largeText ? 'gap-3 p-6' : ''} />
    </ToastProvider>
  )
}
