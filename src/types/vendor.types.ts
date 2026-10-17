import { Business } from './business.types';

export interface PublicVendorUser {
  id: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface PublicVendor {
  id: string;
  userId: PublicVendorUser;
  ownerName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  business?: Business;
  createdAt: string;
  updatedAt: string;
}

export interface EstimationRequestInput {
  vendorId: string;
  guestCount: number;
  eventDate: string;
  preservedActionContext?: string;
}

export interface EstimationRequestResult {
  requestId: string;
  vendorId: string;
  guestCount: number;
  eventDate: string;
  contextPreserved?: string | null;
  status: string;
}
