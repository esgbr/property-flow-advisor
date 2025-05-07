
import React from 'react';

interface SkipToContentProps {
  contentId?: string;
}

const SkipToContent: React.FC<SkipToContentProps> = ({ contentId = 'main-content' }) => {
  return (
    <a 
      href={`#${contentId}`} 
      className="skip-link"
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
