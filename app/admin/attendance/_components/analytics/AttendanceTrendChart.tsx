"use client";

import { useEffect, useMemo, useState } from "react";
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

const ALL = "__ALL__";
const NO_DAY = "__NONE__";

/**
 * Dedicated attendance-trend chart for the analytics page. Keeps the existing
 * Per Session / Weekly / Monthly bucketing, and adds a service-day picker so
 * Sunday Service vs Wednesday Service vs … aren't mixed onto the same line.
 *
 * The service-day filter is only meaningful for Per Session bucketing — the
 * weekly/monthly aggregations bucket by date irrespective of which service
 * the attendance came from. We hide the picker in those modes.
 */
export default function AttendanceTrendChart() {
  const [data, setData] = useState<AttendanceTrendPoint[]>([]);
  const [groupBy, setGroupBy] = useState<string>("session");
  const [serviceDayId, setServiceDayId] = useState<string>(ALL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    attendanceService
      .getAttendanceTrend({ groupBy })
      .then((rows) => setData(rows ?? []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [groupBy]);

  const serviceDays = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of data) {
      if (p.serviceDayId && p.serviceDayName && !map.has(p.serviceDayId)) {
        map.set(p.serviceDayId, p.serviceDayName);
      }
    }
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [data]);

  const hasUnassigned = useMemo(
    () => groupBy === "session" && data.some((p) => !p.serviceDayId),
    [data, groupBy],
  );

  const chartData = useMemo(() => {
    const filtered =
      groupBy !== "session" || serviceDayId === ALL
        ? data
        : serviceDayId === NO_DAY
          ? data.filter((p) => !p.serviceDayId)
          : data.filter((p) => p.serviceDayId === serviceDayId);

    return filtered.map((d) => ({
      ...d,
      name:
        groupBy === "session"
          ? format(new Date(d.period), "MMM dd")
          : format(new Date(d.period), groupBy === "week" ? "MMM dd" : "MMM yyyy"),
    }));
  }, [data, groupBy, serviceDayId]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
        <CardTitle>Attendance Trend</CardTitle>
        <div className="flex gap-2">
          {groupBy === "session" && (
            <Select value={serviceDayId} onValueChange={setServiceDayId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All sessions</SelectItem>
                {serviceDays.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
                {hasUnassigned && (
                  <SelectItem value={NO_DAY}>Unassigned (legacy)</SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
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
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : chartData.length === 0 ? (
          <p className="text-sm text-gray-500">
            {data.length === 0 ? "No attendance data yet." : "No sessions for this service."}
          </p>
        ) : (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis allowDecimals={false} />
                <Tooltip
                  labelFormatter={(name, payload) => {
                    const label = (payload?.[0]?.payload as { label?: string } | undefined)?.label;
                    return label ? `${name} — ${label}` : name;
                  }}
                />
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
