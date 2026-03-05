// components/AttendanceTable.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IAttendance } from "@/types/attendance";
import { format } from "date-fns";
import { DataTable } from "../ui/datatable";

const columns: ColumnDef<IAttendance>[] = [
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

interface AttendanceTableProps {
  data: IAttendance[];
}

export function AttendanceTable({ data }: AttendanceTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterKey="userId"
      searchPlaceholder="Search by user ID..."
    />
  );
}
