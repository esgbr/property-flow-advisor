
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Calendar, 
  Edit, 
  Trash, 
  Star, 
  StarOff,
  MessageSquare,
  Clock,
  Plus,
  FileText,
  Download
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ContactDetailViewProps {
  contactId: string;
  contactName: string;
  contactType: string;
  contactPhone: string;
  contactEmail?: string;
  contactNotes?: string;
  onBack: () => void;
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  title: string;
  date: string;
  description?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  dateAdded: string;
  size: string;
}

// Mock activities data
const mockActivities: Activity[] = [
  { 
    id: 'a1', 
    type: 'call', 
    title: 'Initial consultation call', 
    date: '2025-05-10T14:30:00',
    description: 'Discussed property requirements and budget constraints.' 
  },
  { 
    id: 'a2', 
    type: 'email', 
    title: 'Property listing sent', 
    date: '2025-05-08T09:15:00',
    description: 'Sent a list of 5 properties matching the requirements.' 
  },
  { 
    id: 'a3', 
    type: 'meeting', 
    title: 'Property viewing', 
    date: '2025-05-05T11:00:00',
    description: 'Met at the Berlin apartment for an initial viewing.' 
  },
  { 
    id: 'a4', 
    type: 'note', 
    title: 'Follow-up reminder', 
    date: '2025-05-01T16:45:00',
    description: 'Need to follow up regarding financing options.' 
  },
];

// Mock documents data
const mockDocuments: Document[] = [
  {
    id: 'd1',
    name: 'Contract draft.pdf',
    type: 'PDF',
    dateAdded: '2025-05-09',
    size: '1.2 MB'
  },
  {
    id: 'd2',
    name: 'Property assessment.docx',
    type: 'Word',
    dateAdded: '2025-05-07',
    size: '890 KB'
  },
  {
    id: 'd3',
    name: 'Meeting notes.txt',
    type: 'Text',
    dateAdded: '2025-05-05',
    size: '45 KB'
  },
];

