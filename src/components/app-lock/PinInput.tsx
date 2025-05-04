
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
}

const PinInput: React.FC<PinInputProps> = ({ 
  value, 
  onChange, 
  maxLength = 4,
  label
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
        render={({ slots }) => (
          <InputOTPGroup>
            {slots.map((slot, index) => (
              <InputOTPSlot key={index} {...slot} index={index} />
            ))}
          </InputOTPGroup>
        )}
      />
    </div>
  );
};

export default PinInput;
