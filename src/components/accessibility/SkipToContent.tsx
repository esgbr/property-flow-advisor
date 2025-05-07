
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SkipToContentProps {
  contentId: string;
}

const SkipToContent: React.FC<SkipToContentProps> = ({ contentId }) => {
  const { t, language } = useLanguage();
  
  return (
    <a
      href={`#${contentId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
    >
      {language === 'de' ? 'Zum Inhalt springen' : 'Skip to content'}
    </a>
  );
};

export { SkipToContent };
export default SkipToContent;
