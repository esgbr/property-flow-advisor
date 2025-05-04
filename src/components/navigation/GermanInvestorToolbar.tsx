
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { germanInvestmentTools } from './GermanInvestorNavigation';

interface GermanInvestorToolbarProps {
  className?: string;
  variant?: 'horizontal' | 'vertical';
  size?: 'default' | 'sm';
  maxItems?: number;
}

const GermanInvestorToolbar: React.FC<GermanInvestorToolbarProps> = ({
  className,
  variant = 'horizontal',
  size = 'default',
  maxItems = 6
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current active tab from URL if it exists
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || '';
  
  // Limit displayed tools based on maxItems
  const displayedTools = germanInvestmentTools.slice(0, maxItems);

  return (
    <div 
      className={cn(
        "flex gap-2 overflow-x-auto pb-2 scrollbar-hide",
        variant === 'vertical' ? "flex-col" : "flex-row",
        className
      )}
    >
      {displayedTools.map((tool) => {
        const isActive = location.pathname.includes('/deutsche-immobilien-tools') && 
                        (currentTab === tool.id || (!currentTab && tool.id === displayedTools[0].id));
        
        const Icon = tool.icon;
        return (
          <Button
            key={tool.id}
            size={size}
            variant={isActive ? "default" : "outline"}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap",
              variant === 'vertical' ? "justify-start" : "justify-center"
            )}
            onClick={() => navigate(`/deutsche-immobilien-tools?tab=${tool.id}`)}
          >
            <Icon className="h-4 w-4" />
            <span className="truncate">{language === 'de' ? tool.titleDe : tool.titleEn}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default GermanInvestorToolbar;
