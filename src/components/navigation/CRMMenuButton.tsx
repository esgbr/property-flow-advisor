
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PhoneCall } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CRMMenuButtonProps {
  className?: string;
  isSidebar?: boolean;
}

const CRMMenuButton: React.FC<CRMMenuButtonProps> = ({ className, isSidebar = false }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const active = location.pathname.startsWith("/crm");

  return (
    <Link to="/crm" tabIndex={0} className={className}>
      <Button
        variant={active ? "default" : "outline"}
        size={isSidebar ? "default" : "sm"}
        className={`flex items-center gap-2 w-full justify-start ${isSidebar ? 'my-1' : 'ml-2'}`}
        aria-label={t('crm') || 'CRM'}
        data-testid="crm-menu"
      >
        <PhoneCall className="h-4 w-4" />
        <span className={!isSidebar ? "hidden sm:inline" : ""}>{t('crm') || "CRM"}</span>
      </Button>
    </Link>
  );
};

export default CRMMenuButton;
