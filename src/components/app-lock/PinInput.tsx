
import React from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useLanguage } from '@/contexts/LanguageContext';

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

const PinInput: React.FC<PinInputProps> = ({ 
  value, 
  onChange, 
  maxLength = 4,
  label,
  error = false,
  errorMessage,
  disabled = false
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-2">
      {label && (
        <div className="text-sm font-medium">{label}</div>
      )}
      <InputOTP
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={error ? "has-error" : ""}
        render={({ slots }) => (
          <InputOTPGroup>
            {slots.map((slot, index) => (
              <InputOTPSlot 
                key={index} 
                {...slot} 
                index={index}
                className={error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""} 
              />
            ))}
          </InputOTPGroup>
        )}
      />
      {error && errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default PinInput;
