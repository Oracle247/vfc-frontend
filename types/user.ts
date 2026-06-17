import { IAttendance } from "./attendance";

export type Gender = "MALE" | "FEMALE";
export type ChurchStatus = "FIRST_TIMER" | "VISITOR" | "MEMBER";
export type MembershipType = "NON_WORKER" | "WORKER";
export type WorkerType = "REGULAR" | "EXECUTIVE";
export type UserRole = "MEMBER" | "WORKER" | "ADMIN";
export type AccountStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "ARCHIVED";

/** Canonical permission keys — mirror of backend `PERM` in src/core/permissions.ts. */
export type PermissionKey =
    | "canManageMembers"
    | "canManageAttendance"
    | "canViewAnalytics"
    | "canManageTasks"
    | "canManageResources"
    | "canMakeAnnouncements"
    | "canApproveRequests"
    | "canManageDeptSettings";

export interface IDepartmentRef {
    id: string;
    name: string;
}

export interface IDepartmentPositionRef {
    departmentId: string;
    position: { id: string; name: string };
}

export interface IUser {
    _id?: string;
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: Gender;
    address: string;
    dateOfBirth?: Date;
    password?: string;

    // Campus-specific details
    matricNumber?: string;
    department?: string;
    level?: string;
    faculty?: string;

    // Other identifiers
    churchStatus: ChurchStatus;
    membershipType?: MembershipType;
    workerType?: WorkerType;
    role?: UserRole;
    accountStatus?: AccountStatus;
    nationality?: string;
    stateOfOrigin?: string;
    emergencyContact?: string;

    // Attendance relation
    attendances?: IAttendance[];

    // Department M2M (member of / heads / assists)
    departments?: IDepartmentRef[];
    headedDepartments?: IDepartmentRef[];
    assistantDepartments?: IDepartmentRef[];
    /** Position assignments per department. From /user/me only. */
    deptPositions?: IDepartmentPositionRef[];
    /**
     * Permissions resolved server-side per department. Populated on /user/me.
     * Empty object for users with no dept involvement.
     */
    permissionsByDepartment?: Record<string, PermissionKey[]>;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface UpdateUserPayload extends Partial<Omit<IUser, "departments" | "headedDepartments" | "assistantDepartments" | "attendances" | "id" | "_id">> {
    departmentIds?: string[];
    headDepartmentIds?: string[];
    assistantDepartmentIds?: string[];
}

export interface UpdateChurchJourneyPayload {
    churchStatus?: ChurchStatus;
    membershipType?: MembershipType;
    workerType?: WorkerType;
    role?: UserRole;
}

export interface UserFilterParams {
    page?: number;
    limit?: number;
    churchStatus?: ChurchStatus;
    membershipType?: MembershipType;
    role?: UserRole;
    accountStatus?: AccountStatus;
    departmentId?: string;
    search?: string;
}

export interface BulkImportResult {
    created: number;
    skipped: string[];
    errors: string[];
}
