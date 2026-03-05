import apiClient from "@/lib/apiClient";
import { IUser, UpdateChurchJourneyPayload, UserFilterParams, BulkImportResult } from "@/types/user";
import { ApiResponse, PaginatedData } from "@/types/api";
import { handleApiCall } from "@/lib/utils";

export const userService = {
    getUsers: () =>
        handleApiCall<IUser[]>(
            () => apiClient.get<ApiResponse<IUser[]>>("/user")
        ),

    getFilteredUsers: (params?: UserFilterParams) =>
        handleApiCall<PaginatedData<IUser>>(
            () => apiClient.get<ApiResponse<PaginatedData<IUser>>>("/user/list", { params })
        ),

    getUserById: (id: string) =>
        handleApiCall<IUser>(
            () => apiClient.get<ApiResponse<IUser>>(`/user/${id}`)
        ),

    searchUsers: (name: string) =>
        handleApiCall<IUser[]>(
            () => apiClient.get<ApiResponse<IUser[]>>(`/user/search`, { params: { name } })
        ),

    updateUser: (id: string, data: Partial<IUser>) =>
        handleApiCall<IUser>(
            () => apiClient.put<ApiResponse<IUser>>(`/user/${id}`, data),
            "User updated successfully!"
        ),

    updateChurchJourney: (id: string, data: UpdateChurchJourneyPayload) =>
        handleApiCall<IUser>(
            () => apiClient.patch<ApiResponse<IUser>>(`/user/${id}/church-journey`, data),
            "Church journey updated successfully!"
        ),

    setPassword: (id: string, password: string) =>
        handleApiCall<IUser>(
            () => apiClient.patch<ApiResponse<IUser>>(`/user/${id}/set-password`, { password }),
            "Password set successfully!"
        ),

    deleteUser: (id: string) =>
        handleApiCall<IUser>(
            () => apiClient.delete<ApiResponse<IUser>>(`/user/${id}`),
            "User deleted successfully!"
        ),

    bulkImport: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return handleApiCall<BulkImportResult>(
            () => apiClient.post<ApiResponse<BulkImportResult>>("/user/bulk-import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            }),
            "Members imported successfully!"
        );
    },
};
