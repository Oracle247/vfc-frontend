// components/AttendanceTable.tsx
"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { IAttendance } from "@/types/attendance";
import { format } from "date-fns";
import { DataTable } from "../ui/datatable";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";

type AttendeeTab = "all" | "members" | "first_timers" | "workers";

interface AttendanceTableProps {
  data: IAttendance[];
  /** When > 1, the Service column appears. */
  serviceCount?: number;
  onEdit?: (attendance: IAttendance) => void;
  onDelete?: (attendance: IAttendance) => void;
}

export function AttendanceTable({ data, serviceCount = 1, onEdit, onDelete }: AttendanceTableProps) {
  const [tab, setTab] = useState<AttendeeTab>("all");

  const columns = useMemo<ColumnDef<IAttendance>[]>(() => {
    const base: ColumnDef<IAttendance>[] = [
      {
        accessorKey: "user.firstName",
        header: "First Name",
        cell: ({ row }) => row.original.user?.firstName || "—",
      },
      {
        accessorKey: "user.lastName",
        header: "Last Name",
        cell: ({ row }) => row.original.user?.lastName || "—",
      },
      {
        accessorKey: "user.department",
        header: "Department",
        cell: ({ row }) => row.original.user?.department || "—",
      },
      {
        accessorKey: "markedAt",
        header: "Marked At",
        cell: ({ row }) =>
          row.original.markedAt
            ? format(new Date(row.original.markedAt), "dd MMM yyyy, hh:mm a")
            : "—",
      },
    ];

    if (serviceCount > 1) {
      base.push({
        accessorKey: "serviceOrder",
        header: "Service",
        cell: ({ row }) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
            S{row.original.serviceOrder}
          </span>
        ),
      });
    }

    if (onEdit || onDelete) {
      base.push({
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(row.original);
                }}
                title="Edit time"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(row.original);
                }}
                title="Delete entry"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      });
    }

    return base;
  }, [onEdit, onDelete, serviceCount]);

  const filtered = useMemo(() => {
    if (tab === "members") return data.filter(a => a.user?.churchStatus === "MEMBER" && a.user?.membershipType !== "WORKER");
    if (tab === "first_timers") return data.filter(a => a.user?.churchStatus === "FIRST_TIMER" || a.user?.churchStatus === "VISITOR");
    if (tab === "workers") return data.filter(a => a.user?.membershipType === "WORKER");
    return data;
  }, [data, tab]);

  const counts = useMemo(() => ({
    all: data.length,
    members: data.filter(a => a.user?.churchStatus === "MEMBER" && a.user?.membershipType !== "WORKER").length,
    first_timers: data.filter(a => a.user?.churchStatus === "FIRST_TIMER" || a.user?.churchStatus === "VISITOR").length,
    workers: data.filter(a => a.user?.membershipType === "WORKER").length,
  }), [data]);

  const tabs: { key: AttendeeTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "members", label: "Members" },
    { key: "first_timers", label: "First Timers" },
    { key: "workers", label: "Workers" },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
              tab === t.key
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        filterKey="userId"
        searchPlaceholder="Search by user ID..."
      />
    </div>
  );
}
