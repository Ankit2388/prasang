import { apiClient } from './api-client';
import { ApiResponse } from '@/types/api.types';
import {
  PublicVendor,
  EstimationRequestInput,
  EstimationRequestResult,
} from '@/types/vendor.types';

export const vendorService = {
  async getPublicVendors(): Promise<PublicVendor[]> {
    const response = await apiClient.get<ApiResponse<PublicVendor[]>>('/vendors/public');
    return response.data.data || [];
  },

  async getPublicVendorById(id: string): Promise<PublicVendor> {
    const response = await apiClient.get<ApiResponse<PublicVendor>>(`/vendors/public/${id}`);
    return response.data.data;
  },

  async requestEstimation(data: EstimationRequestInput): Promise<EstimationRequestResult> {
    const response = await apiClient.post<ApiResponse<EstimationRequestResult>>(
      '/vendors/estimation-request',
      data
    );
    return response.data.data;
  },
};
