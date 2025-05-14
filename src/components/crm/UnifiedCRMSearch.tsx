
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, X, User, Building, Calendar, Mail, Phone, FileText 
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
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

interface CRMSearchProps {
  className?: string;
}

// This would be expanded in a real application with more entities
const searchResults = {
  contacts: [
    { id: '1', name: 'Anna Weber', type: 'realtor', icon: <User className="h-4 w-4 mr-2" /> },
    { id: '2', name: 'Michael Becker', type: 'handyman', icon: <User className="h-4 w-4 mr-2" /> },
  ],
  companies: [
    { id: 'c1', name: 'Berlin Property Group', type: 'agency', icon: <Building className="h-4 w-4 mr-2" /> },
    { id: 'c2', name: 'Frankfurt Asset Management', type: 'investment_firm', icon: <Building className="h-4 w-4 mr-2" /> },
  ],
  meetings: [
    { id: 'm1', name: 'Property Viewing with Anna Weber', date: '2025-05-20', icon: <Calendar className="h-4 w-4 mr-2" /> },
  ],
  emails: [
    { id: 'e1', name: 'Contract Draft - Berlin Property', date: '2025-05-10', icon: <Mail className="h-4 w-4 mr-2" /> },
  ],
  calls: [
    { id: 'call1', name: 'Follow-up with Michael Becker', date: '2025-05-12', icon: <Phone className="h-4 w-4 mr-2" /> },
  ],
  documents: [
    { id: 'd1', name: 'Berlin Property Agreement.pdf', date: '2025-04-28', icon: <FileText className="h-4 w-4 mr-2" /> },
  ]
};

const UnifiedCRMSearch: React.FC<CRMSearchProps> = ({ className }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleSelect = (item: any, category: string) => {
    setOpen(false);
    
    // Handle different entity types
    switch (category) {
      case 'contacts':
        toast({
          title: language === 'de' ? 'Kontakt ausgewählt' : 'Contact selected',
          description: item.name
        });
        break;
      case 'companies':
        toast({
          title: language === 'de' ? 'Unternehmen ausgewählt' : 'Company selected',
          description: item.name
        });
        break;
      case 'meetings':
      case 'emails':
      case 'calls':
      case 'documents':
        toast({
          title: language === 'de' ? 'Funktion kommt bald' : 'Feature coming soon',
          description: language === 'de' 
            ? `${item.name} wurde ausgewählt` 
            : `${item.name} was selected`
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <Button
          variant="outline"
          className="relative w-full justify-start text-sm text-muted-foreground h-9 px-4"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4 mr-2" />
          <span>
            {language === 'de' 
              ? 'Durchsuchen Sie CRM-Kontakte, Unternehmen, Termine und mehr...' 
              : 'Search CRM contacts, companies, meetings and more...'}
          </span>
          <kbd className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder={
            language === 'de' 
              ? 'Suchen Sie im gesamten CRM...' 
              : 'Search across all CRM...'
          } 
        />
        <CommandList>
          <CommandEmpty>
            {language === 'de' 
              ? 'Keine Ergebnisse gefunden.' 
              : 'No results found.'}
          </CommandEmpty>
          
          <CommandGroup heading={language === 'de' ? 'Kontakte' : 'Contacts'}>
            {searchResults.contacts.map((item) => (
              <CommandItem 
                key={item.id}
                onSelect={() => handleSelect(item, 'contacts')}
              >
                {item.icon}
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandGroup heading={language === 'de' ? 'Unternehmen' : 'Companies'}>
            {searchResults.companies.map((item) => (
              <CommandItem 
                key={item.id}
                onSelect={() => handleSelect(item, 'companies')}
              >
                {item.icon}
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandGroup heading={language === 'de' ? 'Termine' : 'Meetings'}>
            {searchResults.meetings.map((item) => (
              <CommandItem 
                key={item.id}
                onSelect={() => handleSelect(item, 'meetings')}
              >
                {item.icon}
                <span>{item.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{item.date}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandGroup heading={language === 'de' ? 'E-Mails' : 'Emails'}>
            {searchResults.emails.map((item) => (
              <CommandItem 
                key={item.id}
                onSelect={() => handleSelect(item, 'emails')}
              >
                {item.icon}
                <span>{item.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{item.date}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading={language === 'de' ? 'Anrufe' : 'Calls'}>
            {searchResults.calls.map((item) => (
              <CommandItem 
                key={item.id}
                onSelect={() => handleSelect(item, 'calls')}
              >
                {item.icon}
                <span>{item.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{item.date}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading={language === 'de' ? 'Dokumente' : 'Documents'}>
            {searchResults.documents.map((item) => (
              <CommandItem 
                key={item.id}
                onSelect={() => handleSelect(item, 'documents')}
              >
                {item.icon}
                <span>{item.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{item.date}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default UnifiedCRMSearch;
