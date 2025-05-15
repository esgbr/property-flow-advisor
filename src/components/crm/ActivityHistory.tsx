
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Phone, Mail, Calendar, MessageSquare, History, 
  Plus, Loader2, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useActivities, Activity } from '@/hooks/use-crm-data';
import { formatDate } from '@/utils/crmUtils';
import EmptyState from './shared/EmptyState';

export interface ActivityHistoryProps {
  companyId?: string;
  contactId?: string;
  companyName?: string;
  contactName?: string;
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ 
  companyId, 
  contactId,
  companyName,
  contactName
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { activities, loading, refreshActivities } = useActivities();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  
  // Filter activities based on company or contact
  const filteredActivities = activities.filter(activity => {
    // Filter by entity if specified
    const matchesEntity = 
      (companyId && activity.company_id === companyId) ||
      (contactId && activity.contact_id === contactId) ||
      (!companyId && !contactId); // Show all if no filter
    
    // Filter by type if specified  
    const matchesType = filter === 'all' || activity.type === filter;
    
    return matchesEntity && matchesType;
  });
  
  // Sort by date (newest first)
  const sortedActivities = [...filteredActivities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshActivities();
    setIsRefreshing(false);
    
    toast({
      title: language === 'de' ? 'Aktivitäten aktualisiert' : 'Activities refreshed'
    });
  };
  
  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'note': return <MessageSquare className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };
  
  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-green-100 text-green-600 border-green-200';
      case 'email': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'meeting': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'note': return 'bg-amber-100 text-amber-600 border-amber-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };
  
  const getActivityTypeLabel = (type: string) => {
    if (language === 'de') {
      const germanLabels: Record<string, string> = {
        call: 'Anruf',
        email: 'E-Mail',
        meeting: 'Meeting',
        note: 'Notiz',
        task: 'Aufgabe',
        other: 'Sonstige'
      };
      return germanLabels[type] || type;
    } else {
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      return capitalizedType;
    }
  };
  
  const renderActivityItem = (activity: Activity) => {
    return (
      <div key={activity.id} className="p-3 hover:bg-muted/50 transition-colors rounded-md animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Badge className={`flex items-center gap-1 ${getActivityBadgeColor(activity.type)}`}>
              {getActivityTypeIcon(activity.type)}
              <span>{getActivityTypeLabel(activity.type)}</span>
            </Badge>
            <span className="ml-2 text-sm text-muted-foreground">
              {formatDate(activity.date, language)}
            </span>
          </div>
        </div>
        
        <div className="mt-2">
          <h4 className="text-sm font-medium">{activity.title}</h4>
          {activity.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {activity.description}
            </p>
          )}
        </div>
        
        {(activity.contact_id && contactName) && (
          <div className="mt-1 text-xs text-muted-foreground">
            {language === 'de' ? 'Kontakt: ' : 'Contact: '}{contactName}
          </div>
        )}
        
        {(activity.company_id && companyName) && (
          <div className="mt-1 text-xs text-muted-foreground">
            {language === 'de' ? 'Unternehmen: ' : 'Company: '}{companyName}
          </div>
        )}
      </div>
    );
  };
  
  const handleAddActivity = () => {
    toast({
      title: language === 'de' ? 'Kommt bald' : 'Coming soon',
      description: language === 'de' 
        ? 'Diese Funktion wird bald verfügbar sein' 
        : 'This feature will be available soon'
    });
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg">
            {language === 'de' ? 'Aktivitäten' : 'Activities'}
          </h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="transition-transform hover:scale-105"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {language === 'de' ? 'Aktualisieren' : 'Refresh'}
            </Button>
            <Button 
              size="sm" 
              onClick={handleAddActivity}
              className="transition-transform hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Hinzufügen' : 'Add'}
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">{language === 'de' ? 'Alle' : 'All'}</TabsTrigger>
            <TabsTrigger value="call">{language === 'de' ? 'Anrufe' : 'Calls'}</TabsTrigger>
            <TabsTrigger value="email">{language === 'de' ? 'E-Mails' : 'Emails'}</TabsTrigger>
            <TabsTrigger value="meeting">{language === 'de' ? 'Meetings' : 'Meetings'}</TabsTrigger>
            <TabsTrigger value="note">{language === 'de' ? 'Notizen' : 'Notes'}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-1">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sortedActivities.length > 0 ? (
              sortedActivities.map(renderActivityItem)
            ) : (
              <EmptyState
                icon={History}
                title={language === 'de' ? 'Keine Aktivitäten gefunden' : 'No activities found'}
                description={language === 'de' 
                  ? 'Es wurden noch keine Aktivitäten erfasst' 
                  : 'No activities have been recorded yet'}
              />
            )}
          </TabsContent>
          
          <TabsContent value="call" className="space-y-1">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sortedActivities.length > 0 ? (
              sortedActivities.map(renderActivityItem)
            ) : (
              <EmptyState
                icon={Phone}
                title={language === 'de' ? 'Keine Anrufe gefunden' : 'No calls found'}
                description={language === 'de' 
                  ? 'Es wurden noch keine Anrufe erfasst' 
                  : 'No calls have been recorded yet'}
              />
            )}
          </TabsContent>
          
          <TabsContent value="email" className="space-y-1">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sortedActivities.length > 0 ? (
              sortedActivities.map(renderActivityItem)
            ) : (
              <EmptyState
                icon={Mail}
                title={language === 'de' ? 'Keine E-Mails gefunden' : 'No emails found'}
                description={language === 'de' 
                  ? 'Es wurden noch keine E-Mails erfasst' 
                  : 'No emails have been recorded yet'}
              />
            )}
          </TabsContent>
          
          <TabsContent value="meeting" className="space-y-1">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sortedActivities.length > 0 ? (
              sortedActivities.map(renderActivityItem)
            ) : (
              <EmptyState
                icon={Calendar}
                title={language === 'de' ? 'Keine Meetings gefunden' : 'No meetings found'}
                description={language === 'de' 
                  ? 'Es wurden noch keine Meetings erfasst' 
                  : 'No meetings have been recorded yet'}
              />
            )}
          </TabsContent>
          
          <TabsContent value="note" className="space-y-1">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sortedActivities.length > 0 ? (
              sortedActivities.map(renderActivityItem)
            ) : (
              <EmptyState
                icon={MessageSquare}
                title={language === 'de' ? 'Keine Notizen gefunden' : 'No notes found'}
                description={language === 'de' 
                  ? 'Es wurden noch keine Notizen erfasst' 
                  : 'No notes have been recorded yet'}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivityHistory;
