
import { useState } from 'react';
import { hospitals, Hospital } from '@/lib/data';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

const HospitalManagement = () => {
  const [hospitalsList, setHospitalsList] = useState<Hospital[]>(hospitals);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [hospitalToDelete, setHospitalToDelete] = useState<string | null>(null);
  
  // Filter hospitals based on search query
  const filteredHospitals = hospitalsList.filter(hospital => 
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.state.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDeleteClick = (hospitalId: string) => {
    setHospitalToDelete(hospitalId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (hospitalToDelete) {
      setHospitalsList(hospitalsList.filter(h => h.id !== hospitalToDelete));
      toast.success('Hospital deleted successfully');
      setIsDeleteDialogOpen(false);
      setHospitalToDelete(null);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Hospital Management</h1>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add New Hospital
          </Button>
        </div>
        
        <div className="flex items-center relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hospitals by name, city, or state..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Specialties</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Available Slots</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHospitals.length > 0 ? (
                filteredHospitals.map((hospital) => {
                  const availableSlots = hospital.availableSlots.filter(slot => !slot.isBooked).length;
                  
                  return (
                    <TableRow key={hospital.id}>
                      <TableCell className="font-medium">{hospital.name}</TableCell>
                      <TableCell>{hospital.city}, {hospital.state}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {hospital.specialties.slice(0, 2).map((specialty, index) => (
                            <span key={index} className="medical-chip text-xs py-0 px-2">
                              {specialty}
                            </span>
                          ))}
                          {hospital.specialties.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{hospital.specialties.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{hospital.rating}</TableCell>
                      <TableCell>{availableSlots}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(hospital.id)}
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
                    No hospitals found.
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
            <DialogTitle>Delete Hospital</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this hospital? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default HospitalManagement;
