import { Menu } from './menu.types';

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface BusinessHoursItem {
  day: DayOfWeek;
  isOpen: boolean;
  openingTime?: string;
  closingTime?: string;
}

export interface BusinessContact {
  phone?: string;
  email?: string;
  website?: string;
}

export interface BusinessCapacity {
  minGuests?: number;
  maxGuests?: number;
}

export interface BusinessLocation {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export type BusinessStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface Business {
  id: string;
  vendorId: string;
  businessName: string;
  description?: string;
  cuisineTypes: string[];
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  location?: BusinessLocation;
  contactInformation?: BusinessContact;
  capacity?: BusinessCapacity;
  businessHours?: BusinessHoursItem[];
  status: BusinessStatus;
  averageRating: number;
  totalReviews: number;
  coverImage?: string;
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
  vendor?: {
    id: string;
    userId: string;
    ownerName?: string;
    status: string;
  };
  menus?: Menu[];
}

export interface BusinessFilters {
  city?: string;
  cuisine?: string;
  search?: string;
  minCapacity?: number;
  maxCapacity?: number;
  minRating?: number;
  status?: BusinessStatus;
  page?: number;
  limit?: number;
}

export interface BusinessesResponse {
  businesses: Business[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
