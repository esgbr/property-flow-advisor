
import React from 'react';

interface SkipToContentProps {
  contentId?: string;
}

const SkipToContent: React.FC<SkipToContentProps> = ({ contentId = 'main-content' }) => {
  return (
    <a 
      href={`#${contentId}`} 
      className="skip-link absolute -top-full left-0 z-50 p-3 bg-background text-foreground focus:top-0 focus:outline-none focus:ring focus:ring-primary"
      onClick={(e) => {
        e.preventDefault();
        const mainContent = document.getElementById(contentId);
        if (mainContent) {
          mainContent.tabIndex = -1;
          mainContent.focus();
          setTimeout(() => {
            mainContent.removeAttribute('tabindex');
          }, 1000);
        }
      }}
    >
      Skip to content
    </a>
  );
};

export default SkipToContent;
