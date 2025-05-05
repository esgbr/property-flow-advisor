
import React, { useEffect, useState } from 'react';
import { useLanguage, SupportedLanguage } from '@/contexts/FixedLanguageContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Globe, Check, X } from 'lucide-react';
import { detectBrowserLanguage, isLanguageSupported } from '@/utils/languageDetector';

interface LanguageDetectionBannerProps {
  onDismiss?: () => void;
}

const LanguageDetectionBanner: React.FC<LanguageDetectionBannerProps> = ({ onDismiss }) => {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const [detectedLanguage, setDetectedLanguage] = useState<SupportedLanguage | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    // Check if we should show language detection banner
    const hasSeenBanner = localStorage.getItem('languageBannerDismissed');
    
    if (hasSeenBanner) {
      return;
    }
    
    // Detect browser language
    const browserLang = detectBrowserLanguage();
    const supportedLanguageCodes = availableLanguages.map(lang => lang.code);
    
    // Only show banner if detected language is supported and different from current
    if (
      isLanguageSupported(browserLang, supportedLanguageCodes) && 
      browserLang !== language
    ) {
      // Ensure browserLang is a valid SupportedLanguage type
      if (browserLang === 'en' || browserLang === 'de' || browserLang === 'fr' || 
          browserLang === 'es' || browserLang === 'it') {
        const typedLang = browserLang as SupportedLanguage;
        setDetectedLanguage(typedLang);
        setShowBanner(true);
      }
    }
  }, []);
  
  const handleAccept = () => {
    if (detectedLanguage) {
      setLanguage(detectedLanguage);
    }
    dismissBanner();
  };
  
  const handleDecline = () => {
    dismissBanner();
  };
  
  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('languageBannerDismissed', 'true');
    if (onDismiss) {
      onDismiss();
    }
  };
  
  if (!showBanner || !detectedLanguage) {
    return null;
  }
  
  // Find display name for detected language
  const detectedLanguageInfo = availableLanguages.find(lang => lang.code === detectedLanguage);
  
  return (
    <Alert className="mb-4 border-primary/20 bg-primary/5">
      <div className="flex items-start">
        <Globe className="h-5 w-5 mt-0.5 text-primary mr-2" />
        <div className="flex-grow">
          <AlertTitle className="mb-2">{t('browserLanguageDetected')}</AlertTitle>
          <AlertDescription className="mb-3">
            {t('languageDetected')}: 
            <span className="ml-1 font-medium">
              {detectedLanguageInfo?.flag} {detectedLanguageInfo?.name}
            </span>
          </AlertDescription>
          <div className="flex gap-2">
            <Button size="sm" className="flex items-center" onClick={handleAccept}>
              <Check className="h-4 w-4 mr-1" />
              {t('showBrowserLanguage')}
            </Button>
            <Button size="sm" variant="outline" onClick={handleDecline}>
              <X className="h-4 w-4 mr-1" />
              {t('close')}
            </Button>
          </div>
        </div>
      </div>
    </Alert>
  );
};

export default LanguageDetectionBanner;
