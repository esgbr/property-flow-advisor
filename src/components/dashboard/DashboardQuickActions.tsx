
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Phone, Building } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

/** 
 * Streamlined QuickActions for discoverable navigation and workflow consistency.
 * Integrates with common dashboard tasks and links related workflows.
 */
const DashboardQuickActions: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();

  return (
    <div className="flex gap-2 mb-2 animate-fade-in">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/notifications')}
        aria-label={t('notifications')}
        className="hover-scale"
      >
        <Bell className="h-4 w-4 mr-1" />
        <span>2</span>
      </Button>
      <Button
        onClick={() => navigate('/properties')}
        aria-label={t('viewProperties')}
        className="hover-scale"
      >
        <Building className="h-4 w-4 mr-1" />
        <span>{t('viewProperties')}</span>
      </Button>
      <Button
        onClick={() => navigate('/crm')}
        aria-label="CRM"
        className="hover-scale"
      >
        <Phone className="h-4 w-4 mr-1" />
        <span>
          {preferences.language === 'de' ? 'CRM öffnen' : 'Open CRM'}
        </span>
      </Button>
    </div>
  );
};

export default DashboardQuickActions;
