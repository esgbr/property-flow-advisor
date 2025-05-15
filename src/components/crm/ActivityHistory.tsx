
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, Calendar, MessageSquare, History, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useActivities, Activity as ActivityType, useContacts, useCompanies } from '@/hooks/use-crm-data';
import { formatDate } from '@/utils/crmUtils';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export interface ActivityHistoryProps {
  companyId?: string;
  contactId?: string;
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ companyId, contactId }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { activities, loading } = useActivities();
  const { contacts } = useContacts();
  const { companies } = useCompanies();
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  
  // Filter activities based on company or contact
  const filteredActivities = activities.filter(activity => {
    if (companyId && activity.company_id === companyId) return true;
    if (contactId && activity.contact_id === contactId) return true;
    if (!companyId && !contactId) return true; // Show all if no filter
    return false;
  });
  
  // Sort by date (newest first)
  const sortedActivities = [...filteredActivities].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getActivityIcon = (type: ActivityType['type']) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'note': return <MessageSquare className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityType['type']) => {
    switch (type) {
      case 'call': return 'bg-blue-100 text-blue-600';
      case 'email': return 'bg-purple-100 text-purple-600';
      case 'meeting': return 'bg-green-100 text-green-600';
      case 'note': return 'bg-amber-100 text-amber-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getContactName = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    return contact ? contact.name : id;
  };

  const getCompanyName = (id: string) => {
    const company = companies.find(c => c.id === id);
    return company ? company.name : id;
  };

  const handleAddActivity = () => {
    setIsAddingActivity(true);
    
    // In a real implementation, this would open a modal or form
    setTimeout(() => {
      setIsAddingActivity(false);
      toast({
        title: language === 'de' ? 'Kommt bald' : 'Coming soon',
        description: language === 'de' ? 'Diese Funktion wird bald verfügbar sein' : 'This feature will be available soon'
      });
    }, 1000);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg">
            {language === 'de' ? 'Aktivitätsverlauf' : 'Activity History'}
          </h3>
          <Button 
            size="sm" 
            onClick={handleAddActivity}
            disabled={isAddingActivity}
          >
            {isAddingActivity ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {language === 'de' ? 'Hinzufügen' : 'Add'}
          </Button>
        </div>
        
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedActivities.length > 0 ? (
          <div className="space-y-4">
            {sortedActivities.map(activity => (
              <div key={activity.id} className="flex gap-3">
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)} h-fit`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(activity.date, language)}
                  </p>
                  {activity.description && (
                    <p className="text-sm mt-1">{activity.description}</p>
                  )}
                  
                  {/* Show related contact/company if available */}
                  <div className="text-xs text-muted-foreground mt-1">
                    {activity.contact_id && (
                      <span className="mr-2">
                        {language === 'de' ? 'Kontakt: ' : 'Contact: '}
                        {getContactName(activity.contact_id)}
                      </span>
                    )}
                    {activity.company_id && (
                      <span>
                        {language === 'de' ? 'Unternehmen: ' : 'Company: '}
                        {getCompanyName(activity.company_id)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-muted-foreground opacity-30 mx-auto" />
            <h3 className="mt-2 font-medium">
              {language === 'de' ? 'Keine Aktivitäten gefunden' : 'No activities found'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'de' 
                ? 'Es wurden noch keine Aktivitäten aufgezeichnet' 
                : 'No activities have been recorded yet'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityHistory;
