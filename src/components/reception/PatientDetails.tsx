
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, MapPin, User, Phone, Mail, FileText } from 'lucide-react';
import { getHospitalById, Appointment } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';

interface PatientDetailsProps {
  appointment: Appointment;
  onClose: () => void;
}

export function PatientDetails({ appointment, onClose }: PatientDetailsProps) {
  const hospital = getHospitalById(appointment.hospitalId);
  if (!hospital) return null;
  
  const slot = hospital.availableSlots.find(s => s.id === appointment.slotId);
  if (!slot) return null;
  
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Patient Information</Label>
        <div className="rounded-md border p-3 space-y-2">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-medical-blue mt-0.5" />
            <div>
              <div className="font-medium">{appointment.patientName}</div>
              <div className="text-sm text-muted-foreground">Patient ID: {appointment.id.toUpperCase()}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-medical-blue" />
            <span>{appointment.patientPhone}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-medical-blue" />
            <span>{appointment.patientEmail}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Appointment Details</Label>
        <div className="rounded-md border p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-medical-blue" />
            <span>{format(parseISO(slot.date), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-medical-blue" />
            <span>{format(parseISO(`2000-01-01T${slot.time}`), 'h:mm a')}</span>
          </div>
          
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-medical-blue mt-0.5" />
            <span>{hospital.name} - {hospital.address}</span>
          </div>
          
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-medical-blue mt-0.5" />
            <span>{appointment.reason || "General checkup"}</span>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </div>
  );
}
