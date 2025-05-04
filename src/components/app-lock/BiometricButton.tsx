
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BiometricButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const BiometricButton: React.FC<BiometricButtonProps> = ({ onClick, isLoading = false }) => {
  const { t } = useLanguage();
  
  return (
    <Button 
      onClick={onClick} 
      variant="outline" 
      className="w-full"
      disabled={isLoading}
    >
      <Shield className="mr-2 h-4 w-4" /> {t('useFaceId')}
    </Button>
  );
};

export default BiometricButton;
