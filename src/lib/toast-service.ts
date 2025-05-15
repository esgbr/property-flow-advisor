
import { toast } from '@/hooks/use-toast';
import type { ToastProps } from '@/components/ui/toast';

/**
 * Centralized toast service for consistent toast usage across the app
 */
export const toastService = {
  /**
   * Show a success toast
   */
  success: (title: string, description?: string) => {
    return toast({
      title,
      description,
      variant: 'default',
    });
  },
  
  /**
   * Show an informational toast
   */
  info: (title: string, description?: string) => {
    return toast({
      title,
      description,
      variant: 'default',
    });
  },
  
  /**
   * Show a warning toast
   */
  warning: (title: string, description?: string) => {
    return toast({
      title,
      description,
      variant: 'default',
      className: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    });
  },
  
  /**
   * Show an error toast
   */
  error: (title: string, description?: string) => {
    return toast({
      title,
      description,
      variant: 'destructive',
    });
  },
  
  /**
   * Show a loading toast that can be updated
   */
  loading: (title: string, description?: string) => {
    return toast({
      title,
      description,
      duration: Infinity,
      className: 'bg-muted/50',
    });
  },
  
  /**
   * Update a toast by ID
   */
  update: (id: string, options: { title?: string, description?: string, variant?: ToastProps['variant'] }) => {
    const { dismiss, update } = toast({ title: "Updating..." });
    return update({
      ...options,
      id,
    });
  },
  
  /**
   * Dismiss a toast by ID
   */
  dismiss: (id: string) => {
    // Get toast functions first
    const { dismiss } = toast({ title: "Dismissing..." });
    // Then call the dismiss function with the id
    dismiss(id);
  },
};

export default toastService;
