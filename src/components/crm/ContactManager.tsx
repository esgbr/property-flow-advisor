
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Import } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import ContactDetailView from './ContactDetailView';
import { ImportContactsModal } from './ImportContactsModal';
import { ImportedContact } from '@/utils/contactImport';
import FilterBar from './shared/FilterBar';
import ContactList from './contact/ContactList';

export interface Contact {
  id: string;
  name: string;
  type: string;
  phone: string;
  email?: string;
  notes?: string;
  favorite: boolean;
  lastContact?: string;
}

const ContactManager: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  // Demo contact data - in a real app, this would come from the database
  const [contacts, setContacts] = useState<Contact[]>([
    { 
      id: '1', 
      name: 'Thomas Weber', 
      type: 'client', 
      phone: '+49 123 456789', 
      email: 'thomas@example.com', 
      notes: 'Looking for a 2-bedroom apartment in Berlin',
      favorite: true,
      lastContact: '2025-05-01'
    },
    { 
      id: '2', 
      name: 'Anna Schmidt', 
      type: 'prospect', 
      phone: '+49 987 654321', 
      email: 'anna@example.com', 
      notes: 'Interested in investment properties in Frankfurt',
      favorite: false,
      lastContact: '2025-04-15'
    },
    { 
      id: '3', 
      name: 'Markus Fischer', 
      type: 'agent', 
      phone: '+49 555 123456', 
      email: 'markus@example.com', 
      notes: 'Real estate agent specializing in Munich area',
      favorite: true,
      lastContact: '2025-05-10'
    },
  ]);
  
  // Get selected contact
  const selectedContact = contacts.find(c => c.id === selectedContactId);
  
  // Filter contacts based on search term and filters
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      contact.phone.includes(searchTerm) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || contact.type === typeFilter;
    const matchesFavorite = !showFavoritesOnly || contact.favorite;
    
    return matchesSearch && matchesType && matchesFavorite;
  });

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, favorite: !contact.favorite } : contact
    ));
    
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      toast({
        title: contact.favorite ? 
          (language === 'de' ? 'Von Favoriten entfernt' : 'Removed from favorites') : 
          (language === 'de' ? 'Zu Favoriten hinzugefügt' : 'Added to favorites'),
        description: contact.name,
      });
    }
  };

  // Initiate phone call
  const initiateCall = (contact: Contact) => {
    toast({
      title: language === 'de' ? 'Anruf wird gestartet' : 'Initiating call',
      description: `${contact.name}: ${contact.phone}`,
    });
    // In a real implementation, this would integrate with a telephony API
  };
  
  // Send email
  const sendEmail = (contact: Contact) => {
    if (contact.email) {
      toast({
        title: language === 'de' ? 'E-Mail wird vorbereitet' : 'Preparing email',
        description: `${contact.name}: ${contact.email}`,
      });
      // In a real implementation, this would open an email composer or integrate with an email API
    }
  };

  // Handle imported contacts
  const handleContactsImported = (importedContacts: ImportedContact[]) => {
    // Add IDs to imported contacts if they don't have them
    const contactsWithIds = importedContacts.map(contact => ({
      id: contact.id || `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: contact.name,
      type: 'prospect',
      phone: contact.phone || '',
      email: contact.email,
      notes: contact.notes,
      favorite: false,
      lastContact: new Date().toISOString()
    }));
    
    setContacts(prevContacts => [...prevContacts, ...contactsWithIds]);
    
    toast({
      title: language === 'de' ? 'Kontakte importiert' : 'Contacts imported',
      description: language === 'de' 
        ? `${contactsWithIds.length} Kontakte wurden erfolgreich importiert` 
        : `${contactsWithIds.length} contacts successfully imported`,
    });
  };

  const filterOptions = [
    { value: 'all', label: language === 'de' ? 'Alle Typen' : 'All Types' },
    { value: 'client', label: language === 'de' ? 'Kunde' : 'Client' },
    { value: 'prospect', label: language === 'de' ? 'Interessent' : 'Prospect' },
    { value: 'agent', label: language === 'de' ? 'Makler' : 'Agent' },
    { value: 'partner', label: language === 'de' ? 'Partner' : 'Partner' }
  ];

  // If a contact is selected, show its detail view
  if (selectedContact) {
    return (
      <ContactDetailView
        contactId={selectedContact.id}
        contactName={selectedContact.name}
        contactType={selectedContact.type}
        contactPhone={selectedContact.phone}
        contactEmail={selectedContact.email}
        contactNotes={selectedContact.notes}
        onBack={() => setSelectedContactId(null)}
      />
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl animate-fade-in">
          {language === 'de' ? 'Kontaktverzeichnis' : 'Contact Directory'}
        </CardTitle>
        <CardDescription>
          {language === 'de' ? 'Verwalten Sie Ihre Kunden, Interessenten und Geschäftskontakte' : 'Manage your clients, prospects, and business contacts'}
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
            ? 'Suche nach Namen, E-Mail oder Telefonnummer...' 
            : 'Search by name, email, or phone number...'}
        />

        <div className="border rounded-md overflow-hidden">
          <ContactList
            contacts={filteredContacts}
            onContactClick={setSelectedContactId}
            onFavoriteToggle={toggleFavorite}
            initiateCall={initiateCall}
            sendEmail={sendEmail}
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2 ml-auto">
          <Button 
            variant="outline" 
            className="transition-transform hover:scale-105"
            onClick={() => setIsImportModalOpen(true)}
          >
            <Import className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Kontakte importieren' : 'Import Contacts'}
          </Button>
          
          <Button 
            className="transition-transform hover:scale-105"
            onClick={() => {
              const newId = `new-${Date.now()}`;
              const newContact: Contact = {
                id: newId,
                name: '',
                type: 'prospect',
                phone: '',
                favorite: false
              };
              setContacts([...contacts, newContact]);
              setSelectedContactId(newId);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Neuer Kontakt' : 'New Contact'}
          </Button>
        </div>
      </CardFooter>
      
      <ImportContactsModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleContactsImported}
        existingContacts={contacts}
      />
    </Card>
  );
};

export default ContactManager;
