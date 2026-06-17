"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  UserCheck,
  Calendar,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { attendanceService } from "@/services/attendanceService";
import { MemberAttendancePoint } from "@/types/attendance";

interface CardData {
  loading: boolean;
  value: string;
  hint?: string;
}

const empty = (hint?: string): CardData => ({ loading: false, value: "—", hint });

export default function WorkerDashboardHome() {
  const { user, status } = useCurrentUser();
  const [attendances, setAttendances] = useState<MemberAttendancePoint[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);

  useEffect(() => {
    attendanceService
      .getMyAttendances()
      .then((rows) => setAttendances(rows ?? []))
      .catch(() => setAttendances([]))
      .finally(() => setAttendanceLoading(false));
  }, []);

  const deptCard: CardData = useMemo(() => {
    if (status !== "ready") return { loading: true, value: "…" };
    const all = new Set<string>([
      ...(user?.departments ?? []).map((d) => d.id),
      ...(user?.headedDepartments ?? []).map((d) => d.id),
      ...(user?.assistantDepartments ?? []).map((d) => d.id),
    ]);
    return all.size === 0
      ? empty("Ask an admin to add you to one")
      : { loading: false, value: String(all.size), hint: all.size === 1 ? "department" : "departments" };
  }, [status, user]);

  const attendanceCard: CardData = useMemo(() => {
    if (attendanceLoading) return { loading: true, value: "…" };
    const total = attendances.length;
    if (total === 0) return empty("No services attended yet");
    return { loading: false, value: String(total), hint: "services attended" };
  }, [attendanceLoading, attendances.length]);

  const recentCard: CardData = useMemo(() => {
    if (attendanceLoading) return { loading: true, value: "…" };
    if (attendances.length === 0) return empty();
    const last = attendances[attendances.length - 1];
    const when = new Date(last.session?.startedAt ?? last.markedAt);
    return {
      loading: false,
      value: when.toLocaleDateString(),
      hint: last.session?.serviceName ?? "service",
    };
  }, [attendanceLoading, attendances]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="text-gray-500">
          Here's your personal snapshot. Drill into a department for executive tools you have access to.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="My Departments" icon={<Building2 className="h-4 w-4 text-gray-500" />} data={deptCard} />
        <StatCard title="Services Attended" icon={<UserCheck className="h-4 w-4 text-gray-500" />} data={attendanceCard} />
        <StatCard title="Last Service" icon={<Calendar className="h-4 w-4 text-gray-500" />} data={recentCard} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/dashboard/departments">
            <Button variant="outline" className="gap-2">
              <Building2 className="h-4 w-4" /> My Departments <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/attendance">
            <Button variant="outline" className="gap-2">
              <UserCheck className="h-4 w-4" /> My Attendance <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button variant="outline" className="gap-2">
              Profile <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Coming soon</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-500 space-y-1">
          <p>Announcements, tasks, notifications, and calendar are scheduled for the next waves.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  icon,
  data,
}: {
  title: string;
  icon: React.ReactNode;
  data: CardData;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {data.loading ? <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> : data.value}
        </div>
        {data.hint && <p className="text-xs text-gray-500">{data.hint}</p>}
      </CardContent>
    </Card>
  );
}
