
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Building, Star, StarOff, Filter, Users, PhoneCall, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CompanyDetailView from './CompanyDetailView';
import { useCompanies, Company, CompanyType } from '@/hooks/use-crm-data';
import { Skeleton } from '@/components/ui/skeleton';

const CompanyManager: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { companies, loading, updateCompany } = useCompanies();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  
  // Get selected company
  const selectedCompany = companies.find(c => c.id === selectedCompanyId);
  
  // Filter companies based on search term and filters
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (company.phone && company.phone.includes(searchTerm)) ||
                        (company.address && company.address.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || company.type === typeFilter;
    const matchesFavorite = !showFavoritesOnly || company.favorite;
    
    return matchesSearch && matchesType && matchesFavorite;
  });

  const toggleFavorite = async (id: string) => {
    const company = companies.find(c => c.id === id);
    if (company) {
      const result = await updateCompany(id, { favorite: !company.favorite });
      
      if (result) {
        toast({
          title: company.favorite ? 
            (language === 'de' ? 'Von Favoriten entfernt' : 'Removed from favorites') : 
            (language === 'de' ? 'Zu Favoriten hinzugefügt' : 'Added to favorites'),
          description: company.name,
        });
      }
    }
  };

  const initiateCall = (company: Company) => {
    toast({
      title: language === 'de' ? 'Anruf wird gestartet' : 'Initiating call',
      description: `${company.name}: ${company.phone || ''}`,
    });
    // In a real implementation, this would integrate with a call API
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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

  // If a company is selected, show its detail view
  if (selectedCompany) {
    return <CompanyDetailView company={selectedCompany} onBack={() => setSelectedCompanyId(null)} />;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">
          {language === 'de' ? 'Firmenverzeichnis' : 'Company Directory'}
        </CardTitle>
        <CardDescription>
          {language === 'de' ? 'Verwalten Sie Ihre Geschäftskontakte' : 'Manage your business relationships'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={language === 'de' ? 'Suche nach Namen, Adresse oder Telefonnummer...' : 'Search by name, address or phone number...'}
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={language === 'de' ? 'Typ' : 'Type'} />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'de' ? 'Alle Typen' : 'All Types'}</SelectItem>
                <SelectItem value="agency">{getTypeLabel('agency')}</SelectItem>
                <SelectItem value="investment_firm">{getTypeLabel('investment_firm')}</SelectItem>
                <SelectItem value="property_manager">{getTypeLabel('property_manager')}</SelectItem>
                <SelectItem value="construction">{getTypeLabel('construction')}</SelectItem>
                <SelectItem value="other">{getTypeLabel('other')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant={showFavoritesOnly ? "default" : "outline"} 
              size="icon"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              title={language === 'de' ? 'Nur Favoriten anzeigen' : 'Show favorites only'}
            >
              <Star className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-4">
              {Array.from({length: 3}).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCompanies.length > 0 ? (
            <div className="divide-y">
              {filteredCompanies.map((company) => (
                <div 
                  key={company.id} 
                  className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedCompanyId(company.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(company.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{company.name}</div>
                        <div className="text-sm text-muted-foreground">{company.phone || ''}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={`${getBadgeColor(company.type as CompanyType)} text-white`}
                      >
                        {getTypeLabel(company.type as CompanyType)}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(company.id);
                        }}
                        title={language === 'de' ? 'Favorit umschalten' : 'Toggle favorite'}
                      >
                        {company.favorite ? (
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <StarOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          initiateCall(company);
                        }}
                        disabled={!company.phone}
                        title={language === 'de' ? 'Anrufen' : 'Call'}
                      >
                        <PhoneCall className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                  </div>
                  {(company.address || company.notes) && (
                    <div className="ml-12 mt-1 text-sm text-muted-foreground">
                      {company.address && <div>{company.address}</div>}
                      {company.notes && <div className="mt-1">{company.notes}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Building className="h-12 w-12 mx-auto text-muted-foreground opacity-30" />
              <h3 className="mt-2 text-lg font-medium">
                {language === 'de' ? 'Keine Unternehmen gefunden' : 'No companies found'}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {language === 'de' 
                  ? 'Versuchen Sie, Ihre Filterkriterien anzupassen' 
                  : 'Try adjusting your search filters'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto" onClick={() => toast({
          title: language === 'de' ? 'Kommt bald' : 'Coming soon',
          description: language === 'de' ? 'Diese Funktion wird bald verfügbar sein' : 'This feature will be available soon'
        })}>
          <Plus className="h-4 w-4 mr-2" />
          {language === 'de' ? 'Neues Unternehmen hinzufügen' : 'Add New Company'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompanyManager;
