import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getUniqueStates,
  getUniqueCities,
  getUniqueLocalities,
  getFilteredHospitals,
  hospitals as hospitalsData,
  Hospital
} from '@/lib/data';
import HospitalCard from '@/components/HospitalCard';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';

const Index = () => {
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [localities, setLocalities] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedLocality, setSelectedLocality] = useState<string>('');
  const [hospitals, setHospitals] = useState<Hospital[]>(hospitalsData);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  useEffect(() => {
    const uniqueStates = getUniqueStates();
    setStates(uniqueStates);
  }, []);
  
  useEffect(() => {
    if (selectedState) {
      const uniqueCities = getUniqueCities(selectedState);
      setCities(uniqueCities);
      setSelectedCity('');
      setSelectedLocality('');
    } else {
      setCities([]);
      setLocalities([]);
      setSelectedCity('');
      setSelectedLocality('');
    }
  }, [selectedState]);
  
  useEffect(() => {
    if (selectedState && selectedCity) {
      const uniqueLocalities = getUniqueLocalities(selectedState, selectedCity);
      setLocalities(uniqueLocalities);
      setSelectedLocality('');
    } else {
      setLocalities([]);
      setSelectedLocality('');
    }
  }, [selectedState, selectedCity]);
  
  useEffect(() => {
    const filteredHospitals = getFilteredHospitals(selectedState, selectedCity, selectedLocality);
    setHospitals(filteredHospitals);
  }, [selectedState, selectedCity, selectedLocality]);
  
  useEffect(() => {
    if (searchQuery) {
      const filteredHospitals = hospitalsData.filter(hospital =>
        hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setHospitals(filteredHospitals);
    } else {
      const filteredHospitals = getFilteredHospitals(selectedState, selectedCity, selectedLocality);
      setHospitals(filteredHospitals);
    }
  }, [searchQuery, selectedState, selectedCity, selectedLocality]);

  return (
    <div className="min-h-screen bg-medical-gray">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-medium text-medical-blue mr-6">Hospital Finder</h1>
              <nav className="hidden md:flex space-x-4">
                <Link to="/hospibook-navi-gator" className="text-medical-blue font-medium hover:underline">
                  Hospitals
                </Link>
                <Link to="/appointments" className="text-muted-foreground hover:text-medical-blue transition-colors">
                  My Appointments
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin">Admin Portal</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-card rounded-lg p-6 mb-8 animate-scale-in">
          <h2 className="text-2xl font-medium mb-2">Find a Hospital</h2>
          <p className="text-muted-foreground">
            Search for hospitals by location or name
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div>
              <Label htmlFor="search">Search by name</Label>
              <Input 
                type="search" 
                id="search" 
                placeholder="Enter hospital name" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="state">State</Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="city">City</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedState}>
                <SelectTrigger id="city">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="locality">Locality</Label>
              <Select value={selectedLocality} onValueChange={setSelectedLocality} disabled={!selectedCity}>
                <SelectTrigger id="locality">
                  <SelectValue placeholder="Select a locality" />
                </SelectTrigger>
                <SelectContent>
                  {localities.map((locality) => (
                    <SelectItem key={locality} value={locality}>
                      {locality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
