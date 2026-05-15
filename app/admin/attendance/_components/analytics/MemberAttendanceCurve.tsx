"use client";

import { useEffect, useState, useCallback } from "react";
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
import { TopMember, MemberAttendancePoint } from "@/types/attendance";
import { format } from "date-fns";

export default function MemberAttendanceCurve() {
  const [members, setMembers] = useState<TopMember[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [history, setHistory] = useState<MemberAttendancePoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    attendanceService
      .getTopMembers({ limit: 50 })
      .then(setMembers)
      .catch(() => setMembers([]));
  }, []);

  const fetchHistory = useCallback((userId: string) => {
    setSelectedUserId(userId);
    setLoading(true);
    attendanceService
      .getMemberAttendanceHistory(userId)
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  const chartData = history.map((h, index) => ({
    name: format(new Date(h.session.startedAt), "MMM dd"),
    session: h.session.serviceName,
    attendance: index + 1,
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Individual Attendance</CardTitle>
        <Select value={selectedUserId} onValueChange={fetchHistory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a member" />
          </SelectTrigger>
          <SelectContent>
            {members.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.firstName} {m.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {!selectedUserId ? (
          <p className="text-sm text-gray-500">Select a member to view their attendance history.</p>
        ) : loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : chartData.length === 0 ? (
          <p className="text-sm text-gray-500">No attendance records for this member.</p>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis label={{ value: "Cumulative", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  formatter={(value: number) => [value, "Total Sessions"]}
                  labelFormatter={(label) => {
                    const point = chartData.find((d) => d.name === label);
                    return point ? `${label} — ${point.session}` : label;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
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
