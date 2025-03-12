
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Check, Calendar, Clock, MapPin, User } from 'lucide-react';
import { Hospital, AppointmentSlot, bookAppointment, Appointment } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AppointmentConfirmationProps {
  hospital: Hospital;
  selectedSlot: AppointmentSlot;
}

const AppointmentConfirmation = ({ hospital, selectedSlot }: AppointmentConfirmationProps) => {
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientName || !patientEmail || !patientPhone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const appointmentData = {
        hospitalId: hospital.id,
        slotId: selectedSlot.id,
        patientName,
        patientEmail,
        patientPhone,
        reason: reason || 'General checkup',
      };
      
      const appointment = bookAppointment(appointmentData);
      
      toast.success('Appointment booked successfully!');
      navigate('/appointments');
    } catch (error) {
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="glass-card rounded-lg overflow-hidden animate-scale-in">
      <div className="bg-medical-blue p-4 text-white">
        <h2 className="text-lg font-medium flex items-center">
          <Check className="h-5 w-5 mr-2" />
          Confirm Your Appointment
        </h2>
      </div>
      
      <div className="p-6">
        <div className="mb-6 border-b pb-4">
          <h3 className="font-medium text-lg mb-3">{hospital.name}</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-medical-blue" />
              <span>
                {format(parseISO(selectedSlot.date), 'EEEE, MMMM d, yyyy')}
              </span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-medical-blue" />
              <span>
                {format(parseISO(`2000-01-01T${selectedSlot.time}`), 'h:mm a')} - 
                {format(parseISO(`2000-01-01T${selectedSlot.time}`).setMinutes(parseISO(`2000-01-01T${selectedSlot.time}`).getMinutes() + 30), 'h:mm a')}
              </span>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 text-medical-blue mt-0.5" />
              <span>{hospital.address}</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Your Name *</Label>
              <Input
                id="patientName"
                placeholder="Enter your full name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="patientEmail">Email Address *</Label>
              <Input
                id="patientEmail"
                type="email"
                placeholder="your@email.com"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="patientPhone">Phone Number *</Label>
              <Input
                id="patientPhone"
                placeholder="Your phone number"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea
                id="reason"
                placeholder="Please briefly describe the reason for your appointment"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <Button 
              type="submit" 
              className="w-full bg-medical-blue hover:bg-medical-blue/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;
