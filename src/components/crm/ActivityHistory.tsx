
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Phone, Mail, FileText, Users, Building, Pencil, ExternalLink, Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  date: string;
  contactId?: string;
  contactName?: string;
  companyId?: string;
  companyName?: string;
  completed?: boolean;
  dueDate?: string;
  tags?: string[];
}

// Mock data - in a real app, this would be fetched from an API
const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'call',
    title: 'Initial Call',
    description: 'Discussed property requirements and budget constraints',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    contactId: 'c1',
    contactName: 'Anna Schmidt'
  },
  {
    id: '2',
    type: 'email',
    title: 'Follow-up Email',
    description: 'Sent property listings and financing options',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    contactId: 'c2',
    contactName: 'Max Müller'
  },
  {
    id: '3',
    type: 'meeting',
    title: 'Property Viewing',
    description: 'Met at Berliner Straße 45 to view the apartment',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    contactId: 'c1',
    contactName: 'Anna Schmidt'
  },
  {
    id: '4',
    type: 'note',
    title: 'Client Preferences',
    description: 'Prefers modern style, minimum 2 bedrooms, max budget 350k',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    contactId: 'c3',
    contactName: 'Thomas Weber'
  },
  {
    id: '5',
    type: 'task',
    title: 'Prepare Contract',
    description: 'Draft purchase agreement for Münchner Str. property',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // Due in 2 days
    contactId: 'c4',
    contactName: 'Sophie Becker',
    completed: false
  },
  {
    id: '6',
    type: 'call',
    title: 'Investment Discussion',
    description: 'Discussed portfolio expansion and financing options',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
    companyId: 'comp1',
    companyName: 'Immobilien GmbH'
  },
  {
    id: '7',
    type: 'meeting',
    title: 'Strategy Meeting',
    description: 'Quarterly review of property acquisitions',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    companyId: 'comp2',
    companyName: 'Berlin Real Estate AG'
  }
];

