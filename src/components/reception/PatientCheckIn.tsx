
import React, { useState } from 'react';
import { Clock, UserCheck } from 'lucide-react';
import { Appointment, getHospitalById } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

interface PatientCheckInProps {
  appointment: Appointment;
  onClose: () => void;
}

export function PatientCheckIn({ appointment, onClose }: PatientCheckInProps) {
  const [notes, setNotes] = useState('');
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [arrivalTime, setArrivalTime] = useState(format(new Date(), 'HH:mm'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const hospital = getHospitalById(appointment.hospitalId);
  if (!hospital) return null;
  
  const slot = hospital.availableSlots.find(s => s.id === appointment.slotId);
  if (!slot) return null;
  
  const handleCheckIn = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`${appointment.patientName} has been checked in successfully`);
      onClose();
    }, 1000);
  };
  
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <div className="font-medium">Patient: {appointment.patientName}</div>
        <div className="text-sm text-muted-foreground flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Appointment time: {format(parseISO(`2000-01-01T${slot.time}`), 'h:mm a')}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="arrival-time">Arrival Time</Label>
        <Input
          id="arrival-time"
          type="time"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="first-visit"
          checked={isFirstVisit}
          onCheckedChange={(checked) => setIsFirstVisit(!!checked)}
        />
        <Label htmlFor="first-visit" className="text-sm font-normal">
          This is patient's first visit
        </Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Enter any additional notes about the patient's visit"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleCheckIn}
          disabled={isSubmitting}
          className="bg-medical-blue hover:bg-medical-blue/90"
        >
          <UserCheck className="h-4 w-4 mr-2" />
          {isSubmitting ? "Processing..." : "Confirm Check-in"}
        </Button>
      </DialogFooter>
    </div>
  );
}
