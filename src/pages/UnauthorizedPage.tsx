
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-destructive/10">
              <ShieldAlert className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">{t ? t('unauthorized') : 'Unauthorized Access'}</CardTitle>
          <CardDescription>
            {t ? t('unauthorizedDescription') : 'You do not have permission to access this resource.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <p className="text-center text-muted-foreground">
            {t ? t('contactAdmin') : 'Please contact an administrator if you believe this is an error.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t ? t('goBack') : 'Go Back'}
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              {t ? t('returnHome') : 'Return Home'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
