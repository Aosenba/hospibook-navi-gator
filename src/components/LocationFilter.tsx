
import { useState, useEffect } from 'react';
import { getUniqueStates, getUniqueCities, getUniqueLocalities } from '@/lib/data';
import { ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationFilterProps {
  onFilterChange: (state: string | null, city: string | null, locality: string | null) => void;
}

const LocationFilter = ({ onFilterChange }: LocationFilterProps) => {
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [localities, setLocalities] = useState<string[]>([]);
  
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedLocality, setSelectedLocality] = useState<string | null>(null);
  
  useEffect(() => {
    setStates(getUniqueStates());
  }, []);
  
  useEffect(() => {
    if (selectedState) {
      setCities(getUniqueCities(selectedState));
      setSelectedCity(null);
      setSelectedLocality(null);
    } else {
      setCities([]);
    }
  }, [selectedState]);
  
  useEffect(() => {
    if (selectedState && selectedCity) {
      setLocalities(getUniqueLocalities(selectedState, selectedCity));
      setSelectedLocality(null);
    } else {
      setLocalities([]);
    }
  }, [selectedState, selectedCity]);
  
  useEffect(() => {
    onFilterChange(selectedState, selectedCity, selectedLocality);
  }, [selectedState, selectedCity, selectedLocality, onFilterChange]);
  
  const handleStateClick = (state: string) => {
    setSelectedState(state);
  };
  
  const handleCityClick = (city: string) => {
    setSelectedCity(city);
  };
  
  const handleLocalityClick = (locality: string) => {
    setSelectedLocality(locality);
  };
  
  const handleClearFilters = () => {
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedLocality(null);
  };
  
  return (
    <div className="glass-card rounded-lg p-6 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Filter by Location</h2>
        {(selectedState || selectedCity || selectedLocality) && (
          <button 
            onClick={handleClearFilters}
            className="text-sm text-medical-blue hover:underline"
          >
            Clear All
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span>State</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {states.map((state) => (
              <div 
                key={state}
                className={cn(
                  "location-item p-2 rounded-md cursor-pointer text-sm",
                  selectedState === state ? "bg-medical-blue text-white" : "hover:bg-medical-blue-light"
                )}
                onClick={() => handleStateClick(state)}
              >
                {state}
              </div>
            ))}
          </div>
        </div>
        
        {selectedState && cities.length > 0 && (
          <div className="space-y-2 animate-slide-up">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <ChevronRight className="h-4 w-4 mr-1" />
              <span>City</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {cities.map((city) => (
                <div 
                  key={city}
                  className={cn(
                    "location-item p-2 rounded-md cursor-pointer text-sm",
                    selectedCity === city ? "bg-medical-blue text-white" : "hover:bg-medical-blue-light"
                  )}
                  onClick={() => handleCityClick(city)}
                >
                  {city}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedState && selectedCity && localities.length > 0 && (
          <div className="space-y-2 animate-slide-up">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <ChevronRight className="h-4 w-4 mr-1" />
              <span>Locality</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {localities.map((locality) => (
                <div 
                  key={locality}
                  className={cn(
                    "location-item p-2 rounded-md cursor-pointer text-sm",
                    selectedLocality === locality ? "bg-medical-blue text-white" : "hover:bg-medical-blue-light"
                  )}
                  onClick={() => handleLocalityClick(locality)}
                >
                  {locality}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {selectedState && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            <div className="medical-chip">
              {selectedState}
            </div>
            {selectedCity && (
              <div className="medical-chip">
                {selectedCity}
              </div>
            )}
            {selectedLocality && (
              <div className="medical-chip">
                {selectedLocality}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationFilter;
