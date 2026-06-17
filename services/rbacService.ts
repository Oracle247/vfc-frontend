import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api";
import { handleApiCall } from "@/lib/utils";
import { PermissionKey } from "@/types/user";

export interface IPosition {
    id: string;
    name: string;
    description?: string | null;
    permissions: PermissionKey[];
}

export interface IPermission {
    id: string;
    key: PermissionKey;
    label: string;
    description?: string | null;
}

export const rbacService = {
    listPositions: () =>
        handleApiCall<IPosition[]>(
            () => apiClient.get<ApiResponse<IPosition[]>>("/positions"),
        ),

    listPermissions: () =>
        handleApiCall<IPermission[]>(
            () => apiClient.get<ApiResponse<IPermission[]>>("/permissions"),
        ),
};
