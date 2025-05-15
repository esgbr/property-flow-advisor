
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, MapPin, Phone, Mail, Star, StarOff, Calendar, Edit } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActivityHistory from './ActivityHistory';
import TaskManager from './TaskManager';
import { Company, CompanyType, useCompanies } from '@/hooks/use-crm-data';

interface CompanyDetailViewProps {
  company: Company;
  onBack: () => void;
}

const CompanyDetailView: React.FC<CompanyDetailViewProps> = ({ company, onBack }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { updateCompany } = useCompanies();

  const toggleFavorite = async () => {
    const result = await updateCompany(company.id, { favorite: !company.favorite });
    
    if (result) {
      toast({
        title: company.favorite ? 
          (language === 'de' ? 'Von Favoriten entfernt' : 'Removed from favorites') : 
          (language === 'de' ? 'Zu Favoriten hinzugefügt' : 'Added to favorites'),
        description: company.name,
      });
    }
  };

  const getTypeLabel = (type: CompanyType): string => {
    if (language === 'de') {
      const germanLabels: Record<CompanyType, string> = {
        agency: 'Immobilienagentur',
        investment_firm: 'Investmentfirma',
        property_manager: 'Hausverwaltung',
        construction: 'Bauunternehmen',
        other: 'Sonstige'
      };
      return germanLabels[type];
    } else {
      const englishLabels: Record<CompanyType, string> = {
        agency: 'Real Estate Agency',
        investment_firm: 'Investment Firm',
        property_manager: 'Property Manager',
        construction: 'Construction',
        other: 'Other'
      };
      return englishLabels[type];
    }
  };

  const getBadgeColor = (type: CompanyType): string => {
    switch (type) {
      case 'agency': return 'bg-blue-500';
      case 'investment_firm': return 'bg-purple-500';
      case 'property_manager': return 'bg-green-500';
      case 'construction': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Zurück' : 'Back'}
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleFavorite}
            >
              {company.favorite ? (
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => toast({
                title: language === 'de' ? 'Kommt bald' : 'Coming soon',
                description: language === 'de' ? 'Bearbeitungsfunktion wird bald verfügbar sein' : 'Edit functionality will be available soon'
              })}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <CardTitle className="text-2xl flex items-center gap-2">
          <Building className="h-6 w-6 text-primary" />
          {company.name}
        </CardTitle>
        
        <div className="flex flex-wrap gap-2 mt-1">
          <Badge 
            variant="outline" 
            className={`${getBadgeColor(company.type)} text-white`}
          >
            {getTypeLabel(company.type)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {company.address && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{company.address}</span>
            </div>
          )}
          
          {company.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{company.phone}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {language === 'de' ? 'Erstellt am: ' : 'Created: '}
              {new Date(company.created_at || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {company.notes && (
          <div className="border-t pt-2 mt-2">
            <h3 className="text-sm font-medium mb-1">
              {language === 'de' ? 'Notizen' : 'Notes'}
            </h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{company.notes}</p>
          </div>
        )}
        
        <Tabs defaultValue="activities" className="mt-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="activities">
              {language === 'de' ? 'Aktivitäten' : 'Activities'}
            </TabsTrigger>
            <TabsTrigger value="tasks">
              {language === 'de' ? 'Aufgaben' : 'Tasks'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="activities" className="mt-4">
            <ActivityHistory 
              companyId={company.id} 
              contactId={undefined}
              companyName={company.name}
              contactName={undefined}
            />
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-4">
            <TaskManager 
              companyId={company.id}
              contactId={undefined}
              companyName={company.name}
              contactName={undefined}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CompanyDetailView;
