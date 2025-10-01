'use client';

import { useState } from 'react';
import WeddingLayout from '@/components/ui/wedding-layout';
import Header from '@/components/ui/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, 
         isSameMonth, isSameDay, addDays, isToday } from 'date-fns';

// Mock data for calendar events
const mockEvents = [
  {
    id: 1,
    title: 'Venue Walk-through',
    date: new Date(2025, 4, 15),
    startTime: '15:00',
    endTime: '17:00',
    weddingId: '1',
    weddingTitle: "Sarah & John's Wedding",
    description: 'Meeting with venue manager to finalize details',
    location: 'Beach Resort, Maldives',
    attendees: 2
  },
  {
    id: 2,
    title: 'Dress Fitting',
    date: new Date(2025, 3, 10),
    startTime: '11:00',
    endTime: '13:00',
    weddingId: '1',
    weddingTitle: "Sarah & John's Wedding",
    description: 'First fitting appointment with designer',
    location: 'Sarah\'s Boutique',
    attendees: 1
  },
  {
    id: 3,
    title: 'Catering Meeting',
    date: new Date(2025, 2, 20),
    startTime: '14:00',
    endTime: '16:00',
    weddingId: '1',
    weddingTitle: "Sarah & John's Wedding",
    description: 'Finalize menu and catering contract',
    location: 'Catering Office',
    attendees: 3
  },
  {
    id: 4,
    title: 'Wedding Day Rehearsal',
    date: new Date(2025, 5, 14),
    startTime: '18:00',
    endTime: '20:00',
    weddingId: '1',
    weddingTitle: "Sarah & John's Wedding",
    description: 'Rehearsal for the wedding ceremony',
    location: 'Beach Resort, Maldives',
    attendees: 20
  },
  {
    id: 5,
    title: 'Vendor Meeting',
    date: new Date(2025, 4, 5),
    startTime: '10:00',
    endTime: '12:00',
    weddingId: '2',
    weddingTitle: "Emma & Michael's Wedding",
    description: 'Meet with selected vendors to finalize details',
    location: 'Conference Room',
    attendees: 8
  },
  {
    id: 6,
    title: 'Hair Trial',
    date: new Date(2025, 3, 22),
    startTime: '09:00',
    endTime: '11:00',
    weddingId: '1',
    weddingTitle: "Sarah & John's Wedding",
    description: 'Trial appointment with hair stylist',
    location: 'Bridal Salon',
    attendees: 1
  }
];

const CalendarScheduling = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(mockEvents);

  // Calendar navigation
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Get days for the current month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on Saturday

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  // Get color based on wedding
  const getEventColor = (weddingId: string) => {
    const colors = {
      '1': 'bg-blue-100 border-blue-500 text-blue-800',
      '2': 'bg-red-100 border-red-500 text-red-800',
      '3': 'bg-green-100 border-green-500 text-green-800'
    };
    return colors[weddingId as keyof typeof colors] || 'bg-purple-100 border-purple-500 text-purple-800';
  };

  return (
    <WeddingLayout>
      <Header 
        title="Calendar & Scheduling" 
        subtitle="Manage all important dates and appointments"
      >
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </Header>

      {/* Calendar Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => {
                const today = new Date();
                const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                return e.date >= weekStart && e.date <= weekEnd;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Events this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.date > new Date()).length}
            </div>
            <p className="text-xs text-muted-foreground">Future appointments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weddings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {[...new Set(events.map(e => e.weddingId))].length}
            </div>
            <p className="text-xs text-muted-foreground">Managed events</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              {format(currentDate, 'MMMM yyyy')}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-sm py-2 text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isTodayDate = isToday(day);
              
              return (
                <div 
                  key={index} 
                  className={`min-h-24 p-1 border rounded ${
                    isCurrentMonth ? 'bg-background' : 'bg-muted/30'
                  } ${isTodayDate ? 'border-primary' : 'border-border'}`}
                >
                  <div className={`text-right text-sm mb-1 ${
                    isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                  } ${isTodayDate ? 'font-bold' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1 max-h-20 overflow-y-auto">
                    {dayEvents.slice(0, 3).map(event => (
                      <div 
                        key={event.id} 
                        className={`text-xs p-1 rounded border truncate ${getEventColor(event.weddingId)}`}
                      >
                        <span className="font-medium">{event.startTime}</span> {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground">+ {dayEvents.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events
              .filter(event => event.date >= new Date())
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 5) // Show only the next 5 events
              .map(event => (
                <div key={event.id} className="flex items-start p-4 border-b last:border-b-0">
                  <div className="mr-4">
                    <div className="bg-blue-100 text-blue-800 rounded-full p-2">
                      <Clock className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{event.weddingTitle}</p>
                    <div className="flex items-center text-sm text-muted-foreground mt-2 gap-4">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {format(event.date, 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {event.startTime} - {event.endTime}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {event.attendees} attendees
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </WeddingLayout>
  );
};

export default CalendarScheduling;