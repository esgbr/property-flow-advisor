
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, Mail, FileText, Calendar, ArrowLeft, MapPin, Users } from 'lucide-react';
import ActivityHistory from './ActivityHistory';
import { useToast } from '@/components/ui/use-toast';
import { Company } from './CompanyManager';

interface CompanyDetailViewProps {
  company: Company;
  onBack: () => void;
}

const CompanyDetailView: React.FC<CompanyDetailViewProps> = ({
  company,
  onBack
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleCompanyAction = (action: string) => {
    toast({
      title: language === 'de' ? 'Aktion gestartet' : 'Action initiated',
      description: `${action}: ${company.name}`
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {language === 'de' ? 'Zurück' : 'Back'}
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {getInitials(company.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{company.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="mr-1">
                {language === 'de' ? 
                  {'agency': 'Immobilienagentur', 'investment_firm': 'Investmentfirma', 'property_manager': 'Hausverwaltung', 'construction': 'Bauunternehmen', 'other': 'Sonstige'}[company.type] : 
                  {'agency': 'Real Estate Agency', 'investment_firm': 'Investment Firm', 'property_manager': 'Property Manager', 'construction': 'Construction', 'other': 'Other'}[company.type]
                }
              </Badge>
              {company.phone}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              {language === 'de' ? 'Übersicht' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="activities">
              {language === 'de' ? 'Aktivitäten' : 'Activities'}
            </TabsTrigger>
            <TabsTrigger value="contacts">
              {language === 'de' ? 'Kontakte' : 'Contacts'}
            </TabsTrigger>
            <TabsTrigger value="documents" onClick={() => toast({
              title: language === 'de' ? 'Kommt bald' : 'Coming soon',
              description: language === 'de' ? 'Diese Funktion wird in Kürze verfügbar sein' : 'This feature will be available soon'
            })}>
              {language === 'de' ? 'Dokumente' : 'Documents'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {language === 'de' ? 'Unternehmensinformationen' : 'Company Information'}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{company.phone}</span>
                  </div>
                  {company.address && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{company.address}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{company.contactCount} {language === 'de' ? 'Kontakte' : 'Contacts'}</span>
                  </div>
                </div>
                {company.notes && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">
                      {language === 'de' ? 'Notizen' : 'Notes'}
                    </h3>
                    <p className="text-sm text-muted-foreground">{company.notes}</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {language === 'de' ? 'Schnellaktionen' : 'Quick Actions'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleCompanyAction(language === 'de' ? 'Anruf' : 'Call')}>
                    <Phone className="h-4 w-4 mr-2" />
                    {language === 'de' ? 'Anrufen' : 'Call'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleCompanyAction(language === 'de' ? 'E-Mail' : 'Email')}>
                    <Mail className="h-4 w-4 mr-2" />
                    {language === 'de' ? 'E-Mail senden' : 'Send Email'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleCompanyAction(language === 'de' ? 'Termin' : 'Meeting')}>
                    <Calendar className="h-4 w-4 mr-2" />
                    {language === 'de' ? 'Termin planen' : 'Schedule Meeting'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleCompanyAction(language === 'de' ? 'Notiz' : 'Note')}>
                    <FileText className="h-4 w-4 mr-2" />
                    {language === 'de' ? 'Notiz hinzufügen' : 'Add Note'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="py-4">
            <ActivityHistory companyId={company.id} />
          </TabsContent>

          <TabsContent value="contacts" className="py-4">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">
                {language === 'de' ? 'Unternehmenskontakte' : 'Company Contacts'}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                {language === 'de' 
                  ? `${company.name} hat ${company.contactCount} zugeordnete Kontakte. Die detaillierte Ansicht wird in einer kommenden Version verfügbar sein.` 
                  : `${company.name} has ${company.contactCount} associated contacts. The detailed view will be available in an upcoming version.`}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="py-4">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">
                {language === 'de' ? 'Dokumentenverwaltung' : 'Document Management'}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                {language === 'de' 
                  ? 'Die Dokumentenverwaltung wird in einer kommenden Version verfügbar sein. Sie können hier Verträge, Bilder und andere Dateien verwalten.' 
                  : 'Document management will be available in an upcoming version. You will be able to manage contracts, images, and other files here.'}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CompanyDetailView;
