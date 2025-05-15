
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PhoneCall, User, History, Building, MessageSquare, Calendar, 
  FileText, BarChart, Search, Mail, ListTodo, Import
} from 'lucide-react';
import ContactManager from '@/components/crm/ContactManager';
import CallTracker from '@/components/crm/CallTracker';
import CompanyManager from '@/components/crm/CompanyManager';
import ActivityHistory from '@/components/crm/ActivityHistory';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import UnifiedCRMSearch from '@/components/crm/UnifiedCRMSearch';
import EmailTemplates from '@/components/crm/EmailTemplates';
import MeetingScheduler from '@/components/crm/MeetingScheduler';
import TaskManager from '@/components/crm/TaskManager';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ComponentLoader from '@/components/ui/component-loader';

const CRMPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('contacts');
  
  // Set document title based on language
  useEffect(() => {
    document.title = 'PropertyFlow - CRM';
  }, [language]);

  // Keyboard shortcut to toggle the command menu (⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // This would trigger the unified search
        const searchButton = document.getElementById('unified-search-button');
        if (searchButton) searchButton.click();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
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
      
      <div className="mb-6">
        <UnifiedCRMSearch className="max-w-xl" />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-8 overflow-x-auto">
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
          <TabsTrigger value="tasks">
            <ListTodo className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Aufgaben' : 'Tasks'}
          </TabsTrigger>
          <TabsTrigger value="calls">
            <PhoneCall className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Anrufe' : 'Calls'}
          </TabsTrigger>
          <TabsTrigger value="meetings">
            <Calendar className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Termine' : 'Meetings'}
          </TabsTrigger>
          <TabsTrigger value="emails">
            <Mail className="h-4 w-4 mr-2" />
            {language === 'de' ? 'E-Mails' : 'Emails'}
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Berichte' : 'Reports'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="contacts">
          <ComponentLoader>
            <ContactManager />
          </ComponentLoader>
        </TabsContent>
        
        <TabsContent value="companies">
          <ComponentLoader>
            <CompanyManager />
          </ComponentLoader>
        </TabsContent>

        <TabsContent value="activities">
          <ComponentLoader>
            <ActivityHistory />
          </ComponentLoader>
        </TabsContent>
        
        <TabsContent value="tasks">
          <ComponentLoader>
            <TaskManager />
          </ComponentLoader>
        </TabsContent>
        
        <TabsContent value="calls">
          <ComponentLoader>
            <CallTracker />
          </ComponentLoader>
        </TabsContent>
        
        <TabsContent value="meetings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentLoader>
              <MeetingScheduler />
            </ComponentLoader>
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-full p-6">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-lg font-medium">
                  {language === 'de' ? 'Kalender-Integration' : 'Calendar Integration'}
                </h2>
                <p className="text-sm text-muted-foreground mt-2 text-center mb-4">
                  {language === 'de' 
                    ? 'Synchronisieren Sie Ihre Termine mit Google Calendar, Outlook oder Apple Calendar.' 
                    : 'Sync your meetings with Google Calendar, Outlook, or Apple Calendar.'}
                </p>
                <Button variant="outline">
                  {language === 'de' ? 'Kalender verbinden' : 'Connect Calendar'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="emails">
          <ComponentLoader>
            <EmailTemplates />
          </ComponentLoader>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 p-6">
              <BarChart className="h-12 w-12 text-muted-foreground mb-3" />
              <h2 className="text-lg font-medium">
                {language === 'de' ? 'CRM-Berichte' : 'CRM Reports'}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {language === 'de' 
                  ? 'Die Berichtsfunktion wird in Kürze verfügbar sein. Sie wird Leistungskennzahlen, Aktivitätstrends und Kontaktanalysen umfassen.' 
                  : 'The reporting feature will be available soon. It will include performance metrics, activity trends, and contact analytics.'}
              </p>
              <Button variant="outline" className="mt-4" onClick={() => toast({
                title: language === 'de' ? 'Kommt bald' : 'Coming soon',
                description: language === 'de' ? 'Diese Funktion wird in Kürze verfügbar sein' : 'This feature will be available soon'
              })}>
                {language === 'de' ? 'Benachrichtigen, wenn verfügbar' : 'Notify when available'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMPage;
