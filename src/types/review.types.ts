export interface Review {
  id: string;
  businessId: string;
  userId: {
    id: string;
    firstName: string;
    lastName: string;
  } | string;
  rating: number;
  comment?: string;
  status: 'PUBLISHED' | 'FLAGGED' | 'HIDDEN';
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateReviewInput {
  businessId: string;
  rating: number;
  comment?: string;
}
