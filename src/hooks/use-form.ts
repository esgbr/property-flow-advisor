
import { useState, ChangeEvent, FormEvent } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const fieldName = name as keyof T;
    
    setValues(prev => ({
      ...prev,
      [fieldName]: type === 'number' ? Number(value) : value
    }));
    
    // Clear error when field is changed
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: undefined
      }));
    }
  };
  
  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    const fieldName = name as keyof T;
    
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
    
    // Validate field on blur if validation function is provided
    if (validate) {
      const validationErrors = validate(values);
      if (validationErrors[fieldName]) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: validationErrors[fieldName]
        }));
      }
    }
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields before submission if validation function is provided
    if (validate) {
      const validationErrors = validate(values);
      const hasErrors = Object.keys(validationErrors).length > 0;
      
      if (hasErrors) {
        setErrors(validationErrors);
        // Mark all fields as touched to show errors
        const allTouched = Object.keys(values).reduce((acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        }, {} as Record<keyof T, boolean>);
        
        setTouched(allTouched);
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues
  };
}
