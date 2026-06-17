import apiClient from "@/lib/apiClient";
import { ApiResponse, PaginatedData } from "@/types/api";
import { handleApiCall } from "@/lib/utils";
import {
    BulkMarkAttendancePayload,
    BulkMarkAttendanceResult,
    CreateAttendanceSessionPayload,
    IAttendance,
    IAttendanceSession,
    MarkAttendancePayload,
    UpdateAttendanceSessionPayload,
    AttendanceSummary,
    TopMember,
    MemberAttendancePoint,
    AttendanceTrendPoint,
    AttendanceRatePoint,
} from "@/types/attendance";
import { UpsertIncomePayload } from "@/types/income";

export const attendanceService = {
    startSession: (payload: CreateAttendanceSessionPayload) =>
        handleApiCall<IAttendanceSession>(
            () => apiClient.post<ApiResponse<IAttendanceSession>>("/attendance/session", payload),
            "Session started successfully!"
        ),

    markAttendance: (payload: MarkAttendancePayload) =>
        handleApiCall<{ success: boolean }>(
            () => apiClient.post<ApiResponse<{ success: boolean }>>("/attendance/mark", payload),
            "Attendance recorded successfully!"
        ),

    bulkMarkAttendance: (payload: BulkMarkAttendancePayload) =>
        handleApiCall<BulkMarkAttendanceResult>(
            () => apiClient.post<ApiResponse<BulkMarkAttendanceResult>>("/attendance/mark-bulk", payload),
            "Bulk attendance marked successfully!"
        ),

    getAllSessions: (params?: { page?: number; limit?: number }) =>
        handleApiCall<PaginatedData<IAttendanceSession>>(
            () => apiClient.get<ApiResponse<PaginatedData<IAttendanceSession>>>("/attendance/sessions", { params })
        ),

    getSessionById: (id: string) =>
        handleApiCall<IAttendanceSession>(
            () => apiClient.get<ApiResponse<IAttendanceSession>>(`/attendance/session/${id}`)
        ),

    updateSession: (id: string, payload: UpdateAttendanceSessionPayload) =>
        handleApiCall<IAttendanceSession>(
            () => apiClient.put<ApiResponse<IAttendanceSession>>(`/attendance/session/${id}`, payload),
            "Session updated successfully!"
        ),

    deleteSession: (id: string) =>
        handleApiCall<{ success: boolean }>(
            () => apiClient.delete<ApiResponse<{ success: boolean }>>(`/attendance/session/${id}`),
            "Session deleted successfully!"
        ),

    // Edit a single attendance entry (admin: change markedAt and/or serviceOrder)
    updateAttendance: (
        id: string,
        payload: { markedAt?: string; serviceOrder?: number },
    ) =>
        handleApiCall<IAttendance>(
            () => apiClient.put<ApiResponse<IAttendance>>(`/attendance/${id}`, payload),
            "Attendance updated successfully!"
        ),

    // Delete a single attendance entry
    deleteAttendance: (id: string) =>
        handleApiCall<{ success: boolean }>(
            () => apiClient.delete<ApiResponse<{ success: boolean }>>(`/attendance/${id}`),
            "Attendance deleted successfully!"
        ),

    // ----- Income + close/reopen ---------------------------------------------

    getSessionIncome: (id: string) =>
        handleApiCall<IAttendanceSession>(
            () => apiClient.get<ApiResponse<IAttendanceSession>>(`/attendance/session/${id}/income`),
        ),

    upsertSessionIncome: (id: string, payload: UpsertIncomePayload) =>
        handleApiCall<IAttendanceSession>(
            () => apiClient.put<ApiResponse<IAttendanceSession>>(`/attendance/session/${id}/income`, payload),
            "Income saved!"
        ),

    closeSession: (id: string) =>
        handleApiCall<IAttendanceSession>(
            () => apiClient.post<ApiResponse<IAttendanceSession>>(`/attendance/session/${id}/close`),
            "Session closed."
        ),

    reopenSession: (id: string) =>
        handleApiCall<IAttendanceSession>(
            () => apiClient.post<ApiResponse<IAttendanceSession>>(`/attendance/session/${id}/reopen`),
            "Session reopened."
        ),

    // Analytics
    getAttendanceSummary: () =>
        handleApiCall<AttendanceSummary>(
            () => apiClient.get<ApiResponse<AttendanceSummary>>("/attendance/analytics/summary")
        ),

    getTopMembers: (params?: { limit?: number }) =>
        handleApiCall<TopMember[]>(
            () => apiClient.get<ApiResponse<TopMember[]>>("/attendance/analytics/top-members", { params })
        ),

    getMemberAttendanceHistory: (userId: string) =>
        handleApiCall<MemberAttendancePoint[]>(
            () => apiClient.get<ApiResponse<MemberAttendancePoint[]>>(`/attendance/analytics/member-history/${userId}`)
        ),

    /** Personal attendance history for the authenticated user. */
    getMyAttendances: () =>
        handleApiCall<MemberAttendancePoint[]>(
            () => apiClient.get<ApiResponse<MemberAttendancePoint[]>>(`/attendance/me`)
        ),

    getAttendanceTrend: (params?: { groupBy?: string, departmentId?: string }) =>
        handleApiCall<AttendanceTrendPoint[]>(
            () => apiClient.get<ApiResponse<AttendanceTrendPoint[]>>("/attendance/analytics/trend", { params })
        ),

    getAttendanceRate: () =>
        handleApiCall<AttendanceRatePoint[]>(
            () => apiClient.get<ApiResponse<AttendanceRatePoint[]>>("/attendance/analytics/rate")
        ),
};
