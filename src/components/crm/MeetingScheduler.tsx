
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar as CalendarIcon, Clock, Users, MapPin, Plus, CheckCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

// Mock data for contacts
const mockContacts = [
  { id: 'c1', name: 'Anna Schmidt' },
  { id: 'c2', name: 'Max Müller' },
  { id: 'c3', name: 'Thomas Weber' },
  { id: 'c4', name: 'Sophie Becker' },
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', 
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00'
];

const MeetingScheduler: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isScheduling, setIsScheduling] = useState<boolean>(false);
  
  const handleScheduleMeeting = () => {
    // Validation
    if (!date || !time || !selectedContact) {
      toast({
        title: language === 'de' ? 'Fehler' : 'Error',
        description: language === 'de' 
          ? 'Bitte füllen Sie alle erforderlichen Felder aus' 
          : 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    // Show scheduling animation
    setIsScheduling(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: language === 'de' ? 'Termin geplant' : 'Meeting scheduled',
        description: language === 'de'
          ? `Termin mit ${mockContacts.find(c => c.id === selectedContact)?.name} am ${format(date, 'dd.MM.yyyy')} um ${time} Uhr`
          : `Meeting with ${mockContacts.find(c => c.id === selectedContact)?.name} on ${format(date, 'PP')} at ${time}`,
        variant: 'success'
      });
      
      // Reset form
      setDate(undefined);
      setTime('');
      setSelectedContact('');
      setLocation('');
      setNotes('');
      setIsScheduling(false);
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          {language === 'de' ? 'Termin planen' : 'Schedule Meeting'}
        </CardTitle>
        <CardDescription>
          {language === 'de' 
            ? 'Planen Sie Termine mit Ihren Kontakten' 
            : 'Schedule meetings with your contacts'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">
                {language === 'de' ? 'Datum' : 'Date'} <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                    id="date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, 'PPP', { locale: language === 'de' ? de : undefined })
                    ) : (
                      <span className="text-muted-foreground">
                        {language === 'de' ? 'Datum auswählen' : 'Pick a date'}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={language === 'de' ? de : undefined}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">
                {language === 'de' ? 'Uhrzeit' : 'Time'} <span className="text-red-500">*</span>
              </Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger id="time">
                  <SelectValue placeholder={language === 'de' ? 'Uhrzeit auswählen' : 'Select time'} />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact">
                {language === 'de' ? 'Kontakt' : 'Contact'} <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedContact} onValueChange={setSelectedContact}>
                <SelectTrigger id="contact">
                  <SelectValue placeholder={language === 'de' ? 'Kontakt auswählen' : 'Select contact'} />
                </SelectTrigger>
                <SelectContent>
                  {mockContacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">
                {language === 'de' ? 'Ort' : 'Location'}
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={language === 'de' ? 'z.B. Büro oder Online-Meeting' : 'e.g. Office or Online Meeting'}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">
              {language === 'de' ? 'Notizen' : 'Notes'}
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'de' ? 'Agenda oder zusätzliche Informationen' : 'Agenda or additional information'}
              rows={3}
            />
          </div>
          
          <Button 
            className="w-full"
            onClick={handleScheduleMeeting}
            disabled={isScheduling}
          >
            {isScheduling ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4 animate-spin" />
                {language === 'de' ? 'Wird geplant...' : 'Scheduling...'}
              </>
            ) : (
              <>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {language === 'de' ? 'Termin planen' : 'Schedule Meeting'}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingScheduler;
