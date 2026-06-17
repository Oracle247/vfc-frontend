"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { userService } from "@/services/userService";
import {
  IUser,
  UpdateChurchJourneyPayload,
  UpdateUserPayload,
  UserFilterParams,
} from "@/types/user";
import MembersTable from "../members/_components/MembersTable";
import { ChurchJourneyDialog } from "../members/_components/ChurchJourneyDialog";
import { SetPasswordDialog } from "../members/_components/SetPasswordDialog";
import { EditMemberDialog } from "../members/_components/EditMemberDialog";

type Show = "BOTH" | "FIRST_TIMER" | "VISITOR";

const LIMIT = 20;

export default function VisitorsPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [show, setShow] = useState<Show>("BOTH");

  // Dialog states
  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [journeyUser, setJourneyUser] = useState<IUser | null>(null);
  const [passwordUser, setPasswordUser] = useState<IUser | null>(null);

  // Backend's getFilteredUsers takes a single churchStatus value. For
  // "BOTH" we make two parallel calls and merge client-side. List sizes
  // are small (admin-only view), so the cost is negligible.
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const base: UserFilterParams = { page, limit: LIMIT, search };
      if (show === "BOTH") {
        const [a, b] = await Promise.all([
          userService.getFilteredUsers({ ...base, churchStatus: "FIRST_TIMER" }),
          userService.getFilteredUsers({ ...base, churchStatus: "VISITOR" }),
        ]);
        // Merge: stable order by createdAt desc; both responses already sort
        // that way per backend convention. Total pages = max of the two.
        const merged = [...a.data, ...b.data].sort((x, y) => {
          const xt = x.createdAt ? new Date(x.createdAt).getTime() : 0;
          const yt = y.createdAt ? new Date(y.createdAt).getTime() : 0;
          return yt - xt;
        });
        setUsers(merged);
        setTotalPages(Math.max(a.totalPages, b.totalPages));
        setTotal(a.total + b.total);
      } else {
        const result = await userService.getFilteredUsers({ ...base, churchStatus: show });
        setUsers(result.data);
        setTotalPages(result.totalPages);
        setTotal(result.total);
      }
    } catch {
      // Error handled by handleApiCall
    } finally {
      setLoading(false);
    }
  }, [page, search, show]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search — mirror the members page pattern so behaviour matches.
  useEffect(() => {
    const timeout = setTimeout(() => {
      const next = searchInput || undefined;
      setSearch((prev) => (prev === next ? prev : next));
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const handleChurchJourneySave = async (id: string, data: UpdateChurchJourneyPayload) => {
    await userService.updateChurchJourney(id, data);
    fetchUsers();
  };

  const handleEditSave = async (id: string, data: UpdateUserPayload) => {
    await userService.updateUser(id, data);
    fetchUsers();
  };

  const handleSetPassword = async (id: string, password: string) => {
    await userService.setPassword(id, password);
  };

  const handleDelete = async (user: IUser) => {
    if (!user.id || !confirm(`Delete ${user.firstName} ${user.lastName}?`)) return;
    await userService.deleteUser(user.id);
    fetchUsers();
  };

  const segmentBtn = (value: Show, label: string) => (
    <button
      key={value}
      type="button"
      onClick={() => {
        setShow(value);
        setPage(1);
      }}
      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
        show === value
          ? "bg-primary text-primary-foreground"
          : "bg-transparent text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">First Timers & Visitors</h1>
          <p className="text-gray-500">{total} total</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="inline-flex rounded-md border bg-gray-50 p-0.5">
          {segmentBtn("BOTH", "Both")}
          {segmentBtn("FIRST_TIMER", "First Timers")}
          {segmentBtn("VISITOR", "Visitors")}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <MembersTable
          data={users}
          onEdit={(user) => setEditUser(user)}
          onChurchJourney={(user) => setJourneyUser(user)}
          onSetPassword={(user) => setPasswordUser(user)}
          onDelete={handleDelete}
        />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <EditMemberDialog
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        user={editUser}
        onSave={handleEditSave}
      />

      <ChurchJourneyDialog
        open={!!journeyUser}
        onOpenChange={(open) => !open && setJourneyUser(null)}
        user={journeyUser}
        onSave={handleChurchJourneySave}
      />

      <SetPasswordDialog
        open={!!passwordUser}
        onOpenChange={(open) => !open && setPasswordUser(null)}
        user={passwordUser}
        onSave={handleSetPassword}
      />
    </div>
  );
}
