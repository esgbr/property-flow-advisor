
import React from 'react';

interface SkipLinksProps {
  links?: Array<{
    id: string;
    label: string;
  }>;
}

/**
 * SkipLinks component for keyboard accessibility
 * Allows keyboard users to skip directly to important content areas
 */
export const SkipLinks: React.FC<SkipLinksProps> = ({
  links = [
    { id: 'main-content', label: 'Skip to content' },
    { id: 'main-navigation', label: 'Skip to navigation' },
    { id: 'search', label: 'Skip to search' }
  ]
}) => {
  const handleSkipClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    
    const element = document.getElementById(id);
    if (element) {
      // Set tabindex to make it focusable if it isn't already
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '-1');
      }
      
      // Focus the element
      element.focus();
      
      // Scroll to the element
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Remove tabindex after the element loses focus
      if (element.getAttribute('tabindex') === '-1') {
        const handleBlur = () => {
          element.removeAttribute('tabindex');
          element.removeEventListener('blur', handleBlur);
        };
        
        element.addEventListener('blur', handleBlur);
      }
    }
  };

  return (
    <div className="skip-links" role="navigation" aria-label="Skip links">
      {links.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className="skip-link"
          onClick={(e) => handleSkipClick(e, link.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleSkipClick(e as unknown as React.MouseEvent<HTMLAnchorElement, MouseEvent>, link.id);
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

export default SkipLinks;
