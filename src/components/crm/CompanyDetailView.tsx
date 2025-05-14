
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
  Download,
  Building,
  Users,
  MapPin
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Company } from './CompanyManager';

interface CompanyDetailViewProps {
  company: Company;
  onBack: () => void;
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  title: string;
  date: string;
  description?: string;
}

interface CompanyContact {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
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
    type: 'meeting', 
    title: 'Initial consultation meeting', 
    date: '2025-05-12T14:30:00',
    description: 'Met with the company representatives to discuss partnership opportunities.' 
  },
  { 
    id: 'a2', 
    type: 'email', 
    title: 'Contract proposal sent', 
    date: '2025-05-10T09:15:00',
    description: 'Sent the initial contract proposal for review.' 
  },
  { 
    id: 'a3', 
    type: 'call', 
    title: 'Follow-up call', 
    date: '2025-05-08T11:00:00',
    description: 'Discussed the terms of the agreement and next steps.' 
  },
  { 
    id: 'a4', 
    type: 'note', 
    title: 'Strategy note', 
    date: '2025-05-05T16:45:00',
    description: 'Notes about potential collaboration areas and strategic fit.' 
  },
];

// Mock contacts data
const mockContacts: CompanyContact[] = [
  {
    id: 'c1',
    name: 'Markus Weber',
    position: 'CEO',
    phone: '+49 30 1234567',
    email: 'markus.weber@example.com',
  },
  {
    id: 'c2',
    name: 'Julia Schmidt',
    position: 'Sales Director',
    phone: '+49 30 7654321',
    email: 'julia.schmidt@example.com',
  },
  {
    id: 'c3',
    name: 'Thomas Müller',
    position: 'Property Manager',
    phone: '+49 30 9876543',
    email: 'thomas.mueller@example.com',
  },
];

// Mock documents data
const mockDocuments: Document[] = [
  {
    id: 'd1',
    name: 'Partnership agreement.pdf',
    type: 'PDF',
    dateAdded: '2025-05-15',
    size: '2.4 MB'
  },
  {
    id: 'd2',
    name: 'Company profile.docx',
    type: 'Word',
    dateAdded: '2025-05-10',
    size: '1.1 MB'
  },
  {
    id: 'd3',
    name: 'Meeting notes.txt',
    type: 'Text',
    dateAdded: '2025-05-08',
    size: '32 KB'
  },
];

const CompanyDetailView: React.FC<CompanyDetailViewProps> = ({
  company,
  onBack
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(company.favorite);
  const [activeTab, setActiveTab] = useState('overview');

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? 
        (language === 'de' ? 'Von Favoriten entfernt' : 'Removed from favorites') : 
        (language === 'de' ? 'Zu Favoriten hinzugefügt' : 'Added to favorites'),
      description: company.name,
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

  const getTypeLabel = (type: string): string => {
    if (language === 'de') {
      const germanLabels: Record<string, string> = {
        agency: 'Immobilienagentur',
        investment_firm: 'Investmentfirma',
        property_manager: 'Hausverwaltung',
        construction: 'Bauunternehmen',
        other: 'Sonstige'
      };
      return germanLabels[type] || type;
    } else {
      const englishLabels: Record<string, string> = {
        agency: 'Real Estate Agency',
        investment_firm: 'Investment Firm',
        property_manager: 'Property Manager',
        construction: 'Construction',
        other: 'Other'
      };
      return englishLabels[type] || type;
    }
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
          <h2 className="text-2xl font-bold">{company.name}</h2>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 lg:px-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              {language === 'de' ? 'Übersicht' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="contacts">
              {language === 'de' ? 'Kontakte' : 'Contacts'}
            </TabsTrigger>
            <TabsTrigger value="activity">
              {language === 'de' ? 'Aktivität' : 'Activity'}
            </TabsTrigger>
            <TabsTrigger value="documents">
              {language === 'de' ? 'Dokumente' : 'Documents'}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="p-4 lg:p-6">
          <TabsContent value="overview">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex flex-col items-center">
                <Avatar className="h-32 w-32">
                  <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                    {getInitials(company.name)}
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
                      description: `${company.name}: ${company.phone}`
                    })}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    title={language === 'de' ? 'Termin planen' : 'Schedule meeting'}
                    onClick={() => toast({
                      title: language === 'de' ? 'Termin planen' : 'Schedule meeting',
                      description: `${company.name}`
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
                      {getTypeLabel(company.type)}
                    </Badge>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          {language === 'de' ? 'Telefonnummer' : 'Phone Number'}
                        </h3>
                        <p>{company.phone}</p>
                      </div>
                      
                      {company.address && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            {language === 'de' ? 'Adresse' : 'Address'}
                          </h3>
                          <div className="flex items-start gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <p>{company.address}</p>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          {language === 'de' ? 'Kontaktpersonen' : 'Contact Persons'}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <p>{company.contactCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {language === 'de' ? 'Notizen' : 'Notes'}
                    </h3>
                    <p>{company.notes || (language === 'de' ? 'Keine Notizen vorhanden' : 'No notes available')}</p>
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
          
          <TabsContent value="contacts">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {language === 'de' ? 'Kontaktpersonen' : 'Contact Persons'}
                </h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'de' ? 'Kontakt hinzufügen' : 'Add Contact'}
                </Button>
              </div>
              
              <div className="space-y-4">
                {mockContacts.map(contact => (
                  <div key={contact.id} className="p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(contact.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.position}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title={language === 'de' ? 'Anrufen' : 'Call'}
                          onClick={() => toast({
                            title: language === 'de' ? 'Anruf wird gestartet' : 'Initiating call',
                            description: `${contact.name}: ${contact.phone}`
                          })}
                        >
                          <Phone className="h-4 w-4 text-primary" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title={language === 'de' ? 'E-Mail senden' : 'Send email'}
                          onClick={() => toast({
                            title: language === 'de' ? 'E-Mail wird vorbereitet' : 'Preparing email',
                            description: `${contact.name}: ${contact.email}`
                          })}
                        >
                          <Mail className="h-4 w-4 text-primary" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-2 ml-12 text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">{language === 'de' ? 'Telefon:' : 'Phone:'}</span> {contact.phone}
                      </div>
                      <div>
                        <span className="text-muted-foreground">{language === 'de' ? 'E-Mail:' : 'Email:'}</span> {contact.email}
                      </div>
                    </div>
                  </div>
                ))}
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

export default CompanyDetailView;
