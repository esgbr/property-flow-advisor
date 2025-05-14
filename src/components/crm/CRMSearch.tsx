
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, X, Users, Building, Calendar, FileText, Mail } from 'lucide-react';
import { 
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface SearchResult {
  id: string;
  type: 'contact' | 'company' | 'meeting' | 'document' | 'email';
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

// Mock search results - would be fetched from API in real app
const mockSearchResults: SearchResult[] = [
  { id: 'c1', type: 'contact', title: 'Anna Schmidt', subtitle: '+49 123 456789', icon: <Users className="h-4 w-4" /> },
  { id: 'c2', type: 'contact', title: 'Max Müller', subtitle: 'Investor', icon: <Users className="h-4 w-4" /> },
  { id: 'comp1', type: 'company', title: 'Immobilien GmbH', subtitle: 'Real Estate Agency', icon: <Building className="h-4 w-4" /> },
  { id: 'comp2', type: 'company', title: 'Berlin Real Estate AG', subtitle: 'Investment Firm', icon: <Building className="h-4 w-4" /> },
  { id: 'm1', type: 'meeting', title: 'Property Viewing', subtitle: 'Tomorrow at 14:00', icon: <Calendar className="h-4 w-4" /> },
  { id: 'd1', type: 'document', title: 'Purchase Agreement.pdf', subtitle: 'Added 3 days ago', icon: <FileText className="h-4 w-4" /> },
  { id: 'e1', type: 'email', title: 'Re: Property Inquiry', subtitle: 'Sent to client yesterday', icon: <Mail className="h-4 w-4" /> },
];

interface CRMSearchProps {
  className?: string;
  placeholder?: string;
  onlyInline?: boolean;
}

const CRMSearch: React.FC<CRMSearchProps> = ({ 
  className = '', 
  placeholder,
  onlyInline
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Filter results based on query
    if (query.trim().length === 0) {
      setResults([]);
    } else {
      // Simulate API search
      const searchTerm = query.toLowerCase();
      const filtered = mockSearchResults.filter(
        item => item.title.toLowerCase().includes(searchTerm) || 
               item.subtitle?.toLowerCase().includes(searchTerm)
      );
      setResults(filtered);
    }
  }, [query]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Only open dialog on / if not already focused on an input
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setOpen(true);
      }
    };
    
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSearchResultClick = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    
    // Process the click based on result type
    switch(result.type) {
      case 'contact':
        // Navigate to contact detail in real app
        toast({
          title: language === 'de' ? 'Kontakt geöffnet' : 'Contact opened',
          description: result.title,
        });
        break;
      case 'company':
        // Navigate to company detail in real app
        toast({
          title: language === 'de' ? 'Unternehmen geöffnet' : 'Company opened',
          description: result.title,
        });
        break;
      case 'meeting':
        toast({
          title: language === 'de' ? 'Termin angezeigt' : 'Meeting displayed',
          description: result.title,
        });
        break;
      case 'document':
        toast({
          title: language === 'de' ? 'Dokument geöffnet' : 'Document opened',
          description: result.title,
        });
        break;
      case 'email':
        toast({
          title: language === 'de' ? 'E-Mail geöffnet' : 'Email opened',
          description: result.title,
        });
        break;
    }
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          className="pl-9 pr-12"
          placeholder={placeholder || (language === 'de' ? 'CRM durchsuchen... (/ für Schnellsuche)' : 'Search CRM... (Press / for quick search)')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClick={() => !onlyInline && setOpen(true)}
        />
        {query && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-7 w-7" 
            onClick={() => setQuery('')}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {!onlyInline && (
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput 
            placeholder={language === 'de' ? 'Suchen...' : 'Search...'} 
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {language === 'de' ? 'Keine Ergebnisse gefunden' : 'No results found'}
            </CommandEmpty>
            <CommandGroup heading={language === 'de' ? 'Ergebnisse' : 'Results'}>
              {results.map((result) => (
                <CommandItem 
                  key={result.id}
                  onSelect={() => handleSearchResultClick(result)}
                  className="flex items-center cursor-pointer"
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {result.icon}
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium">{result.title}</div>
                      {result.subtitle && (
                        <div className="text-xs text-muted-foreground truncate">
                          {result.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      )}
    </>
  );
};

export default CRMSearch;
