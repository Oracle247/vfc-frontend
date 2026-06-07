"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IAttendanceSession } from "@/types/attendance";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { attendanceService } from "@/services/attendanceService";
import { DataTable } from "@/components/ui/datatable";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { EditSessionDialog } from "./EditSessionDialog";

export default function AttendanceSessionsTable() {
  const router = useRouter();
  const [sessions, setSessions] = useState<IAttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [editSession, setEditSession] = useState<IAttendanceSession | null>(null);

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

  const columns: ColumnDef<IAttendanceSession>[] = [
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
  ];

  return (
    <div className="w-full">
      {loading ? (
        <div className="text-center py-6">Loading sessions...</div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={sessions}
            searchPlaceholder="Search by service name..."
          />
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
