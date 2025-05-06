
import React from 'react';
import SecurityDashboard from '@/components/security/SecurityDashboard';
import AuthGuard from '@/components/auth/AuthGuard';

const SecurityPage: React.FC = () => {
  return (
    <AuthGuard>
      <div className="container mx-auto py-6">
        <SecurityDashboard />
      </div>
    </AuthGuard>
  );
};

export default SecurityPage;
