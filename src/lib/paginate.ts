export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  cityId?: number;
  isActive?: boolean;
  sortOrder?: 'asc' | 'desc';
}
