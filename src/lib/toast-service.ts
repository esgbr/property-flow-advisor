
import { toast as toastPrimitive } from "@/hooks/use-toast";

/**
 * Unified toast service for consistent notification handling across the application
 */
export const toastService = {
  /**
   * Show a success toast notification
   */
  success: (title: string, description?: string) => {
    return toastPrimitive({
      title,
      description,
      variant: "default",
    });
  },

  /**
   * Show an error toast notification
   */
  error: (title: string, description?: string) => {
    return toastPrimitive({
      title,
      description,
      variant: "destructive",
    });
  },

  /**
   * Show an info toast notification
   */
  info: (title: string, description?: string) => {
    return toastPrimitive({
      title,
      description,
      variant: "default",
    });
  },

  /**
   * Show a warning toast notification
   */
  warning: (title: string, description?: string) => {
    return toastPrimitive({
      title,
      description,
      variant: "default",
      className: "bg-yellow-100 border-yellow-400 text-yellow-800",
    });
  },
};
