
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar as CalendarIcon, Plus, Settings } from 'lucide-react';

// Sample tax event data
const taxEvents = [
  {
    id: 1,
    title: {
      de: 'Einkommensteuererklärung',
      en: 'Income Tax Return'
    },
    deadline: new Date(new Date().getFullYear(), 6, 31), // July 31st of current year
    importance: 'high',
    category: 'tax-return'
  },
  {
    id: 2,
    title: {
      de: 'Grundsteuer',
      en: 'Property Tax'
    },
    deadline: new Date(new Date().getFullYear(), 1, 15), // February 15th of current year
    importance: 'medium',
    category: 'property-tax'
  },
  {
    id: 3,
    title: {
      de: 'Umsatzsteuervoranmeldung',
      en: 'VAT Pre-registration'
    },
    deadline: new Date(new Date().getFullYear(), 3, 10), // April 10th of current year
    importance: 'medium',
    category: 'vat'
  },
  {
    id: 4,
    title: {
      de: 'Gewerbesteuer',
      en: 'Business Tax'
    },
    deadline: new Date(new Date().getFullYear(), 4, 15), // May 15th of current year
    importance: 'low',
    category: 'business-tax'
  },
  {
    id: 5,
    title: {
      de: 'Abschreibungen prüfen',
      en: 'Check Depreciation'
    },
    deadline: new Date(new Date().getFullYear(), 11, 15), // December 15th of current year
    importance: 'high',
    category: 'depreciation'
  }
];

const TaxCalendarReminders: React.FC = () => {
  const { language } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  // Filter events by month if a date is selected
  const filteredEvents = date 
    ? taxEvents.filter(event => event.deadline.getMonth() === date.getMonth())
    : taxEvents;
    
  // Function to get events for a specific day (for calendar highlighting)
  const getDayHasEvents = (day: Date) => {
    return taxEvents.some(event => 
      event.deadline.getDate() === day.getDate() &&
      event.deadline.getMonth() === day.getMonth() &&
      event.deadline.getFullYear() === day.getFullYear()
    );
  };

  // Function to get importance badge colors
  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'high':
        return <Badge variant="destructive">{language === 'de' ? 'Hoch' : 'High'}</Badge>;
      case 'medium':
        return <Badge variant="default">{language === 'de' ? 'Mittel' : 'Medium'}</Badge>;
      case 'low':
        return <Badge variant="outline">{language === 'de' ? 'Niedrig' : 'Low'}</Badge>;
      default:
        return <Badge variant="outline">{language === 'de' ? 'Niedrig' : 'Low'}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendar component */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>
              {language === 'de' ? 'Steuerkalender' : 'Tax Calendar'}
            </CardTitle>
            <CardDescription>
              {language === 'de' 
                ? 'Wichtige steuerliche Termine und Fristen' 
                : 'Important tax dates and deadlines'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                event: (date) => getDayHasEvents(date)
              }}
              modifiersClassNames={{
                event: "bg-primary/10 text-primary font-bold"
              }}
            />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {language === 'de' ? 'Mit persönlichem Kalender synchronisieren' : 'Sync with personal calendar'}
            </Button>
          </CardFooter>
        </Card>

        {/* Events list */}
        <Card className="flex-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {language === 'de' ? 'Termine & Erinnerungen' : 'Dates & Reminders'}
              </CardTitle>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              {date 
                ? `${language === 'de' ? 'Termine für' : 'Events for'} ${date.toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', { month: 'long', year: 'numeric' })}`
                : language === 'de' ? 'Alle anstehenden Termine' : 'All upcoming events'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mb-2 text-muted-foreground/50" />
                <p>{language === 'de' ? 'Keine Termine für diesen Monat' : 'No events for this month'}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'de' ? 'Beschreibung' : 'Description'}</TableHead>
                    <TableHead>{language === 'de' ? 'Fällig am' : 'Due Date'}</TableHead>
                    <TableHead>{language === 'de' ? 'Priorität' : 'Priority'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow 
                      key={event.id} 
                      className={selectedEvent === event.id ? 'bg-primary/5' : ''}
                      onClick={() => setSelectedEvent(event.id)}
                    >
                      <TableCell className="font-medium">
                        {event.title[language === 'de' ? 'de' : 'en']}
                      </TableCell>
                      <TableCell>
                        {event.deadline.toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}
                      </TableCell>
                      <TableCell>
                        {getImportanceBadge(event.importance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              {language === 'de' ? 'Erinnerungen verwalten' : 'Manage Reminders'}
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {language === 'de' ? 'Termin hinzufügen' : 'Add Event'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Selected event details or recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedEvent 
              ? language === 'de' ? 'Termindetails' : 'Event Details'
              : language === 'de' ? 'Steuerliche Empfehlungen' : 'Tax Recommendations'
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedEvent ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">
                  {taxEvents.find(e => e.id === selectedEvent)?.title[language === 'de' ? 'de' : 'en']}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'de' 
                    ? 'Stellen Sie sicher, dass Sie alle notwendigen Unterlagen vorbereitet haben.'
                    : 'Make sure you have prepared all necessary documents.'}
                </p>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium mb-2">
                  {language === 'de' ? 'Benötigte Dokumente:' : 'Required Documents:'}
                </h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>{language === 'de' ? 'Steuernummer' : 'Tax number'}</li>
                  <li>{language === 'de' ? 'Einkommensnachweise' : 'Income statements'}</li>
                  <li>{language === 'de' ? 'Immobilienbezogene Ausgaben' : 'Property-related expenses'}</li>
                  <li>{language === 'de' ? 'Vorherige Steuerbescheide' : 'Previous tax assessments'}</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm">
                {language === 'de' 
                  ? 'Basierend auf Ihrem Immobilienportfolio könnten diese steuerlichen Maßnahmen relevant sein:'
                  : 'Based on your real estate portfolio, these tax measures might be relevant:'}
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>{language === 'de' ? 'Überprüfung der AfA-Sätze für alle Immobilien' : 'Review of depreciation rates for all properties'}</li>
                <li>{language === 'de' ? 'Aufteilung von Renovierungskosten in sofort abzugsfähige Erhaltungsaufwendungen und zu aktivierende Herstellungskosten' : 'Division of renovation costs into immediately deductible maintenance expenses and production costs to be capitalized'}</li>
                <li>{language === 'de' ? 'Prüfung der Möglichkeit zur verbilligten Vermietung an Angehörige' : 'Checking the possibility of discounted rentals to relatives'}</li>
                <li>{language === 'de' ? 'Optimierung der Finanzierungsstruktur für steuerliche Zwecke' : 'Optimization of financing structure for tax purposes'}</li>
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            {language === 'de' ? 'Steuerberater konsultieren' : 'Consult Tax Advisor'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TaxCalendarReminders;
