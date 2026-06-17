import { IUser } from "./user";

export interface IDepartment {
    id: string;
    name: string;
    description?: string;
    headId?: string;
    head?: Pick<IUser, "id" | "firstName" | "lastName" | "email">;
    members?: Pick<IUser, "id" | "firstName" | "lastName" | "email">[];
    assistantHeads?: Pick<IUser, "id" | "firstName" | "lastName" | "email">[];
}

export interface CreateDepartmentPayload {
    name: string;
    description?: string;
}

export interface UpdateDepartmentPayload {
    name?: string;
    description?: string;
}

export type { BulkImportResult } from "./user";
