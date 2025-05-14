
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, Mail, FileText, Calendar, ArrowLeft } from 'lucide-react';
import ActivityHistory from './ActivityHistory';
import { useToast } from '@/components/ui/use-toast';

interface ContactDetailViewProps {
  contactId: string;
  contactName: string;
  contactType: string;
  contactPhone: string;
  contactNotes?: string;
  onBack: () => void;
}

const ContactDetailView: React.FC<ContactDetailViewProps> = ({
  contactId,
  contactName,
  contactType,
  contactPhone,
  contactNotes,
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
  
  const handleContactAction = (action: string) => {
    toast({
      title: language === 'de' ? 'Aktion gestartet' : 'Action initiated',
      description: `${action}: ${contactName}`
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
              {getInitials(contactName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{contactName}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Badge variant="outline" className="mr-2">
                {contactType}
              </Badge>
              {contactPhone}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              {language === 'de' ? 'Übersicht' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="activities">
              {language === 'de' ? 'Aktivitäten' : 'Activities'}
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
                  {language === 'de' ? 'Kontaktinformationen' : 'Contact Information'}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{contactPhone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground italic">
                      {language === 'de' ? 'Keine E-Mail angegeben' : 'No email provided'}
                    </span>
                  </div>
                </div>
                {contactNotes && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">
                      {language === 'de' ? 'Notizen' : 'Notes'}
                    </h3>
                    <p className="text-sm text-muted-foreground">{contactNotes}</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {language === 'de' ? 'Schnellaktionen' : 'Quick Actions'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleContactAction(language === 'de' ? 'Anruf' : 'Call')}>
                    <Phone className="h-4 w-4 mr-2" />
                    {language === 'de' ? 'Anrufen' : 'Call'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleContactAction(language === 'de' ? 'E-Mail' : 'Email')}>
                    <Mail className="h-4 w-4 mr-2" />
                    {language === 'de' ? 'E-Mail senden' : 'Send Email'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleContactAction(language === 'de' ? 'Termin' : 'Meeting')}>
                    <Calendar className="h-4 w-4 mr-2" />
                    {language === 'de' ? 'Termin planen' : 'Schedule Meeting'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleContactAction(language === 'de' ? 'Notiz' : 'Note')}>
                    <FileText className="h-4 w-4 mr-2" />
                    {language === 'de' ? 'Notiz hinzufügen' : 'Add Note'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="py-4">
            <ActivityHistory contactId={contactId} />
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

export default ContactDetailView;
