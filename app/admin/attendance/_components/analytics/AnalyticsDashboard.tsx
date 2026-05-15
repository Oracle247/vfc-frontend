"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BarChart3, TrendingUp } from "lucide-react";
import { attendanceService } from "@/services/attendanceService";
import { AttendanceSummary } from "@/types/attendance";
import AttendanceTrendChart from "./AttendanceTrendChart";
import TopMembersChart from "./TopMembersChart";
import MemberAttendanceCurve from "./MemberAttendanceCurve";
import AttendanceRateChart from "./AttendanceRateChart";

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);

  useEffect(() => {
    attendanceService
      .getAttendanceSummary()
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalSessions ?? "—"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Attendees</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.uniqueAttendees ?? "—"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance / Session</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.avgAttendancePerSession ?? "—"}</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Trend - Full Width */}
      <AttendanceTrendChart />

      {/* Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        <TopMembersChart />
        <AttendanceRateChart />
      </div>

      {/* Individual Member Curve - Full Width */}
      <MemberAttendanceCurve />
    </div>
  );
}
