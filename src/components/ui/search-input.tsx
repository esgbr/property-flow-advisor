
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { debounce } from '@/utils/performanceUtils';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  className?: string;
  autoFocus?: boolean;
  debounceTime?: number;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'minimal';
}

/**
 * Enhanced search input component with clear button and debounce
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  value: propValue,
  onChange,
  onSearch,
  onClear,
  className = '',
  autoFocus = false,
  debounceTime = 300,
  size = 'default',
  variant = 'default'
}) => {
  // Use internal state if component is uncontrolled
  const [internalValue, setInternalValue] = useState('');
  const value = propValue !== undefined ? propValue : internalValue;
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Create debounced search function
  const debouncedSearch = useRef(
    debounce((searchTerm: string) => {
      onSearch?.(searchTerm);
    }, debounceTime)
  ).current;
  
  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Update internal state if uncontrolled
    if (propValue === undefined) {
      setInternalValue(newValue);
    }
    
    // Call onChange handler
    onChange?.(newValue);
    
    // Trigger debounced search
    debouncedSearch(newValue);
  };
  
  const handleClear = () => {
    // Update internal state if uncontrolled
    if (propValue === undefined) {
      setInternalValue('');
    }
    
    // Call onChange and onClear handlers
    onChange?.('');
    onClear?.();
    onSearch?.('');
    
    // Focus input after clearing
    inputRef.current?.focus();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Submit search on Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch?.(value);
    }
    
    // Clear input on Escape key
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClear();
    }
  };

  // Size classes for the component
  const sizeClasses = {
    sm: 'h-8 text-xs',
    default: 'h-10',
    lg: 'h-12 text-lg'
  };
  
  return (
    <div 
      className={cn(
        'relative flex items-center w-full rounded-md',
        variant === 'minimal' ? 'border-0' : 'border border-input',
        sizeClasses[size],
        className
      )}
    >
      <Search className={cn(
        'absolute left-2 h-4 w-4',
        size === 'lg' && 'h-5 w-5',
        size === 'sm' && 'h-3 w-3',
        'text-muted-foreground'
      )} />
      
      <Input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'border-0 pl-8 h-full focus-visible:ring-0',
          variant === 'minimal' && 'bg-transparent',
          value ? 'pr-8' : 'pr-4'
        )}
      />
      
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 h-full w-8 p-0"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className={cn(
            'h-4 w-4',
            size === 'lg' && 'h-5 w-5',
            size === 'sm' && 'h-3 w-3',
          )} />
        </Button>
      )}
    </div>
  );
};

export default SearchInput;
