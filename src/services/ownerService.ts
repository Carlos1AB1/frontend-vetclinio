import api from './api';
import type { Owner } from '@/types/owner';

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

export const ownerService = {
  async getAll(page = 0, size = 10, search = ''): Promise<PageResponse<Owner>> {
    // Usar el endpoint de paginación /owners/page
    const params: any = { page, size, sortBy: 'lastName', sortDirection: 'ASC' };
    if (search) params.search = search;
    
    const response = await api.get<ApiResponse<PageResponse<Owner>>>('/owners/page', { params });
    return response.data.data;
  },

  async getById(id: string): Promise<Owner> {
    const response = await api.get<ApiResponse<Owner>>(`/owners/${id}`);
    return response.data.data;
  },

  async create(owner: Omit<Owner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Owner> {
    const response = await api.post<ApiResponse<Owner>>('/owners', owner);
    return response.data.data;
  },

  async update(id: string, owner: Partial<Owner>): Promise<Owner> {
    const response = await api.put<ApiResponse<Owner>>(`/owners/${id}`, owner);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/owners/${id}`);
  },

  async search(searchTerm: string): Promise<Owner[]> {
    const response = await api.get<ApiResponse<Owner[]>>('/owners/search', {
      params: { q: searchTerm },
    });
    return response.data.data;
  },
};
