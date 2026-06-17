"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  HandHelping,
  Loader2,
  Clock,
  TrendingUp,
  Save,
  X,
} from "lucide-react";
import { serviceDayService, IDepartmentLateTime } from "@/services/serviceDayService";
import { useCurrentUser } from "@/hooks/use-current-user";
import { IServiceDay, WEEKDAY_ORDER } from "@/types/template";
import { IDepartmentRef } from "@/types/user";
import AttendanceTrendBlock from "@/components/AttendanceTrendBlock";

interface DepartmentEntry {
  dept: IDepartmentRef;
  role: "HEAD" | "ASSISTANT";
}

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Exco-only dashboard. Replaces the read-only summary with:
 *  - Departments the user heads or assists (badge per role)
 *  - Late-cutoff editor per (ServiceDay × Department) the user can edit
 *  - The same attendance-trend chart the admin sees
 *
 * Permissions are enforced server-side; the UI just hides the editor row
 * for departments where the user has no head/assist relation.
 */
export default function ExcoHome({ firstName }: { firstName?: string }) {
  const { user } = useCurrentUser();
  const [serviceDays, setServiceDays] = useState<IServiceDay[]>([]);
  const [serviceDaysLoading, setServiceDaysLoading] = useState(true);

  // Map serviceDayId -> dept overrides for it. Loaded lazily per day.
  const [lateMap, setLateMap] = useState<Record<string, IDepartmentLateTime[]>>({});

  const myDepts = useMemo<DepartmentEntry[]>(() => {
    if (!user) return [];
    const headed = (user.headedDepartments ?? []).map<DepartmentEntry>((d) => ({
      dept: d,
      role: "HEAD",
    }));
    const headedIds = new Set(headed.map((e) => e.dept.id));
    const assistOnly = (user.assistantDepartments ?? [])
      .filter((d) => !headedIds.has(d.id))
      .map<DepartmentEntry>((d) => ({ dept: d, role: "ASSISTANT" }));
    return [...headed, ...assistOnly];
  }, [user]);

  useEffect(() => {
    serviceDayService
      .list()
      .then((rows) => setServiceDays(rows ?? []))
      .catch(() => setServiceDays([]))
      .finally(() => setServiceDaysLoading(false));
  }, []);

  // Fetch overrides for every service day once they load. One round-trip per
  // day keeps the response payload small and matches the URL shape.
  useEffect(() => {
    if (serviceDays.length === 0) return;
    Promise.all(
      serviceDays.map((d) =>
        serviceDayService
          .listDeptLateTimes(d.id)
          .then((rows) => [d.id, rows ?? []] as [string, IDepartmentLateTime[]])
          .catch(() => [d.id, [] as IDepartmentLateTime[]] as [string, IDepartmentLateTime[]]),
      ),
    ).then((pairs) => {
      const next: Record<string, IDepartmentLateTime[]> = {};
      pairs.forEach(([id, rows]) => { next[id] = rows; });
      setLateMap(next);
    });
  }, [serviceDays]);

  const findOverride = (serviceDayId: string, departmentId: string) =>
    (lateMap[serviceDayId] ?? []).find((r) => r.departmentId === departmentId);

  const handleSave = async (
    serviceDayId: string,
    departmentId: string,
    lateTime: string,
  ) => {
    const saved = await serviceDayService.upsertDeptLateTime(
      serviceDayId,
      departmentId,
      lateTime,
    );
    if (!saved) return;
    setLateMap((prev) => {
      const current = prev[serviceDayId] ?? [];
      const without = current.filter((r) => r.departmentId !== departmentId);
      return { ...prev, [serviceDayId]: [...without, saved] };
    });
  };

  const handleClear = async (serviceDayId: string, departmentId: string) => {
    const res = await serviceDayService.removeDeptLateTime(serviceDayId, departmentId);
    if (!res) return;
    setLateMap((prev) => ({
      ...prev,
      [serviceDayId]: (prev[serviceDayId] ?? []).filter((r) => r.departmentId !== departmentId),
    }));
  };

  // Sort by weekday so the editor reads naturally — Sunday first, etc.
  const orderedDays = useMemo(() => {
    const rank = (w: string) => WEEKDAY_ORDER.indexOf(w as never);
    return [...serviceDays].sort((a, b) => rank(a.weekday) - rank(b.weekday));
  }, [serviceDays]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-gray-500">
          Executive dashboard — manage your departments and review trends.
        </p>
      </div>

      {/* Departments the user belongs to */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">My Departments</h2>
        {myDepts.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-sm text-gray-500">
              You're not assigned as a head or assistant of any department yet.
              Late-time settings will appear here once you are.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myDepts.map((entry) => (
              <Card key={`${entry.dept.id}-${entry.role}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">{entry.dept.name}</CardTitle>
                  {entry.role === "HEAD" ? (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      <Crown className="h-3 w-3 mr-1" /> Head
                    </Badge>
                  ) : (
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      <HandHelping className="h-3 w-3 mr-1" /> Assistant
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">
                    Set per-service-day late-coming cutoffs below.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Late-time editor */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-500" /> Late-coming Cutoffs
        </h2>
        <p className="text-sm text-gray-500">
          Workers in your department marked after the cutoff are flagged as
          late in the per-department report. Clearing the override falls back
          to the session-wide late time.
        </p>

        {serviceDaysLoading ? (
          <Card>
            <CardContent className="py-6 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </CardContent>
          </Card>
        ) : orderedDays.length === 0 || myDepts.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-sm text-gray-500">
              {myDepts.length === 0
                ? "Assign yourself to a department to manage cutoffs."
                : "No service days configured yet."}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orderedDays.map((day) => (
              <Card key={day.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{day.name}</span>
                    <span className="text-xs font-normal text-gray-500">
                      {day.weekday.charAt(0) + day.weekday.slice(1).toLowerCase()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {myDepts.map((entry) => (
                    <LateTimeRow
                      key={`${day.id}-${entry.dept.id}`}
                      department={entry.dept}
                      override={findOverride(day.id, entry.dept.id)}
                      onSave={(t) => handleSave(day.id, entry.dept.id, t)}
                      onClear={() => handleClear(day.id, entry.dept.id)}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Attendance trends — service-day picker scopes the chart so weekday
          patterns aren't muddled together. */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-500" /> Attendance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceTrendBlock height={300} />
        </CardContent>
      </Card>
    </div>
  );
}

function LateTimeRow({
  department,
  override,
  onSave,
  onClear,
}: {
  department: IDepartmentRef;
  override?: IDepartmentLateTime;
  onSave: (lateTime: string) => Promise<void>;
  onClear: () => Promise<void>;
}) {
  const [value, setValue] = useState<string>(override?.lateTime ?? "");
  const [busy, setBusy] = useState(false);

  // Re-sync the local input when the parent's override changes (e.g. after
  // another tab edits or after a successful save flushes the map).
  useEffect(() => {
    setValue(override?.lateTime ?? "");
  }, [override?.lateTime]);

  const dirty = (override?.lateTime ?? "") !== value;
  const valid = value === "" || HHMM.test(value);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex-1 min-w-[140px] text-sm font-medium">
        {department.name}
      </div>
      <Input
        type="time"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-[120px]"
      />
      <Button
        size="sm"
        variant="default"
        disabled={!dirty || !valid || value === "" || busy}
        onClick={async () => {
          setBusy(true);
          try { await onSave(value); } finally { setBusy(false); }
        }}
      >
        <Save className="h-3.5 w-3.5 mr-1" /> Save
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={!override || busy}
        onClick={async () => {
          setBusy(true);
          try { await onClear(); } finally { setBusy(false); }
        }}
      >
        <X className="h-3.5 w-3.5 mr-1" /> Clear
      </Button>
    </div>
  );
}
