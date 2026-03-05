import { IAttendance } from "./attendance";

export type Gender = "MALE" | "FEMALE";
export type ChurchStatus = "FIRST_TIMER" | "VISITOR" | "MEMBER";
export type MembershipType = "NON_WORKER" | "WORKER";
export type WorkerType = "REGULAR" | "EXECUTIVE";
export type UserRole = "MEMBER" | "WORKER" | "ADMIN";

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
    nationality?: string;
    stateOfOrigin?: string;
    emergencyContact?: string;

    // Attendance relation
    attendances?: IAttendance[];

    createdAt?: Date;
    updatedAt?: Date;
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
    search?: string;
}

export interface BulkImportResult {
    created: number;
    skipped: string[];
    errors: string[];
}
