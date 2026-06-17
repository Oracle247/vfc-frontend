import apiClient from "@/lib/apiClient";
import { ApiResponse, PaginatedData } from "@/types/api";
import { handleApiCall } from "@/lib/utils";
import {
    CreateDepartmentPayload,
    IDepartment,
    UpdateDepartmentPayload,
    BulkImportResult,
} from "@/types/department";

export const departmentService = {
    createDepartment: (payload: CreateDepartmentPayload) =>
        handleApiCall<IDepartment>(
            () => apiClient.post<ApiResponse<IDepartment>>("/departments", payload),
            "Department created successfully!"
        ),

    getAllDepartments: (params?: { page?: number; limit?: number }) =>
        handleApiCall<PaginatedData<IDepartment>>(
            () => apiClient.get<ApiResponse<PaginatedData<IDepartment>>>("/departments", { params })
        ),

    getDepartmentById: (id: string) =>
        handleApiCall<IDepartment>(
            () => apiClient.get<ApiResponse<IDepartment>>(`/departments/${id}`)
        ),

    updateDepartment: (id: string, payload: UpdateDepartmentPayload) =>
        handleApiCall<IDepartment>(
            () => apiClient.put<ApiResponse<IDepartment>>(`/departments/${id}`, payload),
            "Department updated successfully!"
        ),

    deleteDepartment: (id: string) =>
        handleApiCall<IDepartment>(
            () => apiClient.delete<ApiResponse<IDepartment>>(`/departments/${id}`),
            "Department deleted successfully!"
        ),

    assignHead: (id: string, userId: string) =>
        handleApiCall<IDepartment>(
            () => apiClient.patch<ApiResponse<IDepartment>>(`/departments/${id}/head`, { userId }),
            "Head assigned successfully!"
        ),
    
    assignAssistantHead: (id: string, userIds: string[]) =>
        handleApiCall<IDepartment>(
            () => apiClient.post<ApiResponse<IDepartment>>(`/departments/${id}/assistants`, { userIds }),
            "Assistant head assigned successfully!"
        ),

    removeHead: (id: string) =>
        handleApiCall<IDepartment>(
            () => apiClient.delete<ApiResponse<IDepartment>>(`/departments/${id}/head`),
            "Head removed successfully!"
        ),

    removeAssistantHead: (id: string, userIds: string[]) =>
        handleApiCall<IDepartment>(
            () => apiClient.delete<ApiResponse<IDepartment>>(`/departments/${id}/assistants`, {
                data: { userIds },
            }),
            "Assistant head removed successfully!"
        ),

    addMembers: (id: string, userIds: string[]) =>
        handleApiCall<IDepartment>(
            () => apiClient.post<ApiResponse<IDepartment>>(`/departments/${id}/members`, { userIds }),
            "Members added successfully!"
        ),

    removeMembers: (id: string, userIds: string[]) =>
        handleApiCall<IDepartment>(
            () => apiClient.delete<ApiResponse<IDepartment>>(`/departments/${id}/members`, {
                data: { userIds },
            }),
            "Members removed successfully!"
        ),

    // ── Assistant heads ────────────────────────────────────────────────
    addAssistants: (id: string, userIds: string[]) =>
        handleApiCall<IDepartment>(
            () => apiClient.post<ApiResponse<IDepartment>>(`/departments/${id}/assistants`, { userIds }),
            "Assistants added",
        ),

    removeAssistants: (id: string, userIds: string[]) =>
        handleApiCall<IDepartment>(
            () => apiClient.delete<ApiResponse<IDepartment>>(`/departments/${id}/assistants`, {
                data: { userIds },
            }),
            "Assistants removed",
        ),

    // ── Per-(user × department) Position assignments ───────────────────
    listPositions: (id: string) =>
        handleApiCall<IDepartmentPositionRow[]>(
            () => apiClient.get<ApiResponse<IDepartmentPositionRow[]>>(`/departments/${id}/positions`),
        ),

    assignPosition: (id: string, userId: string, positionId: string) =>
        handleApiCall<IDepartmentPositionRow>(
            () => apiClient.post<ApiResponse<IDepartmentPositionRow>>(
                `/departments/${id}/positions`,
                { userId, positionId },
            ),
            "Position assigned",
        ),

    removePosition: (id: string, userId: string, positionId: string) =>
        handleApiCall<{ success: boolean }>(
            () => apiClient.delete<ApiResponse<{ success: boolean }>>(
                `/departments/${id}/positions/${positionId}/users/${userId}`,
            ),
            "Position removed",
        ),

    bulkImport: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return handleApiCall<BulkImportResult>(
            () => apiClient.post<ApiResponse<BulkImportResult>>("/departments/bulk-import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            }),
            "Departments imported successfully!"
        );
    },
};

export interface IDepartmentPositionRow {
    id: string;
    userId: string;
    departmentId: string;
    positionId: string;
    assignedAt: string;
    user: { id: string; firstName: string; lastName: string; email: string };
    position: { id: string; name: string; description?: string | null };
}
