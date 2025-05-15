
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  MapPin, 
  User,
  CalendarDays
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Contact } from '../ContactManager';
import { Company } from '@/hooks/use-crm-data';

interface Meeting {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  attendees: string[];
  location?: string;
  notes?: string;
}

const MeetingScheduler: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Property Viewing',
      date: new Date(),
      startTime: '10:00',
      endTime: '11:00',
      attendees: ['Thomas Weber', 'Anna Schmidt'],
      location: 'Hauptstrasse 100, Berlin'
    },
    {
      id: '2',
      title: 'Investment Discussion',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      startTime: '14:30',
      endTime: '15:30',
      attendees: ['Markus Fischer'],
      notes: 'Discuss investment opportunities in Frankfurt.'
    }
  ]);
  
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    title: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    attendees: []
  });
  
  const [isCreating, setIsCreating] = useState(false);
  
  const contacts: Contact[] = [
    { id: '1', name: 'Thomas Weber', type: 'client', phone: '+49 123 456789', favorite: true },
    { id: '2', name: 'Anna Schmidt', type: 'prospect', phone: '+49 987 654321', favorite: false },
    { id: '3', name: 'Markus Fischer', type: 'agent', phone: '+49 555 123456', favorite: true }
  ];
  
  const companies: Company[] = [
    { id: '1', name: 'Berlin Properties GmbH', type: 'agency', favorite: true },
    { id: '2', name: 'Frankfurt Investments AG', type: 'investment_firm', favorite: false }
  ];
  
  const meetingsForSelectedDate = meetings.filter(
    meeting => date && format(meeting.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );
  
  const handleCreateMeeting = () => {
    setIsCreating(true);
    
    // Simulate creating a meeting
    setTimeout(() => {
      if (newMeeting.title && newMeeting.date && newMeeting.startTime && newMeeting.endTime) {
        const createdMeeting: Meeting = {
          id: `meeting-${Date.now()}`,
          title: newMeeting.title,
          date: newMeeting.date,
          startTime: newMeeting.startTime,
          endTime: newMeeting.endTime,
          attendees: newMeeting.attendees || [],
          location: newMeeting.location,
          notes: newMeeting.notes
        };
        
        setMeetings([...meetings, createdMeeting]);
        
        toast({
          title: language === 'de' ? 'Meeting erstellt' : 'Meeting created',
          description: createdMeeting.title
        });
        
        // Reset form
        setNewMeeting({
          title: '',
          date: new Date(),
          startTime: '09:00',
          endTime: '10:00',
          attendees: []
        });
      } else {
        toast({
          title: language === 'de' ? 'Fehler' : 'Error',
          description: language === 'de' 
            ? 'Bitte füllen Sie alle Pflichtfelder aus' 
            : 'Please fill in all required fields',
          variant: 'destructive'
        });
      }
      
      setIsCreating(false);
    }, 1000);
  };
  
  const formatDateDisplay = (date?: Date) => {
    if (!date) return '';
    return language === 'de' 
      ? format(date, 'EEEE, d. MMMM yyyy', { locale: de })
      : format(date, 'EEEE, MMMM d, yyyy');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'de' ? 'Terminplaner' : 'Meeting Scheduler'}
          </CardTitle>
          <CardDescription>
            {language === 'de' 
              ? 'Planen und verwalten Sie Ihre Termine' 
              : 'Schedule and manage your meetings'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal transition-transform hover:scale-105"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {date ? formatDateDisplay(date) : <span>{language === 'de' ? 'Datum auswählen' : 'Pick a date'}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="mt-6 space-y-4">
            <h3 className="font-medium">
              {language === 'de' ? 'Termine für diesen Tag' : 'Meetings for this day'}
            </h3>
            
            {meetingsForSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {meetingsForSelectedDate.map((meeting) => (
                  <div 
                    key={meeting.id} 
                    className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors animate-fade-in"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{meeting.title}</h4>
                      <Badge variant="outline" className="font-mono">
                        {meeting.startTime} - {meeting.endTime}
                      </Badge>
                    </div>
                    
                    {meeting.attendees.length > 0 && (
                      <div className="flex items-center mt-2 text-sm">
                        <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {meeting.attendees.join(', ')}
                        </span>
                      </div>
                    )}
                    
                    {meeting.location && (
                      <div className="flex items-center mt-1 text-sm">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {meeting.location}
                        </span>
                      </div>
                    )}
                    
                    {meeting.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">{meeting.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarDays className="h-12 w-12 text-muted-foreground opacity-30 mx-auto" />
                <h3 className="mt-2 font-medium">
                  {language === 'de' ? 'Keine Termine für diesen Tag' : 'No meetings for this day'}
                </h3>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'de' ? 'Neuen Termin erstellen' : 'Create New Meeting'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              {language === 'de' ? 'Titel' : 'Title'} *
            </label>
            <Input 
              placeholder={language === 'de' ? 'Terminbezeichnung' : 'Meeting title'} 
              value={newMeeting.title}
              onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                {language === 'de' ? 'Datum' : 'Date'} *
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {newMeeting.date 
                      ? format(newMeeting.date, 'PPP', { locale: language === 'de' ? de : undefined }) 
                      : <span>{language === 'de' ? 'Datum auswählen' : 'Pick a date'}</span>
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newMeeting.date}
                    onSelect={(date: Date | undefined) => 
                      setNewMeeting({...newMeeting, date: date || new Date()})}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {language === 'de' ? 'Beginn' : 'Start'} *
                </label>
                <Select 
                  value={newMeeting.startTime} 
                  onValueChange={(value) => setNewMeeting({...newMeeting, startTime: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'de' ? 'Uhrzeit' : 'Time'} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 24}, (_, i) => i).map(hour => (
                      <React.Fragment key={hour}>
                        <SelectItem value={`${hour.toString().padStart(2, '0')}:00`}>
                          {`${hour.toString().padStart(2, '0')}:00`}
                        </SelectItem>
                        <SelectItem value={`${hour.toString().padStart(2, '0')}:30`}>
                          {`${hour.toString().padStart(2, '0')}:30`}
                        </SelectItem>
                      </React.Fragment>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {language === 'de' ? 'Ende' : 'End'} *
                </label>
                <Select 
                  value={newMeeting.endTime} 
                  onValueChange={(value) => setNewMeeting({...newMeeting, endTime: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'de' ? 'Uhrzeit' : 'Time'} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 24}, (_, i) => i).map(hour => (
                      <React.Fragment key={hour}>
                        <SelectItem value={`${hour.toString().padStart(2, '0')}:00`}>
                          {`${hour.toString().padStart(2, '0')}:00`}
                        </SelectItem>
                        <SelectItem value={`${hour.toString().padStart(2, '0')}:30`}>
                          {`${hour.toString().padStart(2, '0')}:30`}
                        </SelectItem>
                      </React.Fragment>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              {language === 'de' ? 'Teilnehmer' : 'Attendees'}
            </label>
            <Select 
              onValueChange={(value) => setNewMeeting({
                ...newMeeting, 
                attendees: [...(newMeeting.attendees || []), value]
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder={language === 'de' ? 'Teilnehmer hinzufügen' : 'Add attendees'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" disabled>
                  {language === 'de' ? 'Kontakte' : 'Contacts'}
                </SelectItem>
                {contacts.map(contact => (
                  <SelectItem key={contact.id} value={contact.name}>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {contact.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {newMeeting.attendees && newMeeting.attendees.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {newMeeting.attendees.map((attendee, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {attendee}
                    <button 
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => setNewMeeting({
                        ...newMeeting,
                        attendees: newMeeting.attendees?.filter((_, i) => i !== index)
                      })}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              {language === 'de' ? 'Ort' : 'Location'}
            </label>
            <Input 
              placeholder={language === 'de' ? 'Adresse oder Online-Link' : 'Address or online link'} 
              value={newMeeting.location || ''}
              onChange={(e) => setNewMeeting({...newMeeting, location: e.target.value})}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              {language === 'de' ? 'Notizen' : 'Notes'}
            </label>
            <Input 
              placeholder={language === 'de' ? 'Zusätzliche Informationen' : 'Additional information'} 
              value={newMeeting.notes || ''}
              onChange={(e) => setNewMeeting({...newMeeting, notes: e.target.value})}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full transition-transform hover:scale-105" 
            onClick={handleCreateMeeting}
            disabled={isCreating}
          >
            {isCreating && <div className="mr-2"><div className="spinner"></div></div>}
            {language === 'de' ? 'Termin erstellen' : 'Create Meeting'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MeetingScheduler;
