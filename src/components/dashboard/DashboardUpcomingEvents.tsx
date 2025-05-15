
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const DashboardUpcomingEvents: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>
          {language === 'de' ? 'Bevorstehende Termine' : 'Upcoming Events'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="min-w-10 text-center">
              <div className="font-medium">15</div>
              <div className="text-xs text-muted-foreground">MAY</div>
            </div>
            <div>
              <p className="font-medium">
                {language === 'de' ? 'Besichtigung' : 'Property Viewing'}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'de' ? '14:30 - Berliner Str. 42' : '2:30 PM - Berliner Str. 42'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="min-w-10 text-center">
              <div className="font-medium">18</div>
              <div className="text-xs text-muted-foreground">MAY</div>
            </div>
            <div>
              <p className="font-medium">
                {language === 'de' ? 'Anruf mit Makler' : 'Call with Agent'}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'de' ? '10:00 - Anna Weber' : '10:00 AM - Anna Weber'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/crm')}>
          <Calendar className="h-4 w-4 mr-2" />
          {language === 'de' ? 'Kalender öffnen' : 'Open Calendar'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DashboardUpcomingEvents;
