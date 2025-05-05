
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useLanguage } from '@/contexts/LanguageContext';

const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { isAuthenticated } = useUserPreferences();
  const { t } = useLanguage();
  
  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const toggleForm = () => {
    setIsLoginView(!isLoginView);
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{t('propertyFlow')}</h1>
          <p className="text-muted-foreground mt-2">{t('investmentPlatform')}</p>
        </div>
        
        {isLoginView ? (
          <LoginForm onToggleForm={toggleForm} />
        ) : (
          <RegisterForm onToggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
