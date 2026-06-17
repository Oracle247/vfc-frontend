"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Loader2, Save, X } from "lucide-react";
import { IDepartment } from "@/types/department";
import { IServiceDay, WEEKDAY_ORDER } from "@/types/template";
import { serviceDayService, IDepartmentLateTime } from "@/services/serviceDayService";

interface PermsLike {
  has: (k: "canManageAttendance") => boolean;
}

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export default function AttendanceTab({
  dept,
  perms,
}: {
  dept: IDepartment;
  perms: PermsLike;
}) {
  const [days, setDays] = useState<IServiceDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [lateMap, setLateMap] = useState<Record<string, IDepartmentLateTime | undefined>>({});

  const canEdit = perms.has("canManageAttendance");

  useEffect(() => {
    serviceDayService
      .list()
      .then((rows) => setDays(rows ?? []))
      .catch(() => setDays([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (days.length === 0) return;
    Promise.all(
      days.map((d) =>
        serviceDayService
          .listDeptLateTimes(d.id)
          .then((rows) => [d.id, (rows ?? []).find((r) => r.departmentId === dept.id)] as [string, IDepartmentLateTime | undefined])
          .catch(() => [d.id, undefined] as [string, IDepartmentLateTime | undefined]),
      ),
    ).then((pairs) => {
      const next: Record<string, IDepartmentLateTime | undefined> = {};
      pairs.forEach(([id, row]) => { next[id] = row; });
      setLateMap(next);
    });
  }, [days, dept.id]);

  const ordered = useMemo(
    () => [...days].sort((a, b) =>
      WEEKDAY_ORDER.indexOf(a.weekday) - WEEKDAY_ORDER.indexOf(b.weekday),
    ),
    [days],
  );

  const handleSave = async (serviceDayId: string, lateTime: string) => {
    const saved = await serviceDayService.upsertDeptLateTime(serviceDayId, dept.id, lateTime);
    if (saved) setLateMap((prev) => ({ ...prev, [serviceDayId]: saved }));
  };

  const handleClear = async (serviceDayId: string) => {
    const res = await serviceDayService.removeDeptLateTime(serviceDayId, dept.id);
    if (res) setLateMap((prev) => ({ ...prev, [serviceDayId]: undefined }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" /> Late-coming Cutoffs
          </CardTitle>
          <p className="text-xs text-gray-500">
            Workers in this department marked after the cutoff are flagged as late in the
            per-department report. Clearing falls back to the session-wide rule.
            {!canEdit && " You can view but not edit."}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="py-6 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : ordered.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No service days configured.</p>
          ) : (
            ordered.map((day) => (
              <LateRow
                key={day.id}
                day={day}
                current={lateMap[day.id]}
                canEdit={canEdit}
                onSave={(t) => handleSave(day.id, t)}
                onClear={() => handleClear(day.id)}
              />
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Department Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-500">
          Per-department attendance breakdowns are exposed via the Analytics tab and the
          PDF report&apos;s &quot;Per-department Late Workers&quot; section. Full inline numbers land in
          a follow-up wave alongside the department analytics endpoint.
        </CardContent>
      </Card>
    </div>
  );
}

function LateRow({
  day,
  current,
  canEdit,
  onSave,
  onClear,
}: {
  day: IServiceDay;
  current?: IDepartmentLateTime;
  canEdit: boolean;
  onSave: (t: string) => Promise<void>;
  onClear: () => Promise<void>;
}) {
  const [value, setValue] = useState<string>(current?.lateTime ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setValue(current?.lateTime ?? "");
  }, [current?.lateTime]);

  const dirty = (current?.lateTime ?? "") !== value;
  const valid = value === "" || HHMM.test(value);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex-1 min-w-[180px]">
        <span className="text-sm font-medium">{day.name}</span>
        <span className="text-xs text-gray-500 ml-2">
          {day.weekday.charAt(0) + day.weekday.slice(1).toLowerCase()}
        </span>
      </div>
      <Input
        type="time"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-[120px]"
        disabled={!canEdit}
      />
      {canEdit && (
        <>
          <Button
            size="sm"
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
            disabled={!current || busy}
            onClick={async () => {
              setBusy(true);
              try { await onClear(); } finally { setBusy(false); }
            }}
          >
            <X className="h-3.5 w-3.5 mr-1" /> Clear
          </Button>
        </>
      )}
    </div>
  );
}
