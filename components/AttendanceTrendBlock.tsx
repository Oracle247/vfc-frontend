"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Loader2 } from "lucide-react";
import { attendanceService } from "@/services/attendanceService";
import { AttendanceTrendPoint } from "@/types/attendance";
import { format } from "date-fns";

interface Props {
  /** Cap visible sessions to the most recent N. Default 12. Pass 0 for no cap. */
  last?: number;
  height?: number;
  departmentId?: string;
}

const ALL = "__ALL__";
const NO_DAY = "__NONE__";


export default function AttendanceTrendBlock({ last = 12, height = 300, departmentId = "" }: Props) {
  const [data, setData] = useState<AttendanceTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [pick, setPick] = useState<string>(ALL);

  useEffect(() => {
    setLoading(true);
    attendanceService
      .getAttendanceTrend({ groupBy: "session", departmentId })
      .then((rows) => setData(rows ?? []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [departmentId]);

  const serviceDays = useMemo(() => {
    const map = new Map<string, string>();
    const sorted = [...data].sort((a, b) => +new Date(a.period) - +new Date(b.period));
    for (const p of sorted) {
      if (p.serviceDayId && p.serviceDayName) {
        if (!map.has(p.serviceDayId)) map.set(p.serviceDayId, p.serviceDayName);
      }
    }
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [data]);

  const hasUnassigned = useMemo(
    () => data.some((p) => !p.serviceDayId),
    [data],
  );

  const filtered = useMemo(() => {
    const sorted = [...data].sort((a, b) => +new Date(a.period) - +new Date(b.period));
    const matched = sorted.filter((p) => {
      if (pick === ALL) return true;
      if (pick === NO_DAY) return !p.serviceDayId;
      return p.serviceDayId === pick;
    });
    const capped = last > 0 ? matched.slice(-last) : matched;
    return capped.map((p) => ({
      name: format(new Date(p.period), "MMM dd"),
      label: p.label,
      count: p.count,
    }));
  }, [data, pick, last]);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Select value={pick} onValueChange={setPick}>
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
      </div>

      <div style={{ height }}>
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            {data.length === 0
              ? "No session data yet"
              : "No sessions for this service"}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filtered}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis allowDecimals={false} />
              <Tooltip
                labelFormatter={(name, payload) => {
                  const session = payload?.[0]?.payload?.label;
                  return session ? `${name} — ${session}` : name;
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
