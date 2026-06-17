"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { IDepartment } from "@/types/department";
import AttendanceTrendBlock from "@/components/AttendanceTrendBlock";

export default function AnalyticsTab({ dept: _dept }: { dept: IDepartment }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4 text-gray-500" /> Attendance Trend
        </CardTitle>
        <p className="text-xs text-gray-500">
          Church-wide trend. Pick a service to focus on its weekday pattern.
          Per-department slicing arrives in a follow-up wave.
        </p>
      </CardHeader>
      <CardContent>
        <AttendanceTrendBlock height={320} departmentId={_dept.id} />
      </CardContent>
    </Card>
  );
}
