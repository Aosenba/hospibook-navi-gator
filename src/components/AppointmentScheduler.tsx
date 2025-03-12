
import { useState, useEffect } from 'react';
import { format, parseISO, isToday, isTomorrow, addDays } from 'date-fns';
import { Calendar, CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppointmentSlot } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AppointmentSchedulerProps {
  availableSlots: AppointmentSlot[];
  onSelectSlot: (slot: AppointmentSlot) => void;
  selectedSlot: AppointmentSlot | null;
}

const AppointmentScheduler = ({ 
  availableSlots,
  onSelectSlot,
  selectedSlot 
}: AppointmentSchedulerProps) => {
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slotsForSelectedDate, setSlotsForSelectedDate] = useState<AppointmentSlot[]>([]);
  
  // Get unique dates from available slots
  useEffect(() => {
    const uniqueDates = Array.from(new Set(availableSlots.map(slot => slot.date)));
    setDates(uniqueDates.sort());
    
    // Default to today or first available date
    const today = new Date().toISOString().split('T')[0];
    if (uniqueDates.includes(today)) {
      setSelectedDate(today);
    } else if (uniqueDates.length > 0) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [availableSlots]);
  
  // Filter slots for selected date
  useEffect(() => {
    if (selectedDate) {
      const filtered = availableSlots.filter(slot => slot.date === selectedDate)
        .sort((a, b) => a.time.localeCompare(b.time));
      setSlotsForSelectedDate(filtered);
    } else {
      setSlotsForSelectedDate([]);
    }
  }, [selectedDate, availableSlots]);
  
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };
  
  const formatDateLabel = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'E, MMM d'); // e.g. "Mon, Oct 15"
  };
  
  const getDayName = (dateString: string) => {
    return format(parseISO(dateString), 'E'); // e.g. "Mon"
  };
  
  const getDayDate = (dateString: string) => {
    return format(parseISO(dateString), 'd'); // e.g. "15"
  };
  
  // Group time slots by morning, afternoon, evening
  const morningSlots = slotsForSelectedDate.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 9 && hour < 12;
  });
  
  const afternoonSlots = slotsForSelectedDate.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 12 && hour < 16;
  });
  
  const eveningSlots = slotsForSelectedDate.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 16;
  });
  
  return (
    <div className="glass-card rounded-lg overflow-hidden animate-scale-in">
      <div className="bg-medical-blue p-4 text-white">
        <h2 className="text-lg font-medium flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Select Appointment Date & Time
        </h2>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-3">
            Available Dates
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {dates.map((date) => (
              <div 
                key={date}
                className={cn(
                  "flex-shrink-0 w-16 h-20 rounded-lg flex flex-col items-center justify-center cursor-pointer border transition-all duration-200",
                  selectedDate === date 
                    ? "bg-medical-blue text-white border-medical-blue" 
                    : "bg-white hover:bg-medical-blue-light border-gray-200"
                )}
                onClick={() => handleDateClick(date)}
              >
                <div className="text-xs font-medium">{getDayName(date)}</div>
                <div className="text-2xl font-semibold">{getDayDate(date)}</div>
                <div className="text-xs">
                  {isToday(parseISO(date)) && "Today"}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {selectedDate && (
          <div className="animate-fade-in">
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">
                {formatDateLabel(selectedDate)}
              </h3>
              <div className="text-sm text-muted-foreground">
                Select a 30-minute time slot
              </div>
            </div>
            
            <Tabs defaultValue="morning">
              <TabsList className="mb-4">
                <TabsTrigger value="morning" disabled={morningSlots.length === 0}>
                  Morning
                </TabsTrigger>
                <TabsTrigger value="afternoon" disabled={afternoonSlots.length === 0}>
                  Afternoon
                </TabsTrigger>
                <TabsTrigger value="evening" disabled={eveningSlots.length === 0}>
                  Evening
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="morning" className="mt-0">
                <div className="grid grid-cols-4 gap-2">
                  {morningSlots.length > 0 ? (
                    morningSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant="outline"
                        className={cn(
                          "h-10",
                          slot.isBooked ? "appointment-slot-booked" : "appointment-slot",
                          selectedSlot?.id === slot.id && "appointment-slot-selected"
                        )}
                        disabled={slot.isBooked}
                        onClick={() => !slot.isBooked && onSelectSlot(slot)}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {format(parseISO(`2000-01-01T${slot.time}`), 'h:mm a')}
                      </Button>
                    ))
                  ) : (
                    <div className="col-span-4 text-center py-4 text-muted-foreground">
                      No morning slots available
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="afternoon" className="mt-0">
                <div className="grid grid-cols-4 gap-2">
                  {afternoonSlots.length > 0 ? (
                    afternoonSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant="outline"
                        className={cn(
                          "h-10",
                          slot.isBooked ? "appointment-slot-booked" : "appointment-slot",
                          selectedSlot?.id === slot.id && "appointment-slot-selected"
                        )}
                        disabled={slot.isBooked}
                        onClick={() => !slot.isBooked && onSelectSlot(slot)}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {format(parseISO(`2000-01-01T${slot.time}`), 'h:mm a')}
                      </Button>
                    ))
                  ) : (
                    <div className="col-span-4 text-center py-4 text-muted-foreground">
                      No afternoon slots available
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="evening" className="mt-0">
                <div className="grid grid-cols-4 gap-2">
                  {eveningSlots.length > 0 ? (
                    eveningSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant="outline"
                        className={cn(
                          "h-10",
                          slot.isBooked ? "appointment-slot-booked" : "appointment-slot",
                          selectedSlot?.id === slot.id && "appointment-slot-selected"
                        )}
                        disabled={slot.isBooked}
                        onClick={() => !slot.isBooked && onSelectSlot(slot)}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {format(parseISO(`2000-01-01T${slot.time}`), 'h:mm a')}
                      </Button>
                    ))
                  ) : (
                    <div className="col-span-4 text-center py-4 text-muted-foreground">
                      No evening slots available
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentScheduler;
