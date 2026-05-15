"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { attendanceService } from "@/services/attendanceService";
import { AttendanceRatePoint } from "@/types/attendance";
import { format } from "date-fns";

export default function AttendanceRateChart() {
  const [data, setData] = useState<AttendanceRatePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceService
      .getAttendanceRate()
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const chartData = data.map((d) => ({
    name: format(new Date(d.date), "MMM dd"),
    rate: d.rate,
    attendees: d.attendeeCount,
    total: d.totalMembers,
    service: d.serviceName,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Rate (%)</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : chartData.length === 0 ? (
          <p className="text-sm text-gray-500">No attendance data yet.</p>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis domain={[0, 100]} unit="%" />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "rate") return [`${value}%`, "Rate"];
                    return [value, name];
                  }}
                  labelFormatter={(label) => {
                    const point = chartData.find((d) => d.name === label);
                    return point
                      ? `${point.service} — ${point.attendees}/${point.total} members`
                      : label;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
