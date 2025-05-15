
import React from "react";
import { PhoneCall } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DialPadInputProps {
  phone: string;
  setPhone: (value: string) => void;
  onCall: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
  placeholder?: string;
}

const DialPadInput: React.FC<DialPadInputProps> = ({
  phone,
  setPhone,
  onCall,
  loading,
  disabled,
  label = "Manual Dial",
  className,
  placeholder = "Enter phone number",
}) => {
  return (
    <div className={`rounded-xl bg-background border shadow-sm px-4 py-3 flex flex-col sm:flex-row gap-3 sm:items-end transition-all ${className}`}>
      <div className="flex-1">
        <label htmlFor="manual-dial-input" className="block text-base font-semibold mb-1 text-primary">
          <span className="inline-flex items-center">
            <PhoneCall className="h-5 w-5 mr-1 text-primary" />
            {label}
          </span>
        </label>
        <Input
          id="manual-dial-input"
          className="w-full px-5 py-4 rounded-lg border border-primary/50 font-mono text-2xl font-bold tracking-wider bg-white dark:bg-zinc-900 dark:text-white caret-primary shadow-inner outline-none focus:ring-2 focus:ring-primary transition duration-150 text-gray-800"
          type="tel"
          inputMode="tel"
          autoComplete="off"
          placeholder={placeholder}
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/[^\d+]/g, ""))}
          aria-label={label}
          minLength={6}
          maxLength={20}
        />
      </div>
      <Button
        type="button"
        onClick={onCall}
        disabled={!phone || disabled || loading}
        className="h-12 min-w-[96px] text-lg font-semibold bg-primary text-white shadow active:scale-95 transition"
      >
        <PhoneCall className="h-5 w-5 mr-2" />
        {loading ? "Calling..." : label}
      </Button>
    </div>
  );
};

export default DialPadInput;
