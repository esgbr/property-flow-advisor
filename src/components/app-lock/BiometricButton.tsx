
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Fingerprint } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface BiometricButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  type?: 'faceId' | 'touchId' | 'fingerprint';
  disabled?: boolean;
  className?: string;
}

const BiometricButton: React.FC<BiometricButtonProps> = ({
  onClick, 
  isLoading = false,
  type = 'fingerprint',
  disabled = false,
  className
}) => {
  const { t, language } = useLanguage();
  
  const getIcon = () => {
    switch (type) {
      case 'faceId':
        return <Shield className="mr-2 h-4 w-4" />;
      case 'touchId':
      case 'fingerprint':
      default:
        return <Fingerprint className="mr-2 h-4 w-4" />;
    }
  };
  
  const getLabel = () => {
    switch (type) {
      case 'faceId':
        return language === 'de' ? 'Face ID verwenden' : 'Use Face ID';
      case 'touchId':
        return language === 'de' ? 'Touch ID verwenden' : 'Use Touch ID';
      case 'fingerprint':
      default:
        return language === 'de' ? 'Biometrie verwenden' : 'Use Biometrics';
    }
  };
  
  return (
    <Button 
      onClick={onClick} 
      variant="outline"
      className={cn("w-full relative overflow-hidden", className)}
      disabled={isLoading || disabled}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {getIcon()} {getLabel()}
    </Button>
  );
};

export default BiometricButton;
