
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAppointments, getHospitalById, cancelAppointment } from '@/lib/data';
import { ArrowLeft, Calendar, Clock, MapPin, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Appointments = () => {
  const [appointments, setAppointments] = useState(userAppointments);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  
  const handleCancelAppointment = (appointmentId: string) => {
    setAppointmentToDelete(appointmentId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmCancelAppointment = () => {
    if (appointmentToDelete) {
      const success = cancelAppointment(appointmentToDelete);
      
      if (success) {
        toast.success('Appointment cancelled successfully');
        setAppointments(appointments.filter(a => a.id !== appointmentToDelete));
      } else {
        toast.error('Failed to cancel appointment');
      }
      
      setIsDeleteDialogOpen(false);
      setAppointmentToDelete(null);
    }
  };
  
  return (
    <div className="min-h-screen bg-medical-gray">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-medical-blue hover:underline">
                <ArrowLeft className="h-5 w-5 mr-1" />
                <span>Back to Hospitals</span>
              </Link>
            </div>
            
            <nav className="flex space-x-4">
              <Link to="/" className="text-muted-foreground hover:text-medical-blue transition-colors">
                Hospitals
              </Link>
              <Link to="/appointments" className="text-medical-blue font-medium hover:underline">
                My Appointments
              </Link>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin">Admin Portal</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-card rounded-lg p-6 mb-8 animate-scale-in">
          <h1 className="text-2xl font-medium mb-2">My Appointments</h1>
          <p className="text-muted-foreground">
            View and manage your upcoming hospital appointments
          </p>
        </div>
        
        {appointments.length > 0 ? (
          <div className="space-y-6">
            {appointments.map((appointment) => {
              const hospital = getHospitalById(appointment.hospitalId);
              if (!hospital) return null;
              
              const slot = hospital.availableSlots.find(s => s.id === appointment.slotId);
              if (!slot) return null;
              
              return (
                <div key={appointment.id} className="glass-card rounded-lg overflow-hidden animate-scale-in">
                  <div className="bg-medical-blue p-4 text-white flex justify-between items-center">
                    <h2 className="text-lg font-medium">{hospital.name}</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Date & Time</div>
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-medical-blue" />
                            <span>{format(parseISO(slot.date), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-medical-blue" />
                            <span>{format(parseISO(`2000-01-01T${slot.time}`), 'h:mm a')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Location</div>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-1 text-medical-blue mt-0.5" />
                          <span>{hospital.address}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Patient</div>
                        <div>{appointment.patientName}</div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.reason || "General checkup"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card rounded-lg p-8 text-center animate-scale-in">
            <Calendar className="h-12 w-12 text-medical-blue mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-medium mb-2">No Appointments Found</h2>
            <p className="text-muted-foreground mb-4">
              You don't have any upcoming appointments scheduled
            </p>
            <Button asChild>
              <Link to="/">Book an Appointment</Link>
            </Button>
          </div>
        )}
      </main>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelAppointment}>
              Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Appointments;
