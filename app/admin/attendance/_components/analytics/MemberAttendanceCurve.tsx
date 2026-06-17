"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Pull a wider pool so the search has something useful to filter against.
    // (Top-members analytics caps at 50 by default — bump for the picker.)
    attendanceService
      .getTopMembers({ limit: 500 })
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

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
      (m.email ?? "").toLowerCase().includes(q),
    );
  }, [members, search]);

  const chartData = history.map((h, index) => ({
    name: format(new Date(h.session.startedAt), "MMM dd"),
    session: h.session.serviceName,
    attendance: index + 1,
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
        <CardTitle>Individual Attendance</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search member…"
              className="w-[200px] pl-9 h-9"
            />
          </div>
          <Select value={selectedUserId} onValueChange={fetchHistory}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select a member" />
            </SelectTrigger>
            <SelectContent>
              {filteredMembers.length === 0 ? (
                <div className="px-2 py-2 text-sm text-gray-500">
                  {search ? "No matches" : "No members yet"}
                </div>
              ) : (
                filteredMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.firstName} {m.lastName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
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
