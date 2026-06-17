"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IAttendanceSession } from "@/types/attendance";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { attendanceService } from "@/services/attendanceService";
import { DataTable } from "@/components/ui/datatable";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { WEEKDAY_LABEL, WEEKDAY_ORDER, Weekday } from "@/types/template";
import { EditSessionDialog } from "./EditSessionDialog";

interface Group {
  key: string;
  title: string;
  subtitle?: string;
  sortKey: number;     // lower = rendered first
  sessions: IAttendanceSession[];
}

// Bucket order: each ServiceDay weekday slot 0–6, then Special Programs at 100,
// orphans (no parent) at 999. Within each, backend already returns createdAt
// desc which matches item #7's "ordered by creation time" requirement.
const groupSessions = (sessions: IAttendanceSession[]): Group[] => {
  const map = new Map<string, Group>();

  for (const s of sessions) {
    if (s.serviceDay) {
      const key = `day:${s.serviceDay.id}`;
      if (!map.has(key)) {
        const weekdayIdx = WEEKDAY_ORDER.indexOf(s.serviceDay.weekday as Weekday);
        map.set(key, {
          key,
          title: s.serviceDay.name,
          subtitle: WEEKDAY_LABEL[s.serviceDay.weekday as Weekday],
          sortKey: weekdayIdx === -1 ? 50 : weekdayIdx,
          sessions: [],
        });
      }
      map.get(key)!.sessions.push(s);
    } else if (s.specialProgram) {
      const key = `prog:${s.specialProgram.id}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          title: s.specialProgram.name,
          subtitle: s.specialProgram.date
            ? new Date(s.specialProgram.date).toLocaleDateString()
            : "Special Program",
          sortKey: 100,
          sessions: [],
        });
      }
      map.get(key)!.sessions.push(s);
    } else {
      const key = "orphan";
      if (!map.has(key)) {
        map.set(key, {
          key,
          title: "Other",
          subtitle: "No service day or program linked",
          sortKey: 999,
          sessions: [],
        });
      }
      map.get(key)!.sessions.push(s);
    }
  }

  return Array.from(map.values()).sort((a, b) => a.sortKey - b.sortKey);
};

export default function AttendanceSessionsTable() {
  const router = useRouter();
  const [sessions, setSessions] = useState<IAttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [editSession, setEditSession] = useState<IAttendanceSession | null>(null);
  // Collapsed group keys. Default all expanded; clicking a header toggles.
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleGroup = (key: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const fetchSessions = async (page = 1) => {
    setLoading(true);
    try {
      const result = await attendanceService.getAllSessions({ page, limit: 20 });
      setSessions(result.data);
      setPagination({ page: result.page, totalPages: result.totalPages });
    } catch {
      // handled by handleApiCall
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this session?")) return;
    await attendanceService.deleteSession(id);
    fetchSessions(pagination.page);
  };

  const handleSaveEdit = async (
    id: string,
    payload: {
      serviceName: string;
      date: string;
      services: Array<{
        order: number;
        serviceTime: string;
        preServiceTime?: string | null;
        closesAt?: string | null;
      }>;
    },
  ) => {
    await attendanceService.updateSession(id, {
      serviceName: payload.serviceName,
      date: new Date(`${payload.date}T00:00`).toISOString(),
      services: payload.services,
    });
    setEditSession(null);
    fetchSessions(pagination.page);
  };

  const columns: ColumnDef<IAttendanceSession>[] = useMemo(
    () => [
      {
        header: "Service Name",
        accessorKey: "serviceName",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/admin/attendance/session?sessionId=${row.original.id}`)}
            className="text-blue-600 hover:underline font-medium"
          >
            {row.original.serviceName}
          </button>
        ),
      },
      {
        header: "Date",
        accessorKey: "startedAt",
        cell: ({ row }) =>
          row.original.startedAt
            ? new Date(row.original.startedAt).toLocaleDateString()
            : "N/A",
      },
      {
        header: "Time",
        accessorKey: "startedAt_time",
        cell: ({ row }) =>
          row.original.startedAt
            ? new Date(row.original.startedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-",
      },
      {
        header: "Attendees",
        accessorKey: "attendees",
        cell: ({ row }) => row.original.attendees?.length || 0,
      },
      {
        header: "Created",
        accessorKey: "createdAt",
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setEditSession(row.original);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.original.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router],
  );

  const groups = useMemo(() => groupSessions(sessions), [sessions]);

  return (
    <div className="w-full space-y-6">
      {loading ? (
        <div className="text-center py-6">Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-6 text-gray-500">No sessions yet.</div>
      ) : (
        <>
          {groups.map((group) => {
            const isCollapsed = collapsed.has(group.key);
            return (
              <section key={group.key} className="space-y-2">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.key)}
                  className="w-full flex items-baseline gap-2 hover:bg-gray-50 rounded px-1 py-1 -mx-1 text-left"
                  aria-expanded={!isCollapsed}
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 self-center text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 self-center text-gray-400" />
                  )}
                  <h2 className="text-lg font-semibold">{group.title}</h2>
                  {group.subtitle && (
                    <span className="text-sm text-gray-500">{group.subtitle}</span>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">
                    {group.sessions.length}{" "}
                    {group.sessions.length === 1 ? "session" : "sessions"}
                  </span>
                </button>
                {!isCollapsed && (
                  <DataTable columns={columns} data={group.sessions} />
                )}
              </section>
            );
          })}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchSessions(pagination.page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchSessions(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <EditSessionDialog
        open={!!editSession}
        onOpenChange={(open) => !open && setEditSession(null)}
        session={editSession}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
