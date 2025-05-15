import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Phone, User, Star, StarOff, Trash2, Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Use ContactType type for demoContacts type
const demoContacts: Contact[] = [
  {
    id: "1",
    name: "Anna Weber",
    type: "realtor",
    phone: "+49 151 1234567",
    favorite: true,
    lastContact: "2023-05-10",
    notes: "Specializes in Berlin apartments",
  },
  { id: "2", name: "Michael Becker", type: "handyman", phone: "+49 170 9876543", favorite: false, lastContact: "2023-04-22", notes: "Plumbing and electrical work" },
  { id: "3", name: "Christina Müller", type: "property_manager", phone: "+49 176 4567890", favorite: true, lastContact: "2023-05-01", notes: "Manages buildings in Frankfurt" },
  { id: "4", name: "Thomas Schmidt", type: "inspector", phone: "+49 152 3334444", favorite: false, lastContact: "2023-03-15", notes: "Building inspector for Munich area" },
];

type ContactType = 'realtor' | 'handyman' | 'property_manager' | 'inspector' | 'tenant' | 'other';

interface Contact {
  id: string;
  name: string;
  type: ContactType;
  phone: string;
  favorite: boolean;
  lastContact?: string;
  notes?: string;
}

interface ContactManagerProps {
  onInitiateCall: (name: string, phone: string) => void;
}

const ContactManager: React.FC<ContactManagerProps> = ({ onInitiateCall }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>(demoContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // Filter contacts based on search term and filters
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          contact.phone.includes(searchTerm);
    const matchesType = typeFilter === 'all' || contact.type === typeFilter;
    const matchesFavorite = !showFavoritesOnly || contact.favorite;
    
    return matchesSearch && matchesType && matchesFavorite;
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
              placeholder={language === 'de' ? 'Suche nach Namen oder Telefonnummer...' : 'Search by name or phone number...'}
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

        <div className="border rounded-md overflow-hidden">
          {filteredContacts.length > 0 ? (
            <div className="divide-y">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="p-4 hover:bg-muted/50 transition-colors">
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
                      <Badge 
                        variant="outline" 
                        className={`${getBadgeColor(contact.type)} text-white`}
                      >
                        {getTypeLabel(contact.type)}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleFavorite(contact.id)}
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
                        onClick={() => onInitiateCall(contact.name, contact.phone)}
                        title={language === 'de' ? 'Anrufen' : 'Call'}
                      >
                        <Phone className="h-4 w-4 text-primary" />
                      </Button>
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
      </CardContent>
      <CardFooter>
        <Button className="ml-auto" onClick={() => toast({
          title: language === 'de' ? 'Kommt bald' : 'Coming soon',
          description: language === 'de' ? 'Diese Funktion wird bald verfügbar sein' : 'This feature will be available soon'
        })}>
          <Plus className="h-4 w-4 mr-2" />
          {language === 'de' ? 'Neuen Kontakt hinzufügen' : 'Add New Contact'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContactManager;
