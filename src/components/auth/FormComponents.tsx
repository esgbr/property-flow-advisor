
import React, { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// Form field component for reuse
export interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  autoComplete?: string;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  className,
  autoComplete,
  showPassword,
  togglePasswordVisibility
}) => {
  const isPasswordField = type === 'password' && togglePasswordVisibility;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input 
          id={id} 
          type={isPasswordField && showPassword ? "text" : type} 
          placeholder={placeholder} 
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={error ? "border-red-500" : ""}
          autoComplete={autoComplete}
        />
        {isPasswordField && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Form container component
export interface FormContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitText: string;
  footerContent?: ReactNode;
  className?: string;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  title,
  description,
  children,
  onSubmit,
  isLoading = false,
  submitText,
  footerContent,
  className
}) => {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <form onSubmit={onSubmit} className="space-y-4 p-6 pt-0">
        {children}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : submitText}
        </Button>
        
        {footerContent && (
          <div className="pt-4 border-t">
            {footerContent}
          </div>
        )}
      </form>
    </Card>
  );
};
