
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const DocumentsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <FileText className="mr-2 h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">{t('Documents Center')}</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('Property Documents')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('Store and organize your property documents.')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('Financial Records')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('Keep track of financial records and statements.')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('Tax Documents')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('Organize tax-related documents for your properties.')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentsPage;
