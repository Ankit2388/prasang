import { apiClient } from './api-client';
import { ApiResponse } from '@/types/api.types';
import { Business, BusinessFilters, BusinessesResponse } from '@/types/business.types';

export const businessService = {
  async getBusinesses(filters: BusinessFilters = {}): Promise<BusinessesResponse> {
    const params = new URLSearchParams();

    if (filters.search?.trim()) {
      params.append('search', filters.search.trim());
    }
    if (filters.city?.trim()) {
      params.append('city', filters.city.trim());
    }
    if (filters.cuisine?.trim()) {
      params.append('cuisine', filters.cuisine.trim());
    }
    if (filters.minCapacity !== undefined && filters.minCapacity !== null) {
      params.append('minCapacity', String(filters.minCapacity));
    }
    if (filters.maxCapacity !== undefined && filters.maxCapacity !== null) {
      params.append('maxCapacity', String(filters.maxCapacity));
    }
    if (filters.minRating !== undefined && filters.minRating !== null) {
      params.append('minRating', String(filters.minRating));
    }
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.page) {
      params.append('page', String(filters.page));
    }
    if (filters.limit) {
      params.append('limit', String(filters.limit));
    }

    const response = await apiClient.get<ApiResponse<BusinessesResponse>>('/businesses', {
      params,
    });
    return response.data.data;
  },

  async getBusinessById(id: string): Promise<Business> {
    const response = await apiClient.get<ApiResponse<Business>>(`/businesses/${id}`);
    return response.data.data;
  },
};
