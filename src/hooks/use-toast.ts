
// Direct implementation rather than re-export to avoid circular dependencies
import { useToast as useToastPrimitive } from "@/components/ui/toast";
import { toast as toastPrimitive } from "@/components/ui/toast";

// Re-export with the same name for backward compatibility
export const useToast = useToastPrimitive;
export const toast = toastPrimitive;
