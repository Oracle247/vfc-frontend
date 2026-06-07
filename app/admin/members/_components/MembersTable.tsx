"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IUser } from "@/types/user";
import { DataTable } from "@/components/ui/datatable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Key, Trash2, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MembersTableProps {
  data: IUser[];
  onEdit: (user: IUser) => void;
  onChurchJourney: (user: IUser) => void;
  onSetPassword: (user: IUser) => void;
  onDelete: (user: IUser) => void;
}

const roleBadgeColor: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-800",
  WORKER: "bg-blue-100 text-blue-800",
  MEMBER: "bg-gray-100 text-gray-800",
};

const statusBadgeColor: Record<string, string> = {
  FIRST_TIMER: "bg-yellow-100 text-yellow-800",
  VISITOR: "bg-purple-100 text-purple-800",
  MEMBER: "bg-green-100 text-green-800",
};

export default function MembersTable({
  data,
  onEdit,
  onChurchJourney,
  onSetPassword,
  onDelete,
}: MembersTableProps) {
  const columns: ColumnDef<IUser>[] = [
    {
      header: "Name",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.original.firstName} {row.original.lastName}
          </div>
          <div className="text-sm text-gray-500">{row.original.email}</div>
        </div>
      ),
    },
    {
      header: "Phone",
      accessorKey: "phoneNumber",
    },
    {
      header: "Church Status",
      accessorKey: "churchStatus",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={statusBadgeColor[row.original.churchStatus] || ""}
        >
          {row.original.churchStatus?.replace("_", " ")}
        </Badge>
      ),
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={roleBadgeColor[row.original.role || "MEMBER"] || ""}
        >
          {row.original.role || "MEMBER"}
        </Badge>
      ),
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "-",
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Pencil className="h-4 w-4 mr-2" /> Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChurchJourney(row.original)}>
              <UserCog className="h-4 w-4 mr-2" /> Church Journey
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSetPassword(row.original)}>
              <Key className="h-4 w-4 mr-2" /> Set Password
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(row.original)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search members..."
    />
  );
}
