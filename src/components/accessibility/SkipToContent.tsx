
import React, { useState } from 'react';

interface SkipToContentProps {
  contentId: string;
  label?: string;
}

const SkipToContent: React.FC<SkipToContentProps> = ({ 
  contentId, 
  label = 'Skip to main content' 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSkip = () => {
    const element = document.getElementById(contentId);
    if (element) {
      element.setAttribute('tabIndex', '-1');
      element.focus();
      // Remove tabIndex after focus
      setTimeout(() => element.removeAttribute('tabIndex'), 1000);
    }
  };
  
  return (
    <a
      href={`#${contentId}`}
      className={`
        fixed top-2 left-2 z-50 bg-primary text-primary-foreground 
        px-4 py-2 rounded-md transform transition-transform duration-200
        ${isFocused ? 'translate-y-0' : '-translate-y-full'}
      `}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={handleSkip}
    >
      {label}
    </a>
  );
};

export default SkipToContent;
