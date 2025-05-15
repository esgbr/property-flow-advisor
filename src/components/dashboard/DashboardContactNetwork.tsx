
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const contacts = [
  { name: 'Anna Weber', role: { de: 'Makler', en: 'Realtor' } },
  { name: 'Michael Becker', role: { de: 'Handwerker', en: 'Handyman' } }
];

const DashboardContactNetwork: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>{language === 'de' ? 'Kontaktnetzwerk' : 'Contact Network'}</CardTitle>
        <CardDescription>
          {language === 'de' ? 
            'Verwalten Sie Ihre wichtigsten Immobilienkontakte' : 
            'Manage your key real estate contacts'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((contact, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de' ? contact.role.de : contact.role.en}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => navigate('/crm')}>
          {language === 'de' ? 'Zum Kontaktmanagement' : 'Go to Contact Management'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DashboardContactNetwork;
