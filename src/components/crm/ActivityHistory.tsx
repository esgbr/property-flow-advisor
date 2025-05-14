
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { PlusCircle, Filter, Check, Clock, PhoneCall, Mail, Calendar, MessageSquare, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task';

export interface Activity {
  id: string;
  contactId: string;
  companyId?: string;
  type: ActivityType;
  title: string;
  description?: string;
  date: Date;
  createdBy: string;
}

// Demo activity data
const demoActivities: Activity[] = [
  {
    id: '1',
    contactId: '1',
    companyId: 'c1',
    type: 'call',
    title: 'Initial consultation call',
    description: 'Discussed property requirements in Berlin.',
    date: new Date(2025, 4, 10, 14, 30),
    createdBy: 'John Doe'
  },
  {
    id: '2',
    contactId: '1',
    companyId: 'c1',
    type: 'meeting',
    title: 'Property viewing',
    description: 'Met at Alexanderplatz apartment. Client showed interest in 2nd floor unit.',
    date: new Date(2025, 4, 12, 10, 0),
    createdBy: 'John Doe'
  },
  {
    id: '3',
    contactId: '2',
    type: 'email',
    title: 'Quote for plumbing work',
    description: 'Sent detailed quote for repair work at Frankfurt property.',
    date: new Date(2025, 4, 8, 9, 15),
    createdBy: 'John Doe'
  },
  {
    id: '4',
    contactId: '3',
    companyId: 'c2',
    type: 'note',
    title: 'Management contract renewal',
    description: 'Need to follow up about renewing the management contract next month.',
    date: new Date(2025, 4, 5, 16, 45),
    createdBy: 'John Doe'
  }
];

interface ActivityHistoryProps {
  contactId?: string;
  companyId?: string;
  className?: string;
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ contactId, companyId, className }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>(demoActivities);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    type: 'note',
    title: '',
    description: '',
  });
  const [filterType, setFilterType] = useState<ActivityType | 'all'>('all');

  // Filter activities based on contactId, companyId, and activity type
  const filteredActivities = activities.filter(activity => {
    const matchesContact = !contactId || activity.contactId === contactId;
    const matchesCompany = !companyId || activity.companyId === companyId;
    const matchesType = filterType === 'all' || activity.type === filterType;
    return matchesContact && matchesCompany && matchesType;
  });

  // Sort activities by date (newest first)
  const sortedActivities = [...filteredActivities].sort((a, b) => 
    b.date.getTime() - a.date.getTime()
  );

  const handleAddActivity = () => {
    if (!newActivity.title) {
      toast({
        title: language === 'de' ? 'Fehler' : 'Error',
        description: language === 'de' ? 'Bitte geben Sie einen Titel ein' : 'Please enter a title',
        variant: 'destructive'
      });
      return;
    }

    const activity: Activity = {
      id: Date.now().toString(),
      contactId: contactId || '',
      companyId: companyId,
      type: newActivity.type as ActivityType,
      title: newActivity.title,
      description: newActivity.description,
      date: new Date(),
      createdBy: 'Current User'
    };

    setActivities([...activities, activity]);
    setNewActivity({
      type: 'note',
      title: '',
      description: ''
    });
    setShowAddForm(false);

    toast({
      title: language === 'de' ? 'Aktivität hinzugefügt' : 'Activity added',
      description: activity.title
    });
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'call': return <PhoneCall className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'note': return <FileText className="h-4 w-4" />;
      case 'task': return <Check className="h-4 w-4" />;
    }
  };

  const getActivityTypeLabel = (type: ActivityType): string => {
    if (language === 'de') {
      const germanLabels: Record<ActivityType, string> = {
        call: 'Anruf',
        email: 'E-Mail',
        meeting: 'Termin',
        note: 'Notiz',
        task: 'Aufgabe'
      };
      return germanLabels[type];
    } else {
      const englishLabels: Record<ActivityType, string> = {
        call: 'Call',
        email: 'Email',
        meeting: 'Meeting',
        note: 'Note',
        task: 'Task'
      };
      return englishLabels[type];
    }
  };

  const getActivityColor = (type: ActivityType): string => {
    switch (type) {
      case 'call': return 'bg-blue-500';
      case 'email': return 'bg-purple-500';
      case 'meeting': return 'bg-green-500';
      case 'note': return 'bg-amber-500';
      case 'task': return 'bg-rose-500';
    }
  };

  const formatDate = (date: Date): string => {
    return formatDistanceToNow(date, { 
      addSuffix: true,
      locale: language === 'de' ? de : undefined
    });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">
              {language === 'de' ? 'Aktivitätsverlauf' : 'Activity History'}
            </CardTitle>
            <CardDescription>
              {language === 'de' ? 'Verfolgen Sie Interaktionen und Notizen' : 'Track interactions and notes'}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Aktivität' : 'Activity'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="p-4 mb-4 bg-muted/50 rounded-md space-y-3">
            <h3 className="font-medium mb-2">
              {language === 'de' ? 'Neue Aktivität hinzufügen' : 'Add New Activity'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Select 
                  value={newActivity.type} 
                  onValueChange={(value: ActivityType) => setNewActivity({...newActivity, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'de' ? 'Typ auswählen' : 'Select type'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">{getActivityTypeLabel('call')}</SelectItem>
                    <SelectItem value="email">{getActivityTypeLabel('email')}</SelectItem>
                    <SelectItem value="meeting">{getActivityTypeLabel('meeting')}</SelectItem>
                    <SelectItem value="note">{getActivityTypeLabel('note')}</SelectItem>
                    <SelectItem value="task">{getActivityTypeLabel('task')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input 
                  placeholder={language === 'de' ? 'Titel' : 'Title'} 
                  value={newActivity.title} 
                  onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Textarea 
                placeholder={language === 'de' ? 'Beschreibung (optional)' : 'Description (optional)'} 
                rows={3}
                value={newActivity.description || ''} 
                onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                {language === 'de' ? 'Abbrechen' : 'Cancel'}
              </Button>
              <Button size="sm" onClick={handleAddActivity}>
                {language === 'de' ? 'Hinzufügen' : 'Add'}
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center mb-4">
          <div className="relative flex-grow">
            <Select 
              value={filterType} 
              onValueChange={(value: ActivityType | 'all') => setFilterType(value)}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={language === 'de' ? 'Alle Aktivitäten' : 'All Activities'} />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'de' ? 'Alle Typen' : 'All Types'}</SelectItem>
                <SelectItem value="call">{getActivityTypeLabel('call')}</SelectItem>
                <SelectItem value="email">{getActivityTypeLabel('email')}</SelectItem>
                <SelectItem value="meeting">{getActivityTypeLabel('meeting')}</SelectItem>
                <SelectItem value="note">{getActivityTypeLabel('note')}</SelectItem>
                <SelectItem value="task">{getActivityTypeLabel('task')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {sortedActivities.length > 0 ? (
          <div className="space-y-4">
            {sortedActivities.map((activity) => (
              <div key={activity.id} className="p-3 border rounded-md hover:bg-muted/50 transition-colors relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <Badge 
                      variant="outline" 
                      className={`${getActivityColor(activity.type)} text-white mr-3 mt-1`}
                    >
                      {getActivityIcon(activity.type)}
                    </Badge>
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(activity.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-30" />
            <h3 className="mt-2 text-lg font-medium">
              {language === 'de' ? 'Keine Aktivitäten gefunden' : 'No activities found'}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {language === 'de' 
                ? 'Fügen Sie eine neue Aktivität hinzu, um sie hier anzuzeigen' 
                : 'Add a new activity to see it here'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityHistory;
