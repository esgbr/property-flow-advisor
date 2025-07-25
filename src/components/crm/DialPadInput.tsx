
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
  label?: React.ReactNode; // Allow label to be a node for extra info
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
  function handleDirectDial() {
    if (phone && phone.length >= 6 && !loading && !disabled) {
      window.location.href = `tel:${phone}`;
    }
  }
  return (
    <div
      className={`rounded-xl bg-background border shadow-sm px-4 py-3 flex flex-col sm:flex-row gap-3 sm:items-end transition-all ${className || ""}`}
    >
      <div className="flex-1 min-w-0">
        <label
          htmlFor="manual-dial-input"
          className="block text-base font-semibold mb-1 text-primary"
        >
          <span className="inline-flex items-center">
            <PhoneCall className="h-5 w-5 mr-1 text-primary" aria-hidden />
            {label}
          </span>
        </label>
        <Input
          id="manual-dial-input"
          className="w-full px-5 py-4 rounded-lg border border-input bg-background text-foreground font-mono text-2xl font-bold tracking-wider caret-primary shadow-inner outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
          type="tel"
          inputMode="tel"
          autoComplete="off"
          placeholder={placeholder}
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/[^\d+]/g, ""))}
          aria-label={
            typeof label === "string"
              ? label
              : "Phone number input, include full country code"
          }
          minLength={6}
          maxLength={20}
          aria-required="true"
        />
      </div>
      <Button
        type="button"
        // Ersetzt das bisherige onCall!
        onClick={handleDirectDial}
        disabled={!phone || disabled || loading}
        className="h-12 min-w-[96px] text-lg font-semibold bg-primary text-primary-foreground shadow-sm hover:shadow active:scale-95 transition-all"
        aria-label={loading ? "Calling..." : "Dial number"}
      >
        <PhoneCall className="h-5 w-5 mr-2" aria-hidden />
        {/* Kleiner Hinweis, dass das Handy benutzt wird */}
        {loading
          ? "Anrufen ..."
          : (typeof label === "string" ? "Anrufen" : "Call")}
      </Button>
    </div>
  )
};

export default DialPadInput;
