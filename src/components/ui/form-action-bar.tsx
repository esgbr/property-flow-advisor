
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, Save } from 'lucide-react';

interface FormActionBarProps {
  onSubmit?: () => void;
  onCancel?: () => void;
  onReset?: () => void;
  isSubmitting?: boolean;
  submitText?: string;
  cancelText?: string;
  resetText?: string;
  showReset?: boolean;
  className?: string;
  submitDisabled?: boolean;
  position?: 'top' | 'bottom' | 'sticky';
}

/**
 * Reusable form action bar with submit, cancel, and reset buttons
 */
export const FormActionBar: React.FC<FormActionBarProps> = ({
  onSubmit,
  onCancel,
  onReset,
  isSubmitting = false,
  submitText = 'Save',
  cancelText = 'Cancel',
  resetText = 'Reset',
  showReset = false,
  className = '',
  submitDisabled = false,
  position = 'bottom'
}) => {
  // Styles based on position
  const positionStyles = {
    top: 'border-b mb-6',
    bottom: 'border-t mt-6',
    sticky: 'border-t sticky bottom-0 bg-background'
  };
  
  return (
    <div className={cn(
      'flex flex-col sm:flex-row sm:justify-end gap-2 py-4',
      positionStyles[position],
      className
    )}>
      {showReset && onReset && (
        <Button
          type="button"
          variant="ghost"
          onClick={onReset}
          disabled={isSubmitting}
        >
          {resetText}
        </Button>
      )}
      
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelText}
        </Button>
      )}
      
      {onSubmit && (
        <Button
          type={onSubmit ? "button" : "submit"}
          onClick={onSubmit}
          disabled={isSubmitting || submitDisabled}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{submitText}</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default FormActionBar;
