
import { useState } from 'react';
import { getFilteredHospitals } from '@/lib/data';
import LocationFilter from '@/components/LocationFilter';
import HospitalCard from '@/components/HospitalCard';
import { Building, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const Index = () => {
  const [filteredHospitals, setFilteredHospitals] = useState(getFilteredHospitals());
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleFilterChange = (state: string | null, city: string | null, locality: string | null) => {
    const hospitals = getFilteredHospitals(state || undefined, city || undefined, locality || undefined);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = hospitals.filter(hospital => 
        hospital.name.toLowerCase().includes(query) ||
        hospital.specialties.some(specialty => specialty.toLowerCase().includes(query))
      );
      setFilteredHospitals(filtered);
    } else {
      setFilteredHospitals(hospitals);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query) {
      const filtered = filteredHospitals.filter(hospital => 
        hospital.name.toLowerCase().includes(query.toLowerCase()) ||
        hospital.specialties.some(specialty => specialty.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredHospitals(filtered);
    } else {
      handleFilterChange(null, null, null);
    }
  };
  
  return (
    <div className="min-h-screen bg-medical-gray">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <Link to="/" className="text-2xl font-medium text-medical-blue flex items-center">
                <Building className="h-6 w-6 mr-2" />
                MediAppoint
              </Link>
            </div>
            
            <nav className="flex space-x-4">
              <Link to="/" className="text-medical-blue font-medium hover:underline">
                Hospitals
              </Link>
              <Link to="/appointments" className="text-muted-foreground hover:text-medical-blue transition-colors">
                My Appointments
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 lg:w-1/4">
            <LocationFilter onFilterChange={handleFilterChange} />
          </div>
          
          <div className="md:w-2/3 lg:w-3/4">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search hospitals by name or specialty"
                  className="pl-10 h-12 bg-white"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            {filteredHospitals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHospitals.map((hospital) => (
                  <HospitalCard key={hospital.id} hospital={hospital} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass-card rounded-lg">
                <h3 className="text-xl font-medium mb-2">No hospitals found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
