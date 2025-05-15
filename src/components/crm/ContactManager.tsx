
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Phone, User, Star, StarOff, Filter, Import, Mail, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ContactDetailView from './ContactDetailView';
import ImportContactsModal from './ImportContactsModal';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { ImportedContact } from '@/utils/contactImport';

export type ContactType = 'realtor' | 'handyman' | 'property_manager' | 'inspector' | 'tenant' | 'other';

export interface Contact {
  id: string;
  name: string;
  type: ContactType;
  phone: string;
  email?: string;
  favorite: boolean;
  lastContact?: string;
  notes?: string;
}

// Demo contact data - would be from database in production
const demoContacts: Contact[] = [
  { id: '1', name: 'Anna Weber', type: 'realtor', phone: '+49 151 1234567', email: 'anna@weber-immobilien.de', favorite: true, lastContact: '2023-05-10', notes: 'Specializes in Berlin apartments' },
  { id: '2', name: 'Michael Becker', type: 'handyman', phone: '+49 170 9876543', email: 'michael@becker-services.de', favorite: false, lastContact: '2023-04-22', notes: 'Plumbing and electrical work' },
  { id: '3', name: 'Christina Müller', type: 'property_manager', phone: '+49 176 4567890', email: 'c.mueller@property-mgmt.de', favorite: true, lastContact: '2023-05-01', notes: 'Manages buildings in Frankfurt' },
  { id: '4', name: 'Thomas Schmidt', type: 'inspector', phone: '+49 152 3334444', email: 'schmidt@building-inspector.de', favorite: false, lastContact: '2023-03-15', notes: 'Building inspector for Munich area' },
];

