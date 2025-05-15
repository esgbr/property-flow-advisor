import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Star, StarOff, Filter, Trash2, Edit, Phone, Import, Mail, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ContactDetailView from './ContactDetailView';
import { ImportContactsModal } from './ImportContactsModal';
import { ImportedContact } from '@/utils/contactImport';

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
  
  // Delete contact
  const deleteContact = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      // Confirm before deleting
      if (window.confirm(language === 'de' 
        ? `Möchten Sie "${contact.name}" wirklich löschen?` 
        : `Are you sure you want to delete "${contact.name}"?`)) {
        setContacts(contacts.filter(c => c.id !== id));
        toast({
          title: language === 'de' ? 'Kontakt gelöscht' : 'Contact deleted',
          description: contact.name,
        });
      }
    }
  };
  
  // Import contacts handler
  const handleContactsImported = (importedContacts: ImportedContact[]) => {
    // Add IDs to imported contacts if they don't have them
    const contactsWithIds = importedContacts.map(contact => ({
      ...contact,
      id: contact.id || `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      favorite: false,
      type: contact.type || 'prospect'
    }));
    
    setContacts(prevContacts => [...prevContacts, ...contactsWithIds]);
    
    toast({
      title: language === 'de' ? 'Kontakte importiert' : 'Contacts imported',
      description: language === 'de' 
        ? `${contactsWithIds.length} Kontakte wurden erfolgreich importiert` 
        : `${contactsWithIds.length} contacts successfully imported`,
    });
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

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
        <CardTitle className="text-2xl">
          {language === 'de' ? 'Kontaktverzeichnis' : 'Contact Directory'}
        </CardTitle>
        <CardDescription>
          {language === 'de' ? 'Verwalten Sie Ihre Kunden, Interessenten und Geschäftskontakte' : 'Manage your clients, prospects, and business contacts'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={language === 'de' ? 'Suche nach Namen, E-Mail oder Telefonnummer...' : 'Search by name, email, or phone number...'}
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
                <SelectItem value="client">{language === 'de' ? 'Kunde' : 'Client'}</SelectItem>
                <SelectItem value="prospect">{language === 'de' ? 'Interessent' : 'Prospect'}</SelectItem>
                <SelectItem value="agent">{language === 'de' ? 'Makler' : 'Agent'}</SelectItem>
                <SelectItem value="partner">{language === 'de' ? 'Partner' : 'Partner'}</SelectItem>
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
          {filteredContacts.length > 0 ? (
            <div className="divide-y">
              {filteredContacts.map((contact) => (
                <div 
                  key={contact.id} 
                  className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedContactId(contact.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-muted-foreground">{contact.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {contact.type === 'client' && (language === 'de' ? 'Kunde' : 'Client')}
                        {contact.type === 'prospect' && (language === 'de' ? 'Interessent' : 'Prospect')}
                        {contact.type === 'agent' && (language === 'de' ? 'Makler' : 'Agent')}
                        {contact.type === 'partner' && (language === 'de' ? 'Partner' : 'Partner')}
                      </Badge>
                      <div className="flex">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(contact.id);
                          }}
                          title={language === 'de' ? 'Favorit umschalten' : 'Toggle favorite'}
                        >
                          {contact.favorite ? (
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
                            initiateCall(contact);
                          }}
                          title={language === 'de' ? 'Anrufen' : 'Call'}
                        >
                          <Phone className="h-4 w-4 text-primary" />
                        </Button>
                        {contact.email && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              sendEmail(contact);
                            }}
                            title={language === 'de' ? 'E-Mail senden' : 'Send email'}
                          >
                            <Mail className="h-4 w-4 text-primary" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  {contact.notes && (
                    <div className="ml-12 mt-1 text-sm text-muted-foreground">
                      {contact.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <User className="h-12 w-12 mx-auto text-muted-foreground opacity-30" />
              <h3 className="mt-2 text-lg font-medium">
                {language === 'de' ? 'Keine Kontakte gefunden' : 'No contacts found'}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {language === 'de' 
                  ? 'Versuchen Sie, Ihre Filterkriterien anzupassen oder neue Kontakte hinzuzufügen' 
                  : 'Try adjusting your search filters or add new contacts'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2 ml-auto">
          <Button 
            variant="outline" 
            onClick={() => setIsImportModalOpen(true)}
          >
            <Import className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Kontakte importieren' : 'Import Contacts'}
          </Button>
          
          <Button onClick={() => {
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
          }}>
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
