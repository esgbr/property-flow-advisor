
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhoneCall, User, History, Building, MessageSquare, Calendar, FileText } from 'lucide-react';
import ContactManager from '@/components/crm/ContactManager';
import CallTracker from '@/components/crm/CallTracker';
import CompanyManager from '@/components/crm/CompanyManager';
import ActivityHistory from '@/components/crm/ActivityHistory';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const CRMPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
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
        <TabsList className="grid w-full grid-cols-6 max-w-4xl">
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
          <TabsTrigger value="calendar" onClick={() => toast({
            title: language === 'de' ? 'Kommt bald' : 'Coming soon',
            description: language === 'de' ? 'Diese Funktion wird in Kürze verfügbar sein' : 'This feature will be available soon'
          })}>
            <Calendar className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Kalender' : 'Calendar'}
          </TabsTrigger>
          <TabsTrigger value="messaging" onClick={() => toast({
            title: language === 'de' ? 'Kommt bald' : 'Coming soon',
            description: language === 'de' ? 'Diese Funktion wird in Kürze verfügbar sein' : 'This feature will be available soon'
          })}>
            <MessageSquare className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Nachrichten' : 'Messaging'}
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
        
        <TabsContent value="calendar">
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 p-6">
              <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
              <h2 className="text-lg font-medium">
                {language === 'de' ? 'CRM-Kalender' : 'CRM Calendar'}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {language === 'de' 
                  ? 'Der Kalender wird in Kürze verfügbar sein. Er wird die Terminplanung, Benachrichtigungen und die Synchronisierung mit gängigen Kalendern umfassen.' 
                  : 'The calendar will be available soon. It will include appointment scheduling, notifications, and synchronization with common calendars.'}
              </p>
            </CardContent>
          </Card>
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
      </Tabs>
    </div>
  );
};

export default CRMPage;
