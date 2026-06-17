import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api";
import { handleApiCall } from "@/lib/utils";
import {
    CreateSpecialProgramPayload,
    ISpecialProgram,
    UpdateSpecialProgramPayload,
} from "@/types/template";

export const specialProgramService = {
    list: () =>
        handleApiCall<ISpecialProgram[]>(
            () => apiClient.get<ApiResponse<ISpecialProgram[]>>("/special-programs"),
        ),

    getById: (id: string) =>
        handleApiCall<ISpecialProgram>(
            () => apiClient.get<ApiResponse<ISpecialProgram>>(`/special-programs/${id}`),
        ),

    create: (payload: CreateSpecialProgramPayload) =>
        handleApiCall<ISpecialProgram>(
            () => apiClient.post<ApiResponse<ISpecialProgram>>("/special-programs", payload),
            "Special program created!",
        ),

    update: (id: string, payload: UpdateSpecialProgramPayload) =>
        handleApiCall<ISpecialProgram>(
            () => apiClient.put<ApiResponse<ISpecialProgram>>(`/special-programs/${id}`, payload),
            "Special program updated!",
        ),

    remove: (id: string) =>
        handleApiCall<{ success: boolean }>(
            () => apiClient.delete<ApiResponse<{ success: boolean }>>(`/special-programs/${id}`),
            "Special program deleted!",
        ),
};
