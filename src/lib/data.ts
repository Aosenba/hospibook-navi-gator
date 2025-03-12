
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
    name: "Zion hospital and Research Centre",
    state: "Nagaland",
    city: "Dimapur",
    locality: "Purana Bazar",
    address: "Zion Hospital, Purana Bazar, Dimapur, Nagaland 797112, India",
    specialties: ["Cardiology", "Neurology", "Oncology"],
    rating: 3.1,
    image: "https://lh3.googleusercontent.com/p/AF1QipP3rkDILGcJxt7LlulGkpO_-K7fsCQ8tQdDiI89=s1360-w1360-h1020",
    availableSlots: generateAppointmentSlots(),
  },
  {
    id: "h2",
    name: "Christian Institute Of Health Sciences & Research",
    state: "Nagaland",
    city: "Dimapur",
    locality: "4th Mile",
    address: " P.B No 31, 4th Mile, P.O, ARTC, Dimapur, Nagaland 797115, India",
    specialties: ["Orthopedics", "Pediatrics", "Surgery"],
    rating: 4.1,
    image: "https://lh5.googleusercontent.com/p/AF1QipPxwm_tKIkJDHfrUoSrrC5-qdwsFGfZjdiDO_no=w325-h218-n-k-no",
    availableSlots: generateAppointmentSlots(),
  },
  {
    id: "h3",
    name: "Eden Medical Centrel",
    state: "Nagaland",
    city: "Dimapur",
    locality: "Oriental Colony",
    address: "ub-Jail Rd, near Sub Jail, Oriental Colony, Dimapur, Nagaland 797112, India",
    specialties: ["Dermatology", "Psychiatry", "Radiology"],
    rating: 3.9,
    image: "https://lh3.googleusercontent.com/p/AF1QipN8sSxDyvps2ryAT3HkE6st0E0Wv84D3aM6DZRm=s680-w680-h510",
    availableSlots: generateAppointmentSlots(),
  },
  {
    id: "h4",
    name: "Oking Hospital",
    state: "Nagaland",
    city: "Kohima",
    locality: "Kohima-Mokokchung Rd",
    address: "M494+J8F, Kohima-Mokokchung Rd, opp. Bandhan Bank, Kohima, Nagaland 797001, India",
    specialties: ["Cardiology", "Oncology", "Transplant"],
    rating: 3.3,
    image: "https://lh3.googleusercontent.com/p/AF1QipMwQQcgujI9Wbta_GTCsEs2kmg7eJpl4GKT0q_W=s1360-w1360-h1020",
    availableSlots: generateAppointmentSlots(),
  },

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
