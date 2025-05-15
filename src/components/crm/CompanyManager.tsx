
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useCompanies, Company } from '@/hooks/use-crm-data';
import FilterBar from './shared/FilterBar';
import CompanyList from './company/CompanyList';
import CompanyDetailView from './CompanyDetailView';

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

  const filterOptions = [
    { value: 'all', label: language === 'de' ? 'Alle Typen' : 'All Types' },
    { value: 'agency', label: language === 'de' ? 'Immobilienagentur' : 'Real Estate Agency' },
    { value: 'investment_firm', label: language === 'de' ? 'Investmentfirma' : 'Investment Firm' },
    { value: 'property_manager', label: language === 'de' ? 'Hausverwaltung' : 'Property Manager' },
    { value: 'construction', label: language === 'de' ? 'Bauunternehmen' : 'Construction' },
    { value: 'other', label: language === 'de' ? 'Sonstige' : 'Other' }
  ];

  // If a company is selected, show its detail view
  if (selectedCompany) {
    return <CompanyDetailView company={selectedCompany} onBack={() => setSelectedCompanyId(null)} />;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl animate-fade-in">
          {language === 'de' ? 'Firmenverzeichnis' : 'Company Directory'}
        </CardTitle>
        <CardDescription>
          {language === 'de' ? 'Verwalten Sie Ihre Geschäftskontakte' : 'Manage your business relationships'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          filterOptions={filterOptions}
          showFavoritesOnly={showFavoritesOnly}
          onFavoritesToggle={() => setShowFavoritesOnly(!showFavoritesOnly)}
          searchPlaceholder={language === 'de' 
            ? 'Suche nach Namen, Adresse oder Telefonnummer...' 
            : 'Search by name, address or phone number...'}
        />

        <div className="border rounded-md overflow-hidden">
          <CompanyList
            companies={filteredCompanies}
            loading={loading}
            onCompanyClick={setSelectedCompanyId}
            onFavoriteToggle={toggleFavorite}
            initiateCall={initiateCall}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto transition-transform hover:scale-105" onClick={() => toast({
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
