
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Phone, Mail, Calendar, MapPin, Edit } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ActivityHistory from './ActivityHistory';
import TaskManager from './TaskManager';
import DocumentList from './documents/DocumentList';
import DocumentUploader from './documents/DocumentUploader';
import { formatDate, getContactTypeLabel } from '@/utils/crmUtils';
import { Badge } from '@/components/ui/badge';

interface ContactDetailViewProps {
  contactId: string;
  contactName: string;
  contactType: string;
  contactEmail?: string;
  contactPhone: string;
  contactNotes?: string;
  onBack: () => void;
}

const ContactDetailView: React.FC<ContactDetailViewProps> = ({
  contactId,
  contactName,
  contactType,
  contactEmail,
  contactPhone,
  contactNotes,
  onBack
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('activities');
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            className="mb-2 transition-transform hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Zurück' : 'Back'}
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => toast({
                title: language === 'de' ? 'Kommt bald' : 'Coming soon',
                description: language === 'de' ? 'Bearbeitungsfunktion wird bald verfügbar sein' : 'Edit functionality will be available soon'
              })}
              className="transition-transform hover:scale-110"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <CardTitle className="text-2xl flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          {contactName}
        </CardTitle>
        
        <div className="flex flex-wrap gap-2 mt-1">
          <Badge variant="outline">
            {getContactTypeLabel(contactType, language)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {contactPhone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{contactPhone}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-6 text-xs"
                onClick={() => {
                  toast({
                    title: language === 'de' ? 'Anruf wird gestartet' : 'Initiating call',
                    description: contactPhone
                  });
                }}
              >
                {language === 'de' ? 'Anrufen' : 'Call'}
              </Button>
            </div>
          )}
          
          {contactEmail && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{contactEmail}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-6 text-xs"
                onClick={() => {
                  toast({
                    title: language === 'de' ? 'E-Mail wird vorbereitet' : 'Preparing email',
                    description: contactEmail
                  });
                }}
              >
                {language === 'de' ? 'E-Mail senden' : 'Send email'}
              </Button>
            </div>
          )}
        </div>
        
        {contactNotes && (
          <div className="border-t pt-2 mt-2">
            <h3 className="text-sm font-medium mb-1">
              {language === 'de' ? 'Notizen' : 'Notes'}
            </h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{contactNotes}</p>
          </div>
        )}
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="activities">
              {language === 'de' ? 'Aktivitäten' : 'Activities'}
            </TabsTrigger>
            <TabsTrigger value="tasks">
              {language === 'de' ? 'Aufgaben' : 'Tasks'}
            </TabsTrigger>
            <TabsTrigger value="documents">
              {language === 'de' ? 'Dokumente' : 'Documents'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="activities" className="mt-4">
            <ActivityHistory 
              companyId={undefined}
              contactId={contactId}
              companyName={undefined}
              contactName={contactName}
            />
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-4">
            <TaskManager 
              companyId={undefined}
              contactId={contactId}
              companyName={undefined}
              contactName={contactName}
            />
          </TabsContent>
          
          <TabsContent value="documents" className="mt-4 space-y-4">
            <DocumentUploader 
              entityId={contactId}
              entityType="contact"
            />
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-3">
                {language === 'de' ? 'Vorhandene Dokumente' : 'Existing Documents'}
              </h3>
              <DocumentList
                entityId={contactId}
                entityType="contact"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContactDetailView;
