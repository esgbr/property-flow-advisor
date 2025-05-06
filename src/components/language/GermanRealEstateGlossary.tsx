
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { GermanRealEstateTermTooltip } from './GermanLanguageSupport';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface GlossaryTerm {
  german: string;
  english: string;
  description: string;
  category: 'financing' | 'legal' | 'property' | 'tax' | 'investment';
}

// Comprehensive German real estate terminology glossary
const glossaryTerms: GlossaryTerm[] = [
  {
    german: 'Grunderwerbsteuer',
    english: 'Real Estate Transfer Tax',
    description: 'Tax levied on property purchases in Germany, varying by federal state (3.5%-6.5%).',
    category: 'tax'
  },
  {
    german: 'Grundbuch',
    english: 'Land Registry',
    description: 'Official register containing ownership information for real estate properties.',
    category: 'legal'
  },
  {
    german: 'Beleihungswert',
    english: 'Mortgage Lending Value',
    description: 'Estimated value of a property for mortgage lending purposes.',
    category: 'financing'
  },
  {
    german: 'Mietrendite',
    english: 'Rental Yield',
    description: 'Annual rental income as a percentage of the property purchase price.',
    category: 'investment'
  },
  {
    german: 'Hausgeld',
    english: 'Condominium Fee',
    description: 'Regular payment made by property owners for maintenance and management of common areas.',
    category: 'property'
  },
  {
    german: 'Immobilienfinanzierung',
    english: 'Real Estate Financing',
    description: 'Methods and processes of funding real estate purchases.',
    category: 'financing'
  },
  {
    german: 'Tilgungsplan',
    english: 'Amortization Schedule',
    description: 'Timeline showing the repayment of a loan over time.',
    category: 'financing'
  },
  {
    german: 'Wohnungseigentumsgesetz (WEG)',
    english: 'Condominium Act',
    description: 'German law governing condominium ownership and management.',
    category: 'legal'
  },
  {
    german: 'Maklergebühr',
    english: 'Real Estate Agent Fee',
    description: 'Commission paid to a real estate agent for their services.',
    category: 'property'
  },
  {
    german: 'Notarkosten',
    english: 'Notary Fees',
    description: 'Fees paid to a notary for legally formalizing property transactions.',
    category: 'legal'
  },
  {
    german: 'Abschreibung (AfA)',
    english: 'Depreciation',
    description: 'Tax deduction for the wear and tear of investment properties over time.',
    category: 'tax'
  },
  {
    german: 'Eigentümergemeinschaft',
    english: 'Homeowners Association',
    description: 'Community of property owners who jointly manage a property complex.',
    category: 'property'
  }
];

const GermanRealEstateGlossary: React.FC = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredTerms, setFilteredTerms] = React.useState(glossaryTerms);

  // Filter terms based on search input
  React.useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTerms(glossaryTerms);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = glossaryTerms.filter(term => 
        term.german.toLowerCase().includes(lowercaseSearch) || 
        term.english.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredTerms(filtered);
    }
  }, [searchTerm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'de' ? 'Immobilien-Fachbegriffe' : 'German Real Estate Terminology'}
        </CardTitle>
        <CardDescription>
          {language === 'de' 
            ? 'Wichtige Fachbegriffe für deutsche Immobilieninvestitionen' 
            : 'Essential terminology for German real estate investments'}
        </CardDescription>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={language === 'de' ? 'Begriff suchen...' : 'Search terms...'}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              {language === 'de' ? 'Alle' : 'All'}
            </TabsTrigger>
            <TabsTrigger value="financing">
              {language === 'de' ? 'Finanzierung' : 'Financing'}
            </TabsTrigger>
            <TabsTrigger value="legal">
              {language === 'de' ? 'Rechtliches' : 'Legal'}
            </TabsTrigger>
            <TabsTrigger value="property">
              {language === 'de' ? 'Immobilie' : 'Property'}
            </TabsTrigger>
            <TabsTrigger value="tax">
              {language === 'de' ? 'Steuern' : 'Tax'}
            </TabsTrigger>
            <TabsTrigger value="investment">
              {language === 'de' ? 'Investment' : 'Investment'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTerms.map((term, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium">
                      <GermanRealEstateTermTooltip 
                        term={term.german} 
                        translation={term.english}
                      />
                    </h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {term.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{term.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {['financing', 'legal', 'property', 'tax', 'investment'].map(category => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTerms
                  .filter(term => term.category === category)
                  .map((term, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium">
                          <GermanRealEstateTermTooltip 
                            term={term.german} 
                            translation={term.english}
                          />
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{term.description}</p>
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GermanRealEstateGlossary;
