"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { attendanceService } from "@/services/attendanceService";
import { AttendanceTrendPoint } from "@/types/attendance";
import { format } from "date-fns";

export default function AttendanceTrendChart() {
  const [data, setData] = useState<AttendanceTrendPoint[]>([]);
  const [groupBy, setGroupBy] = useState<string>("session");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    attendanceService
      .getAttendanceTrend({ groupBy })
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [groupBy]);

  const chartData = data.map((d) => ({
    ...d,
    name:
      groupBy === "session"
        ? d.label
        : format(new Date(d.period), groupBy === "week" ? "MMM dd" : "MMM yyyy"),
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Attendance Trend</CardTitle>
        <Select value={groupBy} onValueChange={setGroupBy}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="session">Per Session</SelectItem>
            <SelectItem value="week">Weekly</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : chartData.length === 0 ? (
          <p className="text-sm text-gray-500">No attendance data yet.</p>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