const ContactDetailView: React.FC<ContactDetailViewProps> = ({
  contactId,
  contactName,
  contactType,
  contactPhone,
  contactEmail,
  contactNotes,
  onBack
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? 
        (language === 'de' ? 'Von Favoriten entfernt' : 'Removed from favorites') : 
        (language === 'de' ? 'Zu Favoriten hinzugefügt' : 'Added to favorites'),
      description: contactName,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'de'
      ? format(date, 'PPpp', { locale: de })
      : format(date, 'PPpp');
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'note': return <MessageSquare className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'call': return 'bg-blue-100 text-blue-600';
      case 'email': return 'bg-purple-100 text-purple-600';
      case 'meeting': return 'bg-green-100 text-green-600';
      case 'note': return 'bg-amber-100 text-amber-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
      case 'word': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'text': return <FileText className="h-4 w-4 text-gray-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-4 lg:p-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">{contactName}</h2>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 lg:px-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              {language === 'de' ? 'Übersicht' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="activity">
              {language === 'de' ? 'Aktivität' : 'Activity'}
            </TabsTrigger>
            <TabsTrigger value="documents">
              {language === 'de' ? 'Dokumente' : 'Documents'}
            </TabsTrigger>
            <TabsTrigger value="notes">
              {language === 'de' ? 'Notizen' : 'Notes'}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="p-4 lg:p-6">
          <TabsContent value="overview">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex flex-col items-center">
                <Avatar className="h-32 w-32">
                  <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                    {getInitials(contactName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="mt-4 flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleFavorite}
                    title={language === 'de' ? 'Favorit umschalten' : 'Toggle favorite'}
                  >
                    {isFavorite ? (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    title={language === 'de' ? 'Anrufen' : 'Call'}
                    onClick={() => toast({
                      title: language === 'de' ? 'Anruf wird gestartet' : 'Initiating call',
                      description: `${contactName}: ${contactPhone}`
                    })}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  {contactEmail && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      title={language === 'de' ? 'E-Mail senden' : 'Send email'}
                      onClick={() => toast({
                        title: language === 'de' ? 'E-Mail wird vorbereitet' : 'Preparing email',
                        description: `${contactName}: ${contactEmail}`
                      })}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="icon"
                    title={language === 'de' ? 'Termin planen' : 'Schedule meeting'}
                    onClick={() => toast({
                      title: language === 'de' ? 'Termin planen' : 'Schedule meeting',
                      description: `${contactName}`
                    })}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <div className="space-y-4">
                  <div>
                    <Badge variant="outline" className="mb-4">
                      {contactType}
                    </Badge>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          {language === 'de' ? 'Telefonnummer' : 'Phone Number'}
                        </h3>
                        <p>{contactPhone}</p>
                      </div>
                      
                      {contactEmail && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            {language === 'de' ? 'E-Mail-Adresse' : 'Email Address'}
                          </h3>
                          <p>{contactEmail}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {language === 'de' ? 'Notizen' : 'Notes'}
                    </h3>
                    <p>{contactNotes || (language === 'de' ? 'Keine Notizen vorhanden' : 'No notes available')}</p>
                  </div>

                  <Separator className="my-4" />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      {language === 'de' ? 'Letzte Aktivitäten' : 'Recent Activities'}
                    </h3>
                    <div className="space-y-2">
                      {mockActivities.slice(0, 3).map(activity => (
                        <div key={activity.id} className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50">
                          <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(activity.date)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {language === 'de' ? 'Aktivitätsverlauf' : 'Activity History'}
                </h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'de' ? 'Aktivität hinzufügen' : 'Add Activity'}
                </Button>
              </div>
              
              <div className="space-y-4">
                {mockActivities.map(activity => (
                  <div key={activity.id} className="flex gap-4 p-3 border rounded-lg hover:bg-muted/50">
                    <div className={`p-3 rounded-full ${getActivityColor(activity.type)} h-fit`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(activity.date)}
                        </p>
                      </div>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {language === 'de' ? 'Dokumente' : 'Documents'}
                </h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'de' ? 'Dokument hochladen' : 'Upload Document'}
                </Button>
              </div>
              
              <div className="border rounded-md divide-y">
                {mockDocuments.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      {getDocumentIcon(doc.type)}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>{doc.dateAdded}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notes">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {language === 'de' ? 'Notizen' : 'Notes'}
                </h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'de' ? 'Notiz hinzufügen' : 'Add Note'}
                </Button>
              </div>
              
              <div className="p-6 text-center bg-muted/30 rounded-lg">
                <MessageSquare className="h-12 w-12 text-muted-foreground opacity-30 mx-auto" />
                <h3 className="mt-2 text-lg font-medium">
                  {language === 'de' ? 'Keine Notizen vorhanden' : 'No notes available'}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {language === 'de' 
                    ? 'Fügen Sie Notizen zu diesem Kontakt hinzu, um wichtige Informationen zu verfolgen' 
                    : 'Add notes to this contact to track important information'}
                </p>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-between p-4 lg:p-6">
        <Button variant="outline" onClick={onBack}>
          {language === 'de' ? 'Zurück zur Liste' : 'Back to List'}
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              toast({
                title: language === 'de' ? 'Bestätigung erforderlich' : 'Confirmation required',
                description: language === 'de' 
                  ? 'Diese Aktion muss bestätigt werden' 
                  : 'This action requires confirmation',
                variant: 'destructive'
              });
            }}
          >
            <Trash className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Löschen' : 'Delete'}
          </Button>
          
          <Button onClick={() => toast({
            title: language === 'de' ? 'Kommt bald' : 'Coming soon',
            description: language === 'de' ? 'Diese Funktion wird bald verfügbar sein' : 'This feature will be available soon'
          })}>
            <Edit className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Bearbeiten' : 'Edit'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ContactDetailView;
