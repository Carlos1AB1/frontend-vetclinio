export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  veterinarianId: string;
  veterinarianName: string;
  date: string;
  reason: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  prescriptions?: string;
  weight?: number;
  temperature?: number;
  heartRate?: number;
  observations?: string;
  nextVisit?: string;
  createdAt: string;
  updatedAt: string;
}

export type MedicalRecordFormData = Omit<MedicalRecord, 'id' | 'patientName' | 'veterinarianName' | 'createdAt' | 'updatedAt'>;
