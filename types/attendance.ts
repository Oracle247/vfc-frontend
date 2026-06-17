import { IUser } from "./user";
import { ISessionIncome } from "./income";

export interface ISessionService {
    id: string;
    sessionId: string;
    order: number;
    serviceTime: string;
    preServiceTime?: string | null;
    closesAt?: string | null;
    incomes?: ISessionIncome[];
}

export interface SessionServiceInput {
    order: number;
    serviceTime: string;
    preServiceTime?: string | null;
    closesAt?: string | null;
}

export interface IAttendanceSession {
    id: string;
    serviceName: string;
    date?: Date;
    startedAt?: Date;
    endedAt?: Date;
    services?: ISessionService[];
    serviceDayId?: string | null;
    serviceDay?: {
        id: string;
        name: string;
        weekday: string;
    } | null;
    specialProgramId?: string | null;
    specialProgram?: {
        id: string;
        name: string;
        date?: string | null;
    } | null;
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
    serviceOrder: number;
}

export interface CreateAttendanceSessionPayload {
    serviceName: string;
    date?: string;
    startedAt: string;
    serviceDayId?: string | null;
    specialProgramId?: string | null;
    services: SessionServiceInput[];
}

export interface UpdateAttendanceSessionPayload {
    serviceName?: string;
    date?: string;
    startedAt?: string;
    serviceDayId?: string | null;
    specialProgramId?: string | null;
    services?: SessionServiceInput[];
}

export interface MarkAttendancePayload {
    userId: string;
    sessionId: string;
    markedAt?: string;
    serviceOrder?: number;
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

export type Weekday =
    | "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY"
    | "THURSDAY" | "FRIDAY" | "SATURDAY";

export interface AttendanceTrendPoint {
    period: string;
    label: string;
    count: number;
    /** Populated only for groupBy=session. Lets the chart split into one line per service day. */
    serviceDayId?: string | null;
    serviceDayName?: string | null;
    weekday?: Weekday | null;
}

export interface AttendanceRatePoint {
    sessionId: string;
    serviceName: string;
    date: string;
    attendeeCount: number;
    totalMembers: number;
    rate: number;
}
