import { apiClient } from './api-client';
import { ApiResponse } from '@/types/api.types';
import { Menu, MenuItem } from '@/types/menu.types';

export const menuService = {
  async getMenusByBusinessId(businessId: string): Promise<Menu[]> {
    const response = await apiClient.get<ApiResponse<Menu[]>>(`/menus/business/${businessId}`);
    return response.data.data || [];
  },

  async getMenuItemsByBusinessId(businessId: string): Promise<MenuItem[]> {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>(
      `/menu-items/business/${businessId}`
    );
    return response.data.data || [];
  },

  async getMenuById(id: string): Promise<Menu> {
    const response = await apiClient.get<ApiResponse<Menu>>(`/menus/${id}`);
    return response.data.data;
  },
};
