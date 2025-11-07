import api from './api';
import type { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest } from '@/types/appointment';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any;
  timestamp: string;
}

export const appointmentService = {
  async getAll(page = 0, size = 10, search = ''): Promise<PageResponse<Appointment>> {
    const params: any = { page, size };
    if (search) params.search = search;
    
    console.log('📡 [appointmentService] Llamando a /appointments/page con params:', params);
    const response = await api.get<ApiResponse<PageResponse<Appointment>>>('/appointments/page', { params });
    console.log('📡 [appointmentService] Response completo:', response);
    console.log('📡 [appointmentService] Response.data.data:', response.data.data);
    return response.data.data;
  },

  async getById(id: number): Promise<Appointment> {
    const response = await api.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    return response.data.data;
  },

  async getByPatientId(patientId: number): Promise<Appointment[]> {
    const response = await api.get<ApiResponse<Appointment[]>>(`/appointments/patient/${patientId}`);
    return response.data.data;
  },

  async getByVeterinarianId(veterinarianId: string): Promise<Appointment[]> {
    const response = await api.get<ApiResponse<Appointment[]>>(`/appointments/veterinarian/${veterinarianId}`);
    return response.data.data;
  },

  async getByDate(date: string): Promise<Appointment[]> {
    const response = await api.get<ApiResponse<Appointment[]>>('/appointments/date', {
      params: { date },
    });
    return response.data.data;
  },

  async getByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    const response = await api.get<ApiResponse<Appointment[]>>('/appointments/date-range', {
      params: { startDate, endDate },
    });
    return response.data.data;
  },

  async create(appointment: CreateAppointmentRequest): Promise<Appointment> {
    const response = await api.post<ApiResponse<Appointment>>('/appointments', appointment);
    return response.data.data;
  },

  async update(id: number, appointment: UpdateAppointmentRequest): Promise<Appointment> {
    const response = await api.put<ApiResponse<Appointment>>(`/appointments/${id}`, appointment);
    return response.data.data;
  },

  async updateStatus(id: number, status: Appointment['status']): Promise<Appointment> {
    const response = await api.patch<ApiResponse<Appointment>>(`/appointments/${id}/status`, null, {
      params: { status },
    });
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/appointments/${id}`);
  },

  async search(searchTerm: string): Promise<Appointment[]> {
    const response = await api.get<ApiResponse<Appointment[]>>('/appointments/search', {
      params: { searchTerm },
    });
    return response.data.data;
  },

  async cancel(id: number): Promise<Appointment> {
    return this.updateStatus(id, 'CANCELLED');
  },

  async confirm(id: number): Promise<Appointment> {
    return this.updateStatus(id, 'CONFIRMED');
  },
};