interface ActivityHistoryProps {
  contactId?: string;
  companyId?: string;
  limit?: number;
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ 
  contactId, 
  companyId,
  limit 
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filterType, setFilterType] = useState<'all' | ActivityType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'calendar'>('list');
  
  useEffect(() => {
    // Filter activities based on contactId or companyId if provided
    let filteredActivities = [...mockActivities];
    
    if (contactId) {
      filteredActivities = filteredActivities.filter(activity => activity.contactId === contactId);
    }
    
    if (companyId) {
      filteredActivities = filteredActivities.filter(activity => activity.companyId === companyId);
    }
    
    // Apply type filter if not 'all'
    if (filterType !== 'all') {
      filteredActivities = filteredActivities.filter(activity => activity.type === filterType);
    }
    
    // Apply search filter if query exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredActivities = filteredActivities.filter(activity => 
        activity.title.toLowerCase().includes(query) || 
        activity.description?.toLowerCase().includes(query) ||
        activity.contactName?.toLowerCase().includes(query) ||
        activity.companyName?.toLowerCase().includes(query)
      );
    }
    
    // Sort by date (newest first)
    filteredActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Apply limit if provided
    if (limit && filteredActivities.length > limit) {
      filteredActivities = filteredActivities.slice(0, limit);
    }
    
    setActivities(filteredActivities);
  }, [contactId, companyId, filterType, searchQuery, limit]);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'note':
        return <FileText className="h-4 w-4" />;
      case 'task':
        return <Pencil className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getActivityTypeLabel = (type: ActivityType) => {
    if (language === 'de') {
      switch (type) {
        case 'call': return 'Anruf';
        case 'email': return 'E-Mail';
        case 'meeting': return 'Termin';
        case 'note': return 'Notiz';
        case 'task': return 'Aufgabe';
        default: return type;
      }
    } else {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: language === 'de' ? de : undefined
    });
  };

  const handleNewActivity = (type: ActivityType) => {
    toast({
      title: language === 'de' ? 'Neue Aktivität' : 'New Activity',
      description: language === 'de' 
        ? `Funktion zur Erstellung einer neuen ${getActivityTypeLabel(type).toLowerCase()} wird bald verfügbar` 
        : `Function to create a new ${type} will be available soon`,
      variant: 'default'
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

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-xl">
              {language === 'de' ? 'Aktivitätsverlauf' : 'Activity History'}
            </CardTitle>
            <CardDescription>
              {language === 'de' ? 'Alle Interaktionen und Aufgaben' : 'All interactions and tasks'}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {!contactId && !companyId && (
              <div className="w-[180px]">
                <Input
                  placeholder={language === 'de' ? 'Suchen...' : 'Search...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9"
                />
              </div>
            )}
            <Select 
              value={filterType} 
              onValueChange={(value) => setFilterType(value as 'all' | ActivityType)}
            >
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder={language === 'de' ? 'Filter' : 'Filter'} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{language === 'de' ? 'Aktivitätstyp' : 'Activity Type'}</SelectLabel>
                  <SelectItem value="all">{language === 'de' ? 'Alle' : 'All'}</SelectItem>
                  <SelectItem value="call">{language === 'de' ? 'Anrufe' : 'Calls'}</SelectItem>
                  <SelectItem value="email">{language === 'de' ? 'E-Mails' : 'Emails'}</SelectItem>
                  <SelectItem value="meeting">{language === 'de' ? 'Termine' : 'Meetings'}</SelectItem>
                  <SelectItem value="note">{language === 'de' ? 'Notizen' : 'Notes'}</SelectItem>
                  <SelectItem value="task">{language === 'de' ? 'Aufgaben' : 'Tasks'}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Tabs value={view} onValueChange={(value) => setView(value as 'list' | 'calendar')}>
              <TabsList className="h-9">
                <TabsTrigger value="list" className="px-3">
                  {language === 'de' ? 'Liste' : 'List'}
                </TabsTrigger>
                <TabsTrigger value="calendar" className="px-3">
                  {language === 'de' ? 'Kalender' : 'Calendar'}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TabsContent value="list" className="m-0">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  {language === 'de' ? 'Keine Aktivitäten gefunden' : 'No activities found'}
                </p>
                <Button variant="outline" className="mt-4" onClick={() => handleNewActivity('note')}>
                  {language === 'de' ? 'Aktivität erstellen' : 'Create activity'}
                </Button>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-4">
                  <Button size="sm" variant="outline" onClick={() => handleNewActivity('call')}>
                    <Phone className="h-4 w-4 mr-1" />
                    {language === 'de' ? 'Anruf' : 'Call'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleNewActivity('email')}>
                    <Mail className="h-4 w-4 mr-1" />
                    {language === 'de' ? 'E-Mail' : 'Email'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleNewActivity('meeting')}>
                    <Calendar className="h-4 w-4 mr-1" />
                    {language === 'de' ? 'Termin' : 'Meeting'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleNewActivity('note')}>
                    <FileText className="h-4 w-4 mr-1" />
                    {language === 'de' ? 'Notiz' : 'Note'}
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <h3 className="text-sm font-medium line-clamp-1">{activity.title}</h3>
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">
                              {getActivityTypeLabel(activity.type)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(activity.date)}
                            </span>
                          </div>
                        </div>
                        
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {activity.description}
                          </p>
                        )}
                        
                        <div className="flex items-center mt-2">
                          {(activity.contactName || activity.companyName) && (
                            <div className="flex items-center mr-3">
                              <Avatar className="h-5 w-5 mr-1">
                                <AvatarFallback className="text-xs">
                                  {activity.contactName ? 
                                    getInitials(activity.contactName) : 
                                    (activity.companyName ? getInitials(activity.companyName) : '??')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs line-clamp-1">
                                {activity.contactName || activity.companyName}
                              </span>
                            </div>
                          )}
                          
                          {activity.type === 'task' && (
                            <Badge variant={activity.completed ? "default" : "secondary"} className="ml-auto text-xs">
                              {activity.completed ? 
                                (language === 'de' ? 'Erledigt' : 'Completed') : 
                                (language === 'de' ? 'Ausstehend' : 'Pending')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {!limit && activities.length >= 5 && (
                  <div className="mt-4 text-center">
                    <Button variant="ghost" size="sm">
                      {language === 'de' ? 'Mehr laden' : 'Load more'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar" className="m-0">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">
              {language === 'de' ? 'Kalenderansicht' : 'Calendar View'}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              {language === 'de' 
                ? 'Die Kalenderansicht wird in einer kommenden Version verfügbar sein. Sie können dann Aktivitäten in einem Kalenderformat anzeigen.' 
                : 'Calendar view will be available in an upcoming version. You will be able to view activities in a calendar format.'}
            </p>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default ActivityHistory;
