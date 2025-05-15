
import { toast as showToast } from "@/components/ui/use-toast";

export type ToastType = 'default' | 'success' | 'warning' | 'error' | 'info';

/**
 * Centralized toast service to ensure consistent toast notifications
 * throughout the application.
 */
export const toastService = {
  /**
   * Show a default toast
   */
  default: (title: string, description?: string) => {
    return showToast({
      title,
      description,
    });
  },

  /**
   * Show a success toast
   */
  success: (title: string, description?: string) => {
    return showToast({
      title,
      description,
      variant: 'default',
      className: 'bg-green-500 border-green-600 text-white',
    });
  },

  /**
   * Show a warning toast
   */
  warning: (title: string, description?: string) => {
    return showToast({
      title,
      description,
      variant: 'default',
      className: 'bg-yellow-500 border-yellow-600 text-white',
    });
  },

  /**
   * Show an error toast
   */
  error: (title: string, description?: string) => {
    return showToast({
      title,
      description,
      variant: 'destructive',
    });
  },

  /**
   * Show an info toast
   */
  info: (title: string, description?: string) => {
    return showToast({
      title,
      description,
      variant: 'default',
      className: 'bg-blue-500 border-blue-600 text-white',
    });
  },

  /**
   * Update an existing toast
   */
  update: (id: string, props: { title?: string; description?: string }) => {
    const { update } = showToast({
      title: "Updating toast...",
    });
    
    update({
      id: id,
      ...props,
    });
  },

  /**
   * Dismiss a toast by ID
   */
  dismiss: (id: string) => {
    // Create a toast with an internal ID
    const { dismiss } = showToast({
      title: "Dismissing...",
    });
    
    // Call dismiss without arguments as expected by the TypeScript definition
    dismiss();
    
    return id;
  },
};
