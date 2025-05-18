
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/hooks/use-accessibility';

interface ScrollToTopProps {
  threshold?: number;
  smoothScroll?: boolean;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

/**
 * ScrollToTop button that appears when scrolling down the page
 */
export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  threshold = 300,
  smoothScroll = true,
  className = '',
  size = 'icon'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { highContrast } = useAccessibility();
  
  // Show button when user scrolls down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    // Check initial position
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);
  
  const scrollToTop = () => {
    if (smoothScroll) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
    
    // Focus on a header or main element for better accessibility
    setTimeout(() => {
      const mainElement = document.querySelector('main h1, header, [role="main"]');
      if (mainElement && mainElement instanceof HTMLElement) {
        mainElement.focus();
      }
    }, 500);
  };

  return (
    <Button
      variant={highContrast ? "default" : "secondary"}
      size={size}
      className={cn(
        "rounded-full fixed bottom-4 right-4 shadow-md transition-all duration-300 z-50",
        !isVisible && "translate-y-24 opacity-0 pointer-events-none",
        isVisible && "translate-y-0 opacity-100",
        highContrast && "border-2 border-foreground",
        className
      )}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};

export default ScrollToTop;
