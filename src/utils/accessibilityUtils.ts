
import { useCallback, useEffect } from 'react';

// Helper to create screen reader announcement element
const createAnnouncementElement = (id: string): HTMLElement => {
  let element = document.getElementById(id);
  
  if (!element) {
    element = document.createElement('div');
    element.id = id;
    element.setAttribute('aria-live', 'polite');
    element.setAttribute('aria-atomic', 'true');
    element.setAttribute('role', 'status');
    element.className = 'sr-only';
    document.body.appendChild(element);
  }
  
  return element;
};

/**
 * Hook for screen reader announcements
 * @returns Object with announcement functions
 */
export const useAnnouncement = () => {
  const announce = useCallback((message: string, assertive = false) => {
    if (!message) return;
    
    const id = assertive ? 'a11y-assertive-announcement' : 'a11y-polite-announcement';
    const element = createAnnouncementElement(id);
    
    if (assertive) {
      element.setAttribute('aria-live', 'assertive');
    } else {
      element.setAttribute('aria-live', 'polite');
    }
    
    // Clear previous announcement
    element.textContent = '';
    
    // Force browser to acknowledge the change
    setTimeout(() => {
      element.textContent = message;
    }, 50);
  }, []);
  
  // Assertive announcement - interrupts current speech
  const announceAssertive = useCallback((message: string) => {
    announce(message, true);
  }, [announce]);
  
  // Ensure announcement elements are created on mount
  useEffect(() => {
    createAnnouncementElement('a11y-polite-announcement');
    createAnnouncementElement('a11y-assertive-announcement');
  }, []);
  
  return {
    announce,
    announceAssertive
  };
};

/**
 * Creates accessible name from children text content
 * @param node The React node to generate name from
 * @returns Text string for accessibility name
 */
export const getAccessibleName = (node: React.ReactNode): string => {
  // Handle string or number directly
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  
  // Handle arrays recursively
  if (Array.isArray(node)) {
    return node.map(getAccessibleName).filter(Boolean).join(' ');
  }
  
  // Handle React elements
  if (node && typeof node === 'object' && 'props' in node) {
    // For elements with children, extract text from children
    if (node.props.children) {
      return getAccessibleName(node.props.children);
    }
    
    // For elements with aria-label, use that
    if (node.props['aria-label']) {
      return node.props['aria-label'];
    }
  }
  
  return '';
};

/**
 * Formats number as currency for screen readers
 * @param value Numeric value
 * @param currency Currency code
 * @returns Formatted string for screen readers
 */
export const formatCurrencyForScreenReader = (
  value: number,
  currency = 'USD'
): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  const formatted = formatter.format(value);
  // Convert $1,234.56 to "1234 dollars and 56 cents"
  const parts = formatted.replace(/[^\d.]/g, ' ').trim().split('.');
  
  let result = '';
  
  if (currency === 'USD') {
    result = `${parts[0].replace(/\s/g, '')} dollars`;
    if (parts[1] && parseInt(parts[1]) > 0) {
      result += ` and ${parts[1]} cents`;
    }
  } else if (currency === 'EUR') {
    result = `${parts[0].replace(/\s/g, '')} euros`;
    if (parts[1] && parseInt(parts[1]) > 0) {
      result += ` and ${parts[1]} cents`;
    }
  } else {
    // Generic format for other currencies
    result = formatted.replace('$', 'dollars');
  }
  
  return result;
};

export default useAnnouncement;
