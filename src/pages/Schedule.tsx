
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';

const Schedule = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<any[]>([
    {
      id: '1',
      title: 'Property Viewing: Modern Apartment',
      date: new Date(2025, 4, 30, 10, 0),
      type: 'viewing',
      location: '123 Main Street, Berlin',
      contactPerson: 'Jane Smith',
      contactPhone: '+49 123 456789'
    },
    {
      id: '2',
      title: 'Bank Appointment: Mortgage Discussion',
      date: new Date(2025, 5, 2, 14, 30),
      type: 'bank',
      location: 'Deutsche Bank, Alexanderplatz',
      contactPerson: 'Stefan Müller',
      contactPhone: '+49 555 123456'
    },
  ]);

  const appointmentsForSelectedDate = appointments.filter(
    (appointment) => format(appointment.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">Manage appointments and viewings</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Appointment</DialogTitle>
              <DialogDescription>
                Create a new appointment for your real estate activities.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Appointment title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    <Input id="date" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Appointment Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewing">Property Viewing</SelectItem>
                    <SelectItem value="notary">Notary</SelectItem>
                    <SelectItem value="bank">Bank / Financing</SelectItem>
                    <SelectItem value="handover">Property Handover</SelectItem>
                    <SelectItem value="contractor">Contractor Meeting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Address or location" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input id="contactPerson" placeholder="Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input id="contactPhone" placeholder="Phone number" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Additional notes" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view appointments</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border p-3 pointer-events-auto"
            />
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Selected date: {format(date, 'MMMM d, yyyy')}
            </p>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Appointments for {format(date, 'MMMM d, yyyy')}</CardTitle>
            <CardDescription>
              {appointmentsForSelectedDate.length 
                ? `You have ${appointmentsForSelectedDate.length} appointment(s)`
                : 'No appointments scheduled for this day'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointmentsForSelectedDate.length > 0 ? (
                appointmentsForSelectedDate.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{appointment.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        appointment.type === 'viewing' ? 'bg-blue-100 text-blue-800' :
                        appointment.type === 'notary' ? 'bg-purple-100 text-purple-800' :
                        appointment.type === 'bank' ? 'bg-green-100 text-green-800' :
                        appointment.type === 'handover' ? 'bg-amber-100 text-amber-800' :
                        appointment.type === 'contractor' ? 'bg-rose-100 text-rose-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {format(appointment.date, 'h:mm a')} • {appointment.location}
                    </p>
                    {appointment.contactPerson && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Contact:</span> {appointment.contactPerson}
                        {appointment.contactPhone && ` • ${appointment.contactPhone}`}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No appointments for this day</p>
                  <Button variant="outline" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" /> Add Appointment
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;
