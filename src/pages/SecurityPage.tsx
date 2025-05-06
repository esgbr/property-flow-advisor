
import React from 'react';
import SecurityDashboard from '@/components/security/SecurityDashboard';
import AuthGuard from '@/components/auth/AuthGuard';
import { Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SecurityPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <AuthGuard>
      <div className="container mx-auto py-6">
        <div className="mb-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{t('securityCenter')}</h1>
              <p className="text-muted-foreground mt-1">
                {t('securityCenterDescription')}
              </p>
            </div>
          </div>
        </div>
        <SecurityDashboard />
      </div>
    </AuthGuard>
  );
};

export default SecurityPage;
