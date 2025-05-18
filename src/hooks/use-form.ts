
import { useState, ChangeEvent, FormEvent } from 'react';

export type ValidationRules<T> = {
  [K in keyof T]?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  };
};

export type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));

    if (touched[name as keyof T]) {
      validateField(name as keyof T, value);
    }
  };

  // Mark field as touched on blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));

    validateField(name as keyof T, value);
  };

  // Validate a single field
  const validateField = (name: keyof T, value: any): boolean => {
    const rules = validationRules[name];
    let error = '';

    if (!rules) return true;

    if (rules.required && !value) {
      error = 'This field is required';
    } else if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      error = `Must be at least ${rules.minLength} characters`;
    } else if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      error = `Cannot exceed ${rules.maxLength} characters`;
    } else if (rules.pattern && !rules.pattern.test(value)) {
      error = 'Value does not match the required pattern';
    } else if (rules.custom) {
      const customResult = rules.custom(value);
      if (typeof customResult === 'string') {
        error = customResult;
      } else if (!customResult) {
        error = 'Invalid value';
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error || undefined
    }));

    return !error;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: ValidationErrors<T> = {};
    const newTouched: Record<keyof T, boolean> = {} as Record<keyof T, boolean>;

    // Mark all fields as touched
    for (const key in values) {
      newTouched[key as keyof T] = true;
      const isFieldValid = validateField(key as keyof T, values[key]);
      if (!isFieldValid) {
        isValid = false;
        newErrors[key as keyof T] = errors[key as keyof T];
      }
    }

    setTouched(newTouched);
    setErrors(newErrors);
    
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({} as Record<keyof T, boolean>);
    setSubmitted(false);
  };

  // Set form values programmatically
  const setFormValues = (newValues: Partial<T>) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitted,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues,
    validateForm,
    validateField
  };
}

export default useForm;
