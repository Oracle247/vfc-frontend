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

// Analytics types
export interface AttendanceSummary {
    totalSessions: number;
    uniqueAttendees: number;
    avgAttendancePerSession: number;
}

export interface TopMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    churchStatus: string;
    attendanceCount: number;
}

export interface MemberAttendancePoint {
    id: string;
    sessionId: string;
    userId: string;
    markedAt: string;
    session: {
        id: string;
        serviceName: string;
        startedAt: string;
    };
}

export interface AttendanceTrendPoint {
    period: string;
    label: string;
    count: number;
}

export interface AttendanceRatePoint {
    sessionId: string;
    serviceName: string;
    date: string;
    attendeeCount: number;
    totalMembers: number;
    rate: number;
}
