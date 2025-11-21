import api from './api';

export interface InformedConsent {
  id: number;
  patientId: number;
  patientName?: string;
  procedureType: string;
  description: string;
  risks?: string;
  benefits?: string;
  alternatives?: string;
  signedBy?: string;
  signature?: string;
  signedAt?: string;
  status: 'PENDING' | 'SIGNED' | 'CANCELLED';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInformedConsentRequest {
  patientId: number;
  procedureType: string;
  description: string;
  risks?: string;
  benefits?: string;
  alternatives?: string;
}

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
}

export const informedConsentService = {
  async getAll(page = 0, size = 10): Promise<PageResponse<InformedConsent>> {
    const params = { page, size, sortBy: 'createdAt', sortDirection: 'DESC' };
    const response = await api.get<ApiResponse<PageResponse<InformedConsent>>>('/informed-consents/page', { params });
    return response.data.data;
  },

  async getById(id: number): Promise<InformedConsent> {
    const response = await api.get<ApiResponse<InformedConsent>>(`/informed-consents/${id}`);
    return response.data.data;
  },

  async getByPatientId(patientId: number): Promise<InformedConsent[]> {
    const response = await api.get<ApiResponse<InformedConsent[]>>(`/informed-consents/patient/${patientId}`);
    return response.data.data;
  },

  async getPendingConsents(): Promise<InformedConsent[]> {
    const response = await api.get<ApiResponse<InformedConsent[]>>('/informed-consents/pending');
    return response.data.data;
  },

  async create(consent: CreateInformedConsentRequest): Promise<InformedConsent> {
    const response = await api.post<ApiResponse<InformedConsent>>('/informed-consents', consent);
    return response.data.data;
  },

  async signConsent(id: number, signature: string): Promise<InformedConsent> {
    const response = await api.put<ApiResponse<InformedConsent>>(`/informed-consents/${id}/sign`, null, {
      params: { signature },
    });
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/informed-consents/${id}`);
  },
};

