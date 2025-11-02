import api from './api';

export interface Appointment {
  id: string;
  patientId: string;
  patientName?: string;
  ownerId: string;
  ownerName?: string;
  veterinarianId: string;
  veterinarianName?: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
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

export const appointmentService = {
  async getAll(page = 0, size = 10, search = ''): Promise<PageResponse<Appointment>> {
    const params: any = { page, size };
    if (search) params.search = search;
    
    const response = await api.get<ApiResponse<PageResponse<Appointment>>>('/appointments', { params });
    return response.data.data;
  },

  async getById(id: string): Promise<Appointment> {
    const response = await api.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    return response.data.data;
  },

  async getByPatientId(patientId: string): Promise<Appointment[]> {
    const response = await api.get<ApiResponse<Appointment[]>>(`/appointments/patient/${patientId}`);
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

  async create(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'patientName' | 'ownerName' | 'veterinarianName'>): Promise<Appointment> {
    const response = await api.post<ApiResponse<Appointment>>('/appointments', appointment);
    return response.data.data;
  },

  async update(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
    const response = await api.put<ApiResponse<Appointment>>(`/appointments/${id}`, appointment);
    return response.data.data;
  },

  async updateStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    const response = await api.patch<ApiResponse<Appointment>>(`/appointments/${id}/status`, null, {
      params: { status },
    });
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/appointments/${id}`);
  },

  async cancel(id: string): Promise<Appointment> {
    return this.updateStatus(id, 'CANCELLED');
  },

  async confirm(id: string): Promise<Appointment> {
    return this.updateStatus(id, 'CONFIRMED');
  },
};
