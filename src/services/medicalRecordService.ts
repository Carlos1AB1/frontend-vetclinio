import api from './api';

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName?: string;
  veterinarianId: string;
  veterinarianName?: string;
  visitDate: string;
  visitReason: string;
  symptoms?: string;
  diagnosis?: string;
  treatment?: string;
  prescriptions?: string;
  notes?: string;
  followUpDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const medicalRecordService = {
  async getAll(page = 0, size = 10): Promise<PageResponse<MedicalRecord>> {
    const response = await api.get<ApiResponse<PageResponse<MedicalRecord>>>('/medical-records', {
      params: { page, size },
    });
    return response.data.data;
  },

  async getById(id: string): Promise<MedicalRecord> {
    const response = await api.get<ApiResponse<MedicalRecord>>(`/medical-records/${id}`);
    return response.data.data;
  },

  async getByPatientId(patientId: string): Promise<MedicalRecord[]> {
    const response = await api.get<ApiResponse<MedicalRecord[]>>(`/medical-records/patient/${patientId}`);
    return response.data.data;
  },

  async create(record: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt' | 'patientName' | 'veterinarianName'>): Promise<MedicalRecord> {
    const response = await api.post<ApiResponse<MedicalRecord>>('/medical-records', record);
    return response.data.data;
  },

  async update(id: string, record: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const response = await api.put<ApiResponse<MedicalRecord>>(`/medical-records/${id}`, record);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/medical-records/${id}`);
  },
};
