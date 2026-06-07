export interface IChurchSettings {
    id: string;
    name: string;
    logoUrl?: string | null;
    address?: string | null;
    updatedAt: string;
}

export interface UpdateChurchSettingsPayload {
    name?: string;
    logoUrl?: string | null;
    address?: string | null;
}
