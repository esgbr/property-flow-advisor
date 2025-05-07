
import React from 'react';

const SkipToContent: React.FC = () => {
  return (
    <a 
      href="#main-content" 
      className="skip-link"
      onClick={(e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
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
