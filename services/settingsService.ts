import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api";
import { handleApiCall } from "@/lib/utils";
import { IChurchSettings, UpdateChurchSettingsPayload } from "@/types/settings";

export const settingsService = {
    getChurchSettings: () =>
        handleApiCall<IChurchSettings>(
            () => apiClient.get<ApiResponse<IChurchSettings>>("/settings/church")
        ),

    updateChurchSettings: (payload: UpdateChurchSettingsPayload) =>
        handleApiCall<IChurchSettings>(
            () => apiClient.put<ApiResponse<IChurchSettings>>("/settings/church", payload),
            "Church settings updated successfully!"
        ),
};
