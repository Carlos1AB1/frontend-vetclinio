export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  ownerId: string;
  ownerName: string;
  veterinarianId: string;
  veterinarianName: string;
  date: string;
  time: string;
  duration: number; // minutes
  reason: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentFormData = Omit<Appointment, 'id' | 'patientName' | 'ownerName' | 'veterinarianName' | 'createdAt' | 'updatedAt'>;
