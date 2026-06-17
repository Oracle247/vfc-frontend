import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api";
import { handleApiCall } from "@/lib/utils";
import {
    CreateServiceDayPayload,
    IServiceDay,
    UpdateServiceDayPayload,
} from "@/types/template";

export const serviceDayService = {
    list: () =>
        handleApiCall<IServiceDay[]>(
            () => apiClient.get<ApiResponse<IServiceDay[]>>("/service-days"),
        ),

    getById: (id: string) =>
        handleApiCall<IServiceDay>(
            () => apiClient.get<ApiResponse<IServiceDay>>(`/service-days/${id}`),
        ),

    create: (payload: CreateServiceDayPayload) =>
        handleApiCall<IServiceDay>(
            () => apiClient.post<ApiResponse<IServiceDay>>("/service-days", payload),
            "Service day created!",
        ),

    update: (id: string, payload: UpdateServiceDayPayload) =>
        handleApiCall<IServiceDay>(
            () => apiClient.put<ApiResponse<IServiceDay>>(`/service-days/${id}`, payload),
            "Service day updated!",
        ),

    remove: (id: string) =>
        handleApiCall<{ success: boolean }>(
            () => apiClient.delete<ApiResponse<{ success: boolean }>>(`/service-days/${id}`),
            "Service day deleted!",
        ),

    listDeptLateTimes: (serviceDayId: string) =>
        handleApiCall<IDepartmentLateTime[]>(
            () => apiClient.get<ApiResponse<IDepartmentLateTime[]>>(
                `/service-days/${serviceDayId}/department-late-times`,
            ),
        ),

    upsertDeptLateTime: (
        serviceDayId: string,
        departmentId: string,
        lateTime: string,
    ) =>
        handleApiCall<IDepartmentLateTime>(
            () => apiClient.put<ApiResponse<IDepartmentLateTime>>(
                `/service-days/${serviceDayId}/department-late-times/${departmentId}`,
                { lateTime },
            ),
            "Late time saved",
        ),

    removeDeptLateTime: (serviceDayId: string, departmentId: string) =>
        handleApiCall<{ success: boolean }>(
            () => apiClient.delete<ApiResponse<{ success: boolean }>>(
                `/service-days/${serviceDayId}/department-late-times/${departmentId}`,
            ),
            "Late time cleared",
        ),
};

export interface IDepartmentLateTime {
    id: string;
    serviceDayId: string;
    departmentId: string;
    lateTime: string; // "HH:mm"
    updatedById: string | null;
    createdAt: string;
    updatedAt: string;
    department: { id: string; name: string };
}
