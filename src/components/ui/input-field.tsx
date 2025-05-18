
import React, { useState, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  showPasswordToggle?: boolean;
  required?: boolean;
  inline?: boolean;
}

/**
 * Enhanced Input field with label, error handling, and password toggle
 */
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ 
    label, 
    id, 
    className, 
    error, 
    hint, 
    wrapperClassName, 
    labelClassName,
    type = 'text',
    showPasswordToggle = false,
    required = false,
    inline = false,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    
    // Determine if this is a password field that can toggle visibility
    const isPasswordField = type === 'password' && showPasswordToggle;
    const inputType = isPasswordField && showPassword ? 'text' : type;
    
    return (
      <div className={cn(
        inline ? 'flex items-center gap-4' : 'space-y-2',
        wrapperClassName
      )}>
        <Label 
          htmlFor={id} 
          className={cn(
            inline && 'min-w-32',
            labelClassName
          )}
        >
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        
        <div className="relative w-full">
          <Input
            id={id}
            type={inputType}
            className={cn(
              "w-full",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            required={required}
            ref={ref}
            {...props}
          />
          
          {isPasswordField && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1} // Remove from tab order to avoid confusion
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        
        {(error || hint) && (
          <div className={inline ? 'mt-1 ml-32' : 'mt-1'}>
            {error ? (
              <div 
                className="text-sm text-destructive flex items-center gap-2" 
                id={`${id}-error`}
                role="alert"
              >
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            ) : hint ? (
              <div className="text-sm text-muted-foreground" id={`${id}-hint`}>
                {hint}
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
