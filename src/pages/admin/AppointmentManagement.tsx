
import { useState } from 'react';
import { userAppointments, hospitals, cancelAppointment } from '@/lib/data';
import { Calendar, Search, Trash2, Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState(userAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  
  // Filter appointments based on search query
  const filteredAppointments = appointments.filter(appointment => {
    const hospital = hospitals.find(h => h.id === appointment.hospitalId);
    if (!hospital) return false;
    
    const slot = hospital.availableSlots.find(s => s.id === appointment.slotId);
    if (!slot) return false;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      appointment.patientName.toLowerCase().includes(searchLower) ||
      appointment.patientEmail.toLowerCase().includes(searchLower) ||
      hospital.name.toLowerCase().includes(searchLower) ||
      slot.date.includes(searchLower)
    );
  });
  
  const handleDeleteClick = (appointmentId: string) => {
    setAppointmentToDelete(appointmentId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (appointmentToDelete) {
      const success = cancelAppointment(appointmentToDelete);
      
      if (success) {
        setAppointments(appointments.filter(a => a.id !== appointmentToDelete));
        toast.success('Appointment cancelled successfully');
      } else {
        toast.error('Failed to cancel appointment');
      }
      
      setIsDeleteDialogOpen(false);
      setAppointmentToDelete(null);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Appointment Management</h1>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Appointments</DropdownMenuItem>
              <DropdownMenuItem>Today's Appointments</DropdownMenuItem>
              <DropdownMenuItem>This Week</DropdownMenuItem>
              <DropdownMenuItem>This Month</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments by patient, email, or hospital..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => {
                  const hospital = hospitals.find(h => h.id === appointment.hospitalId);
                  if (!hospital) return null;
                  
                  const slot = hospital.availableSlots.find(s => s.id === appointment.slotId);
                  if (!slot) return null;
                  
                  return (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-sm text-muted-foreground">{appointment.patientEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{hospital.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-medical-blue" />
                          <span>
                            {format(parseISO(slot.date), 'MMM d, yyyy')} at {' '}
                            {format(parseISO(`2000-01-01T${slot.time}`), 'h:mm a')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.reason || "General Checkup"}</TableCell>
                      <TableCell>
                        {format(parseISO(appointment.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(appointment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No appointments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AppointmentManagement;
