
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhoneCall, User, History, Settings, FileText, Building, Users, MessageSquare } from 'lucide-react';
import ContactManager from '@/components/crm/ContactManager';
import CallTracker from '@/components/crm/CallTracker';
import CompanyManager from '@/components/crm/CompanyManager';
import ActivityHistory from '@/components/crm/ActivityHistory';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const CRMPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [selectedContactId, setSelectedContactId] = useState<string | undefined>(undefined);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>(undefined);
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {language === 'de' ? 'CRM & Kontaktverwaltung' : 'CRM & Contact Management'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'de' 
            ? 'Verwalten Sie Ihre Immobilienkontakte, Unternehmen und verfolgen Sie Aktivitäten' 
            : 'Manage your real estate contacts, companies and track activities'}
        </p>
      </div>
      
      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 max-w-3xl">
          <TabsTrigger value="contacts">
            <User className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Kontakte' : 'Contacts'}
          </TabsTrigger>
          <TabsTrigger value="companies">
            <Building className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Unternehmen' : 'Companies'}
          </TabsTrigger>
          <TabsTrigger value="activities">
            <History className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Aktivitäten' : 'Activities'}
          </TabsTrigger>
          <TabsTrigger value="calls">
            <PhoneCall className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Anrufe' : 'Calls'}
          </TabsTrigger>
          <TabsTrigger value="messaging" onClick={() => toast({
            title: language === 'de' ? 'Kommt bald' : 'Coming soon',
            description: language === 'de' ? 'Diese Funktion wird in Kürze verfügbar sein' : 'This feature will be available soon'
          })}>
            <MessageSquare className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Nachrichten' : 'Messaging'}
          </TabsTrigger>
          <TabsTrigger value="settings" onClick={() => toast({
            title: language === 'de' ? 'Kommt bald' : 'Coming soon',
            description: language === 'de' ? 'Diese Funktion wird in Kürze verfügbar sein' : 'This feature will be available soon'
          })}>
            <Settings className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Einstellungen' : 'Settings'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="contacts">
          <ContactManager />
        </TabsContent>
        
        <TabsContent value="companies">
          <CompanyManager />
        </TabsContent>

        <TabsContent value="activities">
          <ActivityHistory />
        </TabsContent>
        
        <TabsContent value="calls">
          <CallTracker />
        </TabsContent>
        
        <TabsContent value="messaging">
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 p-6">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-3" />
              <h2 className="text-lg font-medium">
                {language === 'de' ? 'Nachrichtensystem' : 'Messaging System'}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {language === 'de' 
                  ? 'Das Nachrichtensystem wird in Kürze verfügbar sein. Es wird E-Mail-Integration, Vorlagen und automatisierte Nachrichtenplanung umfassen.' 
                  : 'The messaging system will be available soon. It will include email integration, templates, and automated message scheduling.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 p-6">
              <Settings className="h-12 w-12 text-muted-foreground mb-3" />
              <h2 className="text-lg font-medium">
                {language === 'de' ? 'CRM-Einstellungen' : 'CRM Settings'}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {language === 'de' 
                  ? 'Konfigurationsoptionen werden in Kürze verfügbar sein. Sie werden benutzerdefinierte Felder, Workflow-Automatisierung und Datenimport/-export umfassen.' 
                  : 'Configuration options will be available soon. They will include custom fields, workflow automation, and data import/export.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMPage;
