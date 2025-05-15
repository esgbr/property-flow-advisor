
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Phone, Mail, Calendar, FileText, History, Search, Plus, CalendarDays, 
  Building, User, ChevronDown, ChevronUp, Loader2 
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, 
  DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useActivities, ActivityType, Activity } from '@/hooks/use-crm-data';
import { Skeleton } from '@/components/ui/skeleton';

interface ActivityHistoryProps {
  contactId?: string;
  companyId?: string;
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ contactId, companyId }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { activities, loading, addActivity } = useActivities();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedActivities, setExpandedActivities] = useState<Record<string, boolean>>({});
  
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    type: 'note' as ActivityType,
    title: '',
    description: '',
    date: new Date().toISOString(),
    contact_id: contactId,
    company_id: companyId
  });

  const toggleExpanded = (id: string) => {
    setExpandedActivities(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddActivity = async () => {
    if (!newActivity.title) {
      toast({
        variant: 'destructive',
        title: language === 'de' ? 'Titel erforderlich' : 'Title required',
        description: language === 'de' 
          ? 'Bitte geben Sie einen Titel für die Aktivität ein' 
          : 'Please enter a title for the activity'
      });
      return;
    }

    const result = await addActivity(newActivity as Omit<Activity, 'id'>);
    
    if (result) {
      setNewActivity({
        type: 'note' as ActivityType,
        title: '',
        description: '',
        date: new Date().toISOString(),
        contact_id: contactId,
        company_id: companyId
      });
      setIsDialogOpen(false);

      toast({
        title: language === 'de' ? 'Aktivität hinzugefügt' : 'Activity added',
        description: language === 'de'
          ? 'Die Aktivität wurde erfolgreich gespeichert'
          : 'The activity has been successfully saved'
      });
    }
  };
  
  const filteredActivities = activities.filter(activity => {
    // Filter by contact_id or company_id if provided
    if (contactId && activity.contact_id !== contactId) return false;
    if (companyId && activity.company_id !== companyId) return false;
    
    // Filter by search term
    return activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (activity.description && activity.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return language === 'de'
        ? format(date, 'PPP HH:mm', { locale: de })
        : format(date, 'PPP h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'call': return <Phone className="h-5 w-5 text-blue-500" />;
      case 'email': return <Mail className="h-5 w-5 text-green-500" />;
      case 'meeting': return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'note': return <FileText className="h-5 w-5 text-amber-500" />;
      case 'task': return <History className="h-5 w-5 text-red-500" />;
      default: return <History className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityTypeLabel = (type: ActivityType): string => {
    if (language === 'de') {
      const germanLabels: Record<ActivityType, string> = {
        call: 'Anruf',
        email: 'E-Mail',
        meeting: 'Besprechung',
        note: 'Notiz',
        task: 'Aufgabe',
        other: 'Andere'
      };
      return germanLabels[type];
    } else {
      const englishLabels: Record<ActivityType, string> = {
        call: 'Call',
        email: 'Email',
        meeting: 'Meeting',
        note: 'Note',
        task: 'Task',
        other: 'Other'
      };
      return englishLabels[type];
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{language === 'de' ? 'Aktivitätsverlauf' : 'Activity History'}</span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                {language === 'de' ? 'Neue Aktivität' : 'New Activity'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {language === 'de' ? 'Neue Aktivität hinzufügen' : 'Add New Activity'}
                </DialogTitle>
                <DialogDescription>
                  {language === 'de' 
                    ? 'Protokollieren Sie eine neue Aktivität für Ihr CRM-System.' 
                    : 'Log a new activity for your CRM system.'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {language === 'de' ? 'Aktivitätstyp' : 'Activity Type'}
                    </label>
                    <Select
                      value={newActivity.type}
                      onValueChange={(value) => setNewActivity({...newActivity, type: value as ActivityType})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'de' ? 'Typ wählen' : 'Select type'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">{language === 'de' ? 'Anruf' : 'Call'}</SelectItem>
                        <SelectItem value="email">{language === 'de' ? 'E-Mail' : 'Email'}</SelectItem>
                        <SelectItem value="meeting">{language === 'de' ? 'Besprechung' : 'Meeting'}</SelectItem>
                        <SelectItem value="note">{language === 'de' ? 'Notiz' : 'Note'}</SelectItem>
                        <SelectItem value="task">{language === 'de' ? 'Aufgabe' : 'Task'}</SelectItem>
                        <SelectItem value="other">{language === 'de' ? 'Andere' : 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {language === 'de' ? 'Datum' : 'Date'}
                    </label>
                    <Input
                      type="datetime-local"
                      value={new Date(newActivity.date || '').toISOString().slice(0, 16)}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        setNewActivity({...newActivity, date: newDate.toISOString()});
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'de' ? 'Titel' : 'Title'}
                  </label>
                  <Input
                    placeholder={language === 'de' ? 'Titel der Aktivität' : 'Activity title'}
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'de' ? 'Beschreibung' : 'Description'}
                  </label>
                  <Textarea
                    placeholder={language === 'de' ? 'Details zur Aktivität' : 'Activity details'}
                    rows={4}
                    value={newActivity.description || ''}
                    onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {language === 'de' ? 'Abbrechen' : 'Cancel'}
                </Button>
                <Button onClick={handleAddActivity}>
                  {language === 'de' ? 'Hinzufügen' : 'Add Activity'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          {contactId || companyId 
            ? (language === 'de' ? 'Aktivitäten und Interaktionen' : 'Activities and interactions') 
            : (language === 'de' ? 'Alle Aktivitäten im System' : 'All activities in the system')}
        </CardDescription>
        
        <div className="relative mb-2 mt-2">
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={language === 'de' ? 'Aktivitäten durchsuchen...' : 'Search activities...'}
            className="pl-9"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {Array.from({length: 3}).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <Skeleton className="h-6 w-6 rounded-full mr-3" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredActivities.length > 0 ? (
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const isExpanded = expandedActivities[activity.id];
              
              return (
                <div 
                  key={activity.id} 
                  className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getActivityIcon(activity.type as ActivityType)}
                      <span className="ml-3 font-medium">{activity.title}</span>
                    </div>
                    <Badge variant="outline">
                      {getActivityTypeLabel(activity.type as ActivityType)}
                    </Badge>
                  </div>
                  
                  {activity.description && (
                    <>
                      {isExpanded ? (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      ) : (
                        activity.description.length > 100 && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {activity.description.substring(0, 100)}...
                          </p>
                        )
                      )}
                    </>
                  )}
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span>{formatDate(activity.date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {activity.description && activity.description.length > 100 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleExpanded(activity.id)}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              {language === 'de' ? 'Weniger anzeigen' : 'Show less'}
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              {language === 'de' ? 'Mehr anzeigen' : 'Show more'}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <History className="h-12 w-12 text-muted-foreground opacity-30" />
            <h3 className="mt-4 text-lg font-medium">
              {language === 'de' ? 'Keine Aktivitäten gefunden' : 'No activities found'}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm text-center">
              {searchTerm 
                ? (language === 'de' 
                    ? `Es wurden keine Aktivitäten für "${searchTerm}" gefunden.` 
                    : `No activities found matching "${searchTerm}".`) 
                : (language === 'de'
                    ? 'Es wurden noch keine Aktivitäten aufgezeichnet. Fügen Sie eine hinzu, um zu beginnen.'
                    : 'No activities have been recorded yet. Add one to get started.')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityHistory;
