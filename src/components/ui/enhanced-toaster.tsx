import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/contexts/LanguageContext';
import useAnnouncement from '@/utils/announcer';

const EnhancedToaster = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { announce } = useAnnouncement();

  // Announce toast messages for screen readers
  const handleToastShow = (message: string) => {
    if (message) {
      announce(message);
    }
  };

  return (
    <Toaster
      theme={theme as 'light' | 'dark' | 'system'}
      position={language === 'de' ? 'bottom-right' : 'top-right'}
      closeButton
      richColors
      onToastShow={(toast) => handleToastShow(toast.description || toast.title || '')}
    />
  );
};

export default EnhancedToaster;
