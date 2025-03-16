
import React, { useState } from 'react';
import { format, parseISO, isToday, addDays } from 'date-fns';
import { Search, Calendar, Clock, User, UserCheck, UserX, Phone, Mail, Filter, RefreshCw } from 'lucide-react';
import { hospitals, userAppointments, getHospitalById, cancelAppointment, AppointmentSlot, Appointment } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { PatientDetails } from '@/components/reception/PatientDetails';
import { PatientCheckIn } from '@/components/reception/PatientCheckIn';

const ReceptionConsole = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'today' | 'upcoming'>('today');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isCheckInDialogOpen, setIsCheckInDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get today's appointments
  const todayDateString = format(new Date(), 'yyyy-MM-dd');
  
  // Filter appointments based on the view mode
  const filteredAppointments = userAppointments.filter(appointment => {
    const hospital = getHospitalById(appointment.hospitalId);
    if (!hospital) return false;
    
    const slot = hospital.availableSlots.find(s => s.id === appointment.slotId);
    if (!slot) return false;
    
    // Apply date filter
    if (viewMode === 'today' && slot.date !== todayDateString) {
      return false;
    }
    
    if (viewMode === 'upcoming' && new Date(slot.date) < new Date(todayDateString)) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        appointment.patientName.toLowerCase().includes(searchLower) ||
        appointment.patientEmail.toLowerCase().includes(searchLower) ||
        appointment.patientPhone.toLowerCase().includes(searchLower) ||
        hospital.name.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Sort appointments by date and time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const slotA = hospitals
      .find(h => h.id === a.hospitalId)
      ?.availableSlots.find(s => s.id === a.slotId);
    const slotB = hospitals
      .find(h => h.id === b.hospitalId)
      ?.availableSlots.find(s => s.id === b.slotId);
      
    if (!slotA || !slotB) return 0;
    
    // First compare by date
    const dateComparison = slotA.date.localeCompare(slotB.date);
    if (dateComparison !== 0) return dateComparison;
    
    // Then compare by time
    return slotA.time.localeCompare(slotB.time);
  });
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Appointment data refreshed");
    }, 800);
  };
  
  const handleCheckIn = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsCheckInDialogOpen(true);
  };
  
  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsDialogOpen(true);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reception Console</h1>
            <p className="text-muted-foreground">Manage appointments and check-in patients</p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patient Queue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointments" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients by name, phone or email..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'today' ? 'default' : 'outline'} 
                  onClick={() => setViewMode('today')}
                  className="flex-grow sm:flex-grow-0"
                >
                  Today
                </Button>
                <Button 
                  variant={viewMode === 'upcoming' ? 'default' : 'outline'} 
                  onClick={() => setViewMode('upcoming')}
                  className="flex-grow sm:flex-grow-0"
                >
                  Upcoming
                </Button>
                <Button 
                  variant={viewMode === 'all' ? 'default' : 'outline'} 
                  onClick={() => setViewMode('all')}
                  className="flex-grow sm:flex-grow-0"
                >
                  All
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Date & Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAppointments.length > 0 ? (
                    sortedAppointments.map((appointment) => {
                      const hospital = getHospitalById(appointment.hospitalId);
                      if (!hospital) return null;
                      
                      const slot = hospital.availableSlots.find(s => s.id === appointment.slotId);
                      if (!slot) return null;
                      
                      const appointmentDate = parseISO(slot.date);
                      const isUpcoming = appointmentDate >= new Date();
                      
                      return (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div className="font-medium flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-medical-blue" />
                              {format(parseISO(slot.date), 'MMM d, yyyy')}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(parseISO(`2000-01-01T${slot.time}`), 'h:mm a')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{appointment.patientName}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[180px]">
                              {appointment.reason || "General checkup"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {appointment.patientPhone}
                            </div>
                            <div className="text-sm flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {appointment.patientEmail}
                            </div>
                          </TableCell>
                          <TableCell>{hospital.name}</TableCell>
                          <TableCell>
                            {isToday(appointmentDate) ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Today
                              </span>
                            ) : isUpcoming ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Upcoming
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400">
                                Past
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDetails(appointment)}
                              >
                                <User className="h-4 w-4" />
                              </Button>
                              {isToday(appointmentDate) && (
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  className="bg-medical-blue hover:bg-medical-blue/90"
                                  onClick={() => handleCheckIn(appointment)}
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Check In
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        {viewMode === 'today' ? (
                          <>No appointments scheduled for today.</>
                        ) : viewMode === 'upcoming' ? (
                          <>No upcoming appointments scheduled.</>
                        ) : (
                          <>No appointments found.</>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="patients" className="space-y-4">
            <div className="bg-white rounded-md border p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Today's Check-ins</h3>
                <p className="text-muted-foreground">
                  Patient queue feature will be available soon. This tab will display checked-in patients waiting to be seen.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Patient details dialog */}
      {selectedAppointment && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Patient Details</DialogTitle>
              <DialogDescription>
                View appointment and patient information.
              </DialogDescription>
            </DialogHeader>
            
            <PatientDetails 
              appointment={selectedAppointment} 
              onClose={() => setIsDetailsDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Patient check-in dialog */}
      {selectedAppointment && (
        <Dialog open={isCheckInDialogOpen} onOpenChange={setIsCheckInDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Check-in Patient</DialogTitle>
              <DialogDescription>
                Confirm patient arrival and collect additional information if needed.
              </DialogDescription>
            </DialogHeader>
            
            <PatientCheckIn 
              appointment={selectedAppointment} 
              onClose={() => setIsCheckInDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default ReceptionConsole;
