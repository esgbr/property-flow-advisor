
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, MapPin, Phone, Mail, Star, StarOff, Calendar, Edit, File } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActivityHistory from './ActivityHistory';
import TaskManager from './TaskManager';
import DocumentList from './documents/DocumentList';
import DocumentUploader from './documents/DocumentUploader';
import { Company, CompanyType, useCompanies } from '@/hooks/use-crm-data';
import { getCompanyTypeLabel, getCompanyBadgeColor, formatDate } from '@/utils/crmUtils';

interface CompanyDetailViewProps {
  company: Company;
  onBack: () => void;
}

const CompanyDetailView: React.FC<CompanyDetailViewProps> = ({ company, onBack }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { updateCompany } = useCompanies();
  const [activeTab, setActiveTab] = useState('activities');

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
              onClick={toggleFavorite}
              className="transition-transform hover:scale-110"
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
              className="transition-transform hover:scale-110"
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
            className={getCompanyBadgeColor(company.type as CompanyType)}
          >
            {getCompanyTypeLabel(company.type as CompanyType, language)}
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
              {formatDate(company.created_at || new Date().toISOString(), language)}
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
          
          <TabsContent value="documents" className="mt-4 space-y-4">
            <DocumentUploader 
              entityId={company.id}
              entityType="company"
            />
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-3">
                {language === 'de' ? 'Vorhandene Dokumente' : 'Existing Documents'}
              </h3>
              <DocumentList
                entityId={company.id}
                entityType="company"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CompanyDetailView;
