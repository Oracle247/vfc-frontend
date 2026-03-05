export interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
}

export interface PaginatedData<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
