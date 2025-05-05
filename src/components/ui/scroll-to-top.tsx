
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';
import { useAccessibility } from '@/components/accessibility/A11yProvider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const ButtonScrollToTop: React.FC<{ 
  threshold?: number; 
  scrollBehavior?: ScrollBehavior;
}> = ({ 
  threshold = 300,
  scrollBehavior = 'smooth'
}) => {
  const [visible, setVisible] = useState(false);
  const { reduceMotion } = useAccessibility();
  
  // Update visibility based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);
  
  const scrollToTop = () => {
    // Use instant scrolling if reduce motion is enabled
    window.scrollTo({ 
      top: 0, 
      behavior: reduceMotion ? 'auto' : scrollBehavior 
    });
  };
  
  if (!visible) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-6 right-6 z-40 rounded-full shadow-md opacity-80 hover:opacity-100 transition-opacity"
            aria-label="Scroll to top"
            onClick={scrollToTop}
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Scroll to top</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
