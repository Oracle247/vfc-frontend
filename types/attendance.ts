import { IUser } from "./user";

export interface IAttendanceSession {
    id: string;
    serviceName: string;
    date?: Date;
    startedAt?: Date;
    endedAt?: Date;
    attendees?: IAttendance[];
    createdAt: Date;
}

export interface IAttendance {
    id: string;
    sessionId: string;
    userId: string;
    session?: IAttendanceSession;
    user?: IUser;
    markedAt: Date;
}

export interface CreateAttendanceSessionPayload {
    serviceName: string;
    date?: Date;
    startedAt: Date;
}

export interface UpdateAttendanceSessionPayload {
    serviceName?: string;
    endedAt?: Date;
}

export interface MarkAttendancePayload {
    userId: string;
    sessionId: string;
}

export interface BulkMarkAttendancePayload {
    sessionId: string;
    userIds: string[];
}

export interface BulkMarkAttendanceResult {
    marked: number;
    alreadyPresent: number;
}
