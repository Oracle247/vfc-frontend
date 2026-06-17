"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { attendanceService } from "@/services/attendanceService";
import { MemberAttendancePoint } from "@/types/attendance";

export default function MyAttendancePage() {
  const [rows, setRows] = useState<MemberAttendancePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceService
      .getMyAttendances()
      .then((r) => setRows(r ?? []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(
    () => [...rows].sort((a, b) => +new Date(b.markedAt) - +new Date(a.markedAt)),
    [rows],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Attendance</h1>
        <p className="text-gray-500">Every service you've been marked present for.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">History ({rows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : sorted.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">
              You haven't been marked at any service yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 font-medium">Service</th>
                    <th className="py-2 font-medium">Date</th>
                    <th className="py-2 font-medium">Marked at</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r) => {
                    const marked = new Date(r.markedAt);
                    const sessionDate = new Date(r.session?.startedAt ?? r.markedAt);
                    return (
                      <tr key={r.id} className="border-b last:border-0">
                        <td className="py-2">{r.session?.serviceName ?? "—"}</td>
                        <td className="py-2 text-gray-600">{sessionDate.toLocaleDateString()}</td>
                        <td className="py-2 text-gray-600">
                          {marked.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
