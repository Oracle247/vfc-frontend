"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { departmentService } from "@/services/departmentService";
import { IDepartment } from "@/types/department";
import { useDeptPermissions } from "@/hooks/use-dept-permissions";
import { useCurrentUser } from "@/hooks/use-current-user";

import OverviewTab from "./_components/OverviewTab";
import MembersTab from "./_components/MembersTab";
import AttendanceTab from "./_components/AttendanceTab";
import AnalyticsTab from "./_components/AnalyticsTab";
import SettingsTab from "./_components/SettingsTab";

type TabKey = "overview" | "members" | "attendance" | "analytics" | "settings";

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "overview",   label: "Overview" },
  { key: "members",    label: "Members" },
  { key: "attendance", label: "Attendance" },
  { key: "analytics",  label: "Analytics" },
  { key: "settings",   label: "Settings" },
];

export default function DepartmentDashboardPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const deptId = sp.get("id");
  const activeTab = (sp.get("tab") as TabKey | null) ?? "overview";

  const { status: meStatus, isAdmin } = useCurrentUser();
  const perms = useDeptPermissions(deptId);
  const [dept, setDept] = useState<IDepartment | null>(null);
  const [deptLoading, setDeptLoading] = useState(true);

  useEffect(() => {
    if (!deptId) return;
    setDeptLoading(true);
    departmentService
      .getDepartmentById(deptId)
      .then((d) => setDept(d ?? null))
      .catch(() => setDept(null))
      .finally(() => setDeptLoading(false));
  }, [deptId]);

  // Which tabs to render. Overview + Members + Attendance are always visible
  // to dept members; Analytics + Settings gate behind specific perms.
  const visibleTabs = useMemo(() => {
    const allowed = new Set<TabKey>(["overview", "members", "attendance"]);
    if (isAdmin || perms.has("canViewAnalytics")) allowed.add("analytics");
    if (isAdmin || perms.has("canManageDeptSettings")) allowed.add("settings");
    return TABS.filter((t) => allowed.has(t.key));
  }, [isAdmin, perms]);

  // If the user lands on a tab they can't see (URL share, perm change), bump
  // them back to overview.
  useEffect(() => {
    if (perms.loading || meStatus === "loading") return;
    if (!visibleTabs.some((t) => t.key === activeTab)) {
      setTab("overview");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, perms.loading, meStatus, visibleTabs.length]);

  const setTab = (next: TabKey) => {
    if (!deptId) return;
    router.replace(`/dashboard/departments/view?id=${deptId}&tab=${next}`);
  };

  if (!deptId) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Department</h1>
        <Card>
          <CardContent className="py-8 text-sm text-gray-500 text-center">
            Missing department id. Go back to{" "}
            <Link href="/dashboard/departments" className="text-primary underline">
              My Departments
            </Link>.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (deptLoading || meStatus === "loading" || perms.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!dept) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Department not found</h1>
        <Link href="/dashboard/departments">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to My Departments
          </Button>
        </Link>
      </div>
    );
  }

  // Members who aren't part of the dept and aren't admin get a soft block —
  // backend enforces real auth on every write, this is just the UX.
  if (!perms.isMember && !isAdmin) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{dept.name}</h1>
        <Card>
          <CardContent className="py-8 text-sm text-gray-500 text-center">
            You are not a member of this department.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/dashboard/departments" className="text-sm text-gray-500 hover:underline">
            ← My Departments
          </Link>
          <h1 className="text-3xl font-bold mt-1">{dept.name}</h1>
          {dept.description && (
            <p className="text-gray-500 mt-1 max-w-2xl">{dept.description}</p>
          )}
        </div>
      </div>

      {/* Tabs — render as buttons that update searchParams. */}
      <div className="border-b flex gap-1 overflow-x-auto">
        {visibleTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors " +
              (activeTab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-900")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "overview"   && <OverviewTab dept={dept} />}
        {activeTab === "members"    && <MembersTab dept={dept} perms={perms} />}
        {activeTab === "attendance" && <AttendanceTab dept={dept} perms={perms} />}
        {activeTab === "analytics"  && <AnalyticsTab dept={dept} />}
        {activeTab === "settings"   && <SettingsTab dept={dept} perms={perms} onUpdated={(d) => setDept(d)} />}
      </div>
    </div>
  );
}
