
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Phone, Building } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const DashboardQuickActions: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();

  return (
    <div className="flex gap-2 mb-4">
      <Button variant="outline" size="sm" onClick={() => navigate('/notifications')}>
        <Bell className="h-4 w-4 mr-1" />
        <span>2</span>
      </Button>
      <Button onClick={() => navigate('/properties')}>
        <Building className="h-4 w-4 mr-1" />
        {t('viewProperties')}
      </Button>
      <Button onClick={() => navigate('/crm')}>
        <Phone className="h-4 w-4 mr-1" />
        {preferences.language === 'de' ? 'CRM öffnen' : 'Open CRM'}
      </Button>
    </div>
  );
};

export default DashboardQuickActions;
