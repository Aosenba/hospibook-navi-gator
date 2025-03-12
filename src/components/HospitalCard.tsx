
import { Hospital } from '@/lib/data';
import { Star, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface HospitalCardProps {
  hospital: Hospital;
}

const HospitalCard = ({ hospital }: HospitalCardProps) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/hospital/${hospital.id}`);
  };
  
  // Count available slots for today
  const today = new Date().toISOString().split('T')[0];
  const availableTodayCount = hospital.availableSlots.filter(
    slot => slot.date === today && !slot.isBooked
  ).length;
  
  return (
    <div 
      className="glass-card overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer animate-scale-in"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={hospital.image} 
          alt={hospital.name}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium">{hospital.rating}</span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-medium mb-2 line-clamp-1">{hospital.name}</h3>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{hospital.locality}, {hospital.city}, {hospital.state}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {hospital.specialties.slice(0, 3).map((specialty, index) => (
            <span 
              key={index} 
              className="medical-chip"
            >
              {specialty}
            </span>
          ))}
        </div>
        
        <div className={cn(
          "flex items-center text-sm mt-auto",
          availableTodayCount > 0 ? "text-medical-success" : "text-muted-foreground"
        )}>
          <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
          {availableTodayCount > 0 
            ? `${availableTodayCount} time slots available today` 
            : "No appointments available today"}
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;
