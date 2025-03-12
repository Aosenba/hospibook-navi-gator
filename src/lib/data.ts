
export interface Hospital {
  id: string;
  name: string;
  state: string;
  city: string;
  locality: string;
  address: string;
  specialties: string[];
  rating: number;
  image: string;
  availableSlots: AppointmentSlot[];
}

export interface AppointmentSlot {
  id: string;
  date: string;
  time: string;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  hospitalId: string;
  slotId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  reason: string;
  createdAt: string;
}

// Helper function to generate appointment slots for the next 7 days
const generateAppointmentSlots = (): AppointmentSlot[] => {
  const slots: AppointmentSlot[] = [];
  const now = new Date();
  
  // Generate slots for the next 7 days
  for (let day = 0; day < 7; day++) {
    const date = new Date();
    date.setDate(now.getDate() + day);
    const dateString = date.toISOString().split('T')[0];
    
    // Generate 30-minute slots from 9 AM to 5 PM
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isBooked = Math.random() < 0.3; // 30% chance of being booked
        
        slots.push({
          id: `${dateString}-${timeString}`,
          date: dateString,
          time: timeString,
          isBooked,
        });
      }
    }
  }
  
  return slots;
};

// Generate mock hospitals data
export const hospitals: Hospital[] = [
  {
    id: "h1",
    name: "Mercy General Hospital",
    state: "California",
    city: "San Francisco",
    locality: "Downtown",
    address: "123 Healthcare Ave, San Francisco, CA 94101",
    specialties: ["Cardiology", "Neurology", "Oncology"],
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80",
    availableSlots: generateAppointmentSlots(),
  },
  {
    id: "h2",
    name: "St. Mary's Medical Center",
    state: "California",
    city: "San Francisco",
    locality: "Richmond",
    address: "456 Health Blvd, San Francisco, CA 94118",
    specialties: ["Orthopedics", "Pediatrics", "Surgery"],
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2153&q=80",
    availableSlots: generateAppointmentSlots(),
  },
  {
    id: "h3",
    name: "Golden Gate Medical",
    state: "California",
    city: "San Francisco",
    locality: "Sunset",
    address: "789 Wellness Way, San Francisco, CA 94122",
    specialties: ["Dermatology", "Psychiatry", "Radiology"],
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
    availableSlots: generateAppointmentSlots(),
  },
  {
    id: "h4",
    name: "UCLA Medical Center",
    state: "California",
    city: "Los Angeles",
    locality: "Westwood",
    address: "100 Medical Plaza Dr, Los Angeles, CA 90095",
    specialties: ["Cardiology", "Oncology", "Transplant"],
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1516549655669-9e0b2bfce7f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    availableSlots: generateAppointmentSlots(),
  },
  {
    id: "h5",
    name: "Cedars-Sinai",
    state: "California",
    city: "Los Angeles",
    locality: "Beverly Hills",
    address: "8700 Beverly Blvd, Los Angeles, CA 90048",
    specialties: ["Neurosurgery", "Cardiology", "Gastroenterology"],
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
    availableSlots: generateAppointmentSlots(),
  },
  {
    id: "h6",
    name: "NY Presbyterian",
    state: "New York",
    city: "New York",
    locality: "Manhattan",
    address: "525 E 68th St, New York, NY 10065",
    specialties: ["Cardiology", "Oncology", "Neurology"],
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2835&q=80",
    availableSlots: generateAppointmentSlots(),
  },
  {
    id: "h7",
    name: "Mount Sinai Hospital",
    state: "New York",
    city: "New York",
    locality: "Upper East Side",
    address: "1 Gustave L. Levy Pl, New York, NY 10029",
    specialties: ["Cardiology", "Pulmonology", "Rheumatology"],
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1516549655669-9e0b2bfce7f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    availableSlots: generateAppointmentSlots(),
  },
  {
    id: "h8",
    name: "NYU Langone",
    state: "New York",
    city: "New York",
    locality: "Midtown",
    address: "550 1st Ave, New York, NY 10016",
    specialties: ["Orthopedics", "Neurosurgery", "Urology"],
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1516549655669-9e0b2bfce7f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    availableSlots: generateAppointmentSlots(),
  }
];

// Get unique states from hospitals
export const getUniqueStates = (): string[] => {
  return Array.from(new Set(hospitals.map(hospital => hospital.state)));
};

// Get unique cities for a given state
export const getUniqueCities = (state: string): string[] => {
  const citiesInState = hospitals
    .filter(hospital => hospital.state === state)
    .map(hospital => hospital.city);
  return Array.from(new Set(citiesInState));
};

// Get unique localities for a given state and city
export const getUniqueLocalities = (state: string, city: string): string[] => {
  const localitiesInCity = hospitals
    .filter(hospital => hospital.state === state && hospital.city === city)
    .map(hospital => hospital.locality);
  return Array.from(new Set(localitiesInCity));
};

// Get hospitals filtered by location
export const getFilteredHospitals = (
  state?: string,
  city?: string,
  locality?: string
): Hospital[] => {
  return hospitals.filter(hospital => {
    if (state && hospital.state !== state) return false;
    if (city && hospital.city !== city) return false;
    if (locality && hospital.locality !== locality) return false;
    return true;
  });
};

// Get a specific hospital by ID
export const getHospitalById = (id: string): Hospital | undefined => {
  return hospitals.find(hospital => hospital.id === id);
};

// Mock user appointments
export const userAppointments: Appointment[] = [
  // Example of a booked appointment
  // {
  //   id: "a1",
  //   hospitalId: "h1",
  //   slotId: "2023-10-15-14:00",
  //   patientName: "John Doe",
  //   patientEmail: "john@example.com",
  //   patientPhone: "123-456-7890",
  //   reason: "Annual checkup",
  //   createdAt: "2023-10-01T10:30:00Z",
  // }
];

// Book an appointment
export const bookAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
  const id = `a${userAppointments.length + 1}`;
  const createdAt = new Date().toISOString();
  
  const newAppointment: Appointment = {
    ...appointment,
    id,
    createdAt,
  };
  
  // Mark the slot as booked
  const hospital = hospitals.find(h => h.id === appointment.hospitalId);
  if (hospital) {
    const slot = hospital.availableSlots.find(s => s.id === appointment.slotId);
    if (slot) {
      slot.isBooked = true;
    }
  }
  
  userAppointments.push(newAppointment);
  return newAppointment;
};

// Cancel an appointment
export const cancelAppointment = (appointmentId: string): boolean => {
  const index = userAppointments.findIndex(a => a.id === appointmentId);
  if (index === -1) return false;
  
  const appointment = userAppointments[index];
  
  // Mark the slot as available again
  const hospital = hospitals.find(h => h.id === appointment.hospitalId);
  if (hospital) {
    const slot = hospital.availableSlots.find(s => s.id === appointment.slotId);
    if (slot) {
      slot.isBooked = false;
    }
  }
  
  userAppointments.splice(index, 1);
  return true;
};
