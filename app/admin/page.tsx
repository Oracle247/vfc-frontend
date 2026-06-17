"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Calendar, Loader2 } from "lucide-react";
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
import { userService } from "@/services/userService";
import { useCurrentUser } from "@/hooks/use-current-user";
import ExcoHome from "./_components/ExcoHome";

interface CardData {
  loading: boolean;
  value: string;
  hint?: string;
}

const empty = (hint?: string): CardData => ({ loading: false, value: "—", hint });

export default function AdminDashboardRoute() {
  // Role gate — excos see the read-only dashboard, admins fall through.
  const { isExco, status, user } = useCurrentUser();
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }
  if (isExco) return <ExcoHome firstName={user?.firstName} />;
  return <AdminDashboard />;
}

function AdminDashboard() {
  const [members, setMembers] = useState<CardData>({ loading: true, value: "…" });
  const [attendees, setAttendees] = useState<CardData>({ loading: true, value: "…" });
  const [sessionsThisMonth, setSessionsThisMonth] = useState<CardData>({
    loading: true,
    value: "…",
  });
  const [chart, setChart] = useState<Array<{ label: string; count: number }>>([]);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    // Card 1 — total members
    userService
      .getFilteredUsers({ churchStatus: "MEMBER", page: 1, limit: 1 })
      .then((res) =>
        setMembers({
          loading: false,
          value: res.total.toLocaleString(),
          hint: "churchStatus = MEMBER",
        }),
      )
      .catch(() => setMembers(empty()));

    // Card 2 — unique attendees + avg per session
    attendanceService
      .getAttendanceSummary()
      .then((s) =>
        setAttendees({
          loading: false,
          value: s.uniqueAttendees.toLocaleString(),
          hint: `avg ${s.avgAttendancePerSession} per session`,
        }),
      )
      .catch(() => setAttendees(empty()));

    // Card 3 — sessions this month + chart data (one endpoint, two consumers)
    attendanceService
      .getAttendanceTrend({ groupBy: "month" })
      .then((rows) => {
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        const thisMonth = rows.find((r) => {
          const d = new Date(r.period);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          return key === monthKey;
        });
        setSessionsThisMonth({
          loading: false,
          value: String(thisMonth?.count ?? 0),
        });
      })
      .catch(() => setSessionsThisMonth(empty()));

    // Chart — most recent ~12 sessions
    attendanceService
      .getAttendanceTrend({ groupBy: "session" })
      .then((rows) => {
        const last = rows.slice(-12).map((r) => ({
          label: r.label,
          count: r.count,
        }));
        setChart(last);
      })
      .catch(() => setChart([]))
      .finally(() => setChartLoading(false));
  }, []);

  const renderCard = (
    title: string,
    icon: React.ReactNode,
    data: CardData,
    delay: string,
  ) => (
    <Card className={`animate-fade-up ${delay}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">
              {data.loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              ) : (
                data.value
              )}
            </div>
            {data.hint && (
              <p className="text-xs text-gray-500">{data.hint}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {renderCard(
          "Total Members",
          <Users className="h-4 w-4 text-gray-500" />,
          members,
          "",
        )}
        {renderCard(
          "Unique Attendees",
          <Activity className="h-4 w-4 text-gray-500" />,
          attendees,
          "animation-delay-200",
        )}
        {renderCard(
          "Sessions This Month",
          <Calendar className="h-4 w-4 text-gray-500" />,
          sessionsThisMonth,
          "animation-delay-300",
        )}
      </div>

      <Card className="animate-fade-up animation-delay-400">
        <CardHeader>
          <CardTitle>Attendance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {chartLoading ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : chart.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No session data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