const ContactManager: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>(demoContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Get selected contact
  const selectedContact = contacts.find(c => c.id === selectedContactId);
  
  // Filter contacts based on search term, filters, and active tab
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      contact.phone.includes(searchTerm) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || contact.type === typeFilter;
    const matchesFavorite = !showFavoritesOnly || contact.favorite;
    const matchesTab = activeTab === 'all' || 
                     (activeTab === 'favorites' && contact.favorite) ||
                     (activeTab === 'recent' && contact.lastContact && 
                      new Date(contact.lastContact) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesType && matchesFavorite && matchesTab;
  });

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

  const initiateCall = (contact: Contact) => {
    toast({
      title: language === 'de' ? 'Anruf wird gestartet' : 'Initiating call',
      description: `${contact.name}: ${contact.phone}`,
    });
    // In a real implementation, this would integrate with a call API
  };

  const initiateEmail = (contact: Contact) => {
    if (contact.email) {
      toast({
        title: language === 'de' ? 'E-Mail wird vorbereitet' : 'Preparing email',
        description: `${contact.name}: ${contact.email}`,
      });
    } else {
      toast({
        title: language === 'de' ? 'Keine E-Mail verfügbar' : 'No email available',
        description: language === 'de' ? 'Dieser Kontakt hat keine E-Mail-Adresse' : 'This contact has no email address',
        variant: 'destructive'
      });
    }
  };

  const scheduleMeeting = (contact: Contact) => {
    toast({
      title: language === 'de' ? 'Termin planen' : 'Schedule meeting',
      description: language === 'de' 
        ? `Terminplanung mit ${contact.name} geöffnet` 
        : `Opening scheduler with ${contact.name}`,
    });
    // This would navigate to the meeting scheduler with the contact pre-selected
  };

  const handleImportedContacts = (importedContacts: ImportedContact[]) => {
    // Transform imported contacts to match our Contact interface
    const newContacts = importedContacts.map((contact, index) => ({
      id: contact.id || `imported-${Date.now()}-${index}`,
      name: contact.name,
      type: 'other' as ContactType,
      phone: contact.phone || '',
      email: contact.email,
      favorite: false,
      lastContact: new Date().toISOString().split('T')[0],
      notes: contact.notes || (language === 'de' 
        ? `Importiert von ${contact.source === 'iphone' ? 'iPhone' : 'CSV-Datei'}`
        : `Imported from ${contact.source === 'iphone' ? 'iPhone' : 'CSV file'}`)
    }));
    
    // Add imported contacts to the existing contacts
    setContacts([...contacts, ...newContacts]);

    // Show success toast with count
    toast({
      title: language === 'de' ? 'Kontakte importiert' : 'Contacts imported',
      description: language === 'de'
        ? `${newContacts.length} neue Kontakte wurden importiert`
        : `${newContacts.length} new contacts have been imported`
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getTypeLabel = (type: ContactType): string => {
    if (language === 'de') {
      const germanLabels: Record<ContactType, string> = {
        realtor: 'Makler',
        handyman: 'Handwerker',
        property_manager: 'Hausverwalter',
        inspector: 'Gutachter',
        tenant: 'Mieter',
        other: 'Sonstige'
      };
      return germanLabels[type];
    } else {
      const englishLabels: Record<ContactType, string> = {
        realtor: 'Realtor',
        handyman: 'Handyman',
        property_manager: 'Manager',
        inspector: 'Inspector',
        tenant: 'Tenant',
        other: 'Other'
      };
      return englishLabels[type];
    }
  };

  const getBadgeColor = (type: ContactType): string => {
    switch (type) {
      case 'realtor': return 'bg-blue-500';
      case 'handyman': return 'bg-amber-500';
      case 'property_manager': return 'bg-green-500';
      case 'inspector': return 'bg-purple-500';
      case 'tenant': return 'bg-teal-500';
      default: return 'bg-gray-500';
    }
  };

  // If a contact is selected, show its detail view
  if (selectedContact) {
    return (
      <ContactDetailView
        contactId={selectedContact.id}
        contactName={selectedContact.name}
        contactType={getTypeLabel(selectedContact.type)}
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
          {language === 'de' ? 'Verwalten Sie Ihre Immobilienkontakte' : 'Manage your real estate contacts'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={language === 'de' ? 'Suche nach Namen, E-Mail oder Telefonnummer...' : 'Search by name, email or phone number...'}
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={language === 'de' ? 'Typ' : 'Type'} />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'de' ? 'Alle Typen' : 'All Types'}</SelectItem>
                <SelectItem value="realtor">{getTypeLabel('realtor')}</SelectItem>
                <SelectItem value="handyman">{getTypeLabel('handyman')}</SelectItem>
                <SelectItem value="property_manager">{getTypeLabel('property_manager')}</SelectItem>
                <SelectItem value="inspector">{getTypeLabel('inspector')}</SelectItem>
                <SelectItem value="tenant">{getTypeLabel('tenant')}</SelectItem>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              {language === 'de' ? 'Alle' : 'All'}
            </TabsTrigger>
            <TabsTrigger value="favorites">
              {language === 'de' ? 'Favoriten' : 'Favorites'}
            </TabsTrigger>
            <TabsTrigger value="recent">
              {language === 'de' ? 'Kürzlich kontaktiert' : 'Recently Contacted'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
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
                            {contact.email && (
                              <div className="text-sm text-muted-foreground">{contact.email}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className={`${getBadgeColor(contact.type)} text-white`}
                          >
                            {getTypeLabel(contact.type)}
                          </Badge>
                          <div className="flex space-x-1">
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
                                  initiateEmail(contact);
                                }}
                                title={language === 'de' ? 'E-Mail senden' : 'Send email'}
                              >
                                <Mail className="h-4 w-4 text-primary" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => {
                                e.stopPropagation();
                                scheduleMeeting(contact);
                              }}
                              title={language === 'de' ? 'Termin planen' : 'Schedule meeting'}
                            >
                              <Calendar className="h-4 w-4 text-primary" />
                            </Button>
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
                      ? 'Versuchen Sie, Ihre Filterkriterien anzupassen' 
                      : 'Try adjusting your search filters'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setImportModalOpen(true)}>
          <Import className="h-4 w-4 mr-2" />
          {language === 'de' ? 'Kontakte importieren' : 'Import Contacts'}
        </Button>
        
        <Button onClick={() => toast({
          title: language === 'de' ? 'Kommt bald' : 'Coming soon',
          description: language === 'de' ? 'Diese Funktion wird bald verfügbar sein' : 'This feature will be available soon'
        })}>
          <Plus className="h-4 w-4 mr-2" />
          {language === 'de' ? 'Neuen Kontakt hinzufügen' : 'Add New Contact'}
        </Button>
      </CardFooter>

      <ImportContactsModal 
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onContactsImported={handleImportedContacts}
        existingContacts={contacts}
      />
    </Card>
  );
};

export default ContactManager;
