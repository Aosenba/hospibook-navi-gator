import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getHospitalById, AppointmentSlot } from '@/lib/data';
import { ArrowLeft, Star, MapPin, Phone, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppointmentScheduler from '@/components/AppointmentScheduler';
import AppointmentConfirmation from '@/components/AppointmentConfirmation';
import { toast } from 'sonner';

const HospitalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  
  const hospital = id ? getHospitalById(id) : undefined;
  
  useEffect(() => {
    if (!hospital) {
      toast.error('Hospital not found');
      navigate('/hospibook-navi-gator');
    }
  }, [hospital, navigate]);
  
  if (!hospital) {
    return null;
  }
  
  const handleSelectSlot = (slot: AppointmentSlot) => {
    setSelectedSlot(slot);
  };
  
  return (
    <div className="min-h-screen bg-medical-gray">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/hospibook-navi-gator" className="flex items-center text-medical-blue hover:underline">
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Back to Hospitals</span>
            </Link>
            
            <nav className="flex space-x-4">
              <Link to="/hospibook-navi-gator" className="text-muted-foreground hover:text-medical-blue transition-colors">
                Hospitals
              </Link>
              <Link to="/appointments" className="text-muted-foreground hover:text-medical-blue transition-colors">
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
        <div className="glass-card rounded-lg overflow-hidden mb-8 animate-scale-in">
          <div className="relative h-64 md:h-80">
            <img 
              src={hospital.image} 
              alt={hospital.name}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl font-medium mb-2">{hospital.name}</h1>
                <div className="flex items-center text-white/90 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{hospital.address}</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center mr-3">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span>{hospital.rating}</span>
                  </div>
                  
                  {hospital.specialties.map((specialty, index) => (
                    <span 
                      key={index} 
                      className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm mr-2"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card rounded-lg p-4 flex items-center justify-center">
                <Phone className="h-5 w-5 text-medical-blue mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              
              <div className="glass-card rounded-lg p-4 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-medical-blue mr-2" />
                <span>Mon-Fri: 9AM-5PM</span>
              </div>
              
              <div className="glass-card rounded-lg p-4 flex items-center justify-center">
                <Clock className="h-5 w-5 text-medical-blue mr-2" />
                <span>30-minute appointments</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AppointmentScheduler 
            availableSlots={hospital.availableSlots}
            onSelectSlot={handleSelectSlot}
            selectedSlot={selectedSlot}
          />
          
          {selectedSlot ? (
            <AppointmentConfirmation
              hospital={hospital}
              selectedSlot={selectedSlot}
            />
          ) : (
            <div className="glass-card rounded-lg flex items-center justify-center p-8 animate-scale-in">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-medical-blue mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">Select a Time Slot</h3>
                <p className="text-muted-foreground mb-4">
                  Choose an available appointment time from the calendar
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HospitalDetail;
