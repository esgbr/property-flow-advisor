
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface Shortcut {
  name: string;
  icon: React.ReactNode;
  description: string;
  path: string;
}

interface InvestmentShortcutsBarProps {
  shortcuts: Shortcut[];
  onShortcutClick?: (action: string, path: string) => void;
}

const InvestmentShortcutsBar: React.FC<InvestmentShortcutsBarProps> = ({
  shortcuts,
  onShortcutClick,
}) => {
  const isMobile = useIsMobile();

  const handleClick = (shortcut: Shortcut) => {
    if (onShortcutClick) {
      onShortcutClick(shortcut.name, shortcut.path);
    }
  };

  return (
    <div className={`flex ${isMobile ? 'overflow-x-auto pb-2' : 'flex-wrap'} gap-2 mb-2`}>
      {shortcuts.map((shortcut) => (
        <Button
          key={shortcut.name}
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className={`${isMobile ? 'flex-shrink-0' : ''} group`}
          onClick={() => handleClick(shortcut)}
        >
          {shortcut.icon}
          <span className={`${isMobile ? 'ml-1' : 'ml-2'}`}>{shortcut.name}</span>
          <ArrowRight className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Button>
      ))}
    </div>
  );
};

export default InvestmentShortcutsBar;
