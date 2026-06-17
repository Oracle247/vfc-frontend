"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Plus, Search } from "lucide-react";
import { userService } from "@/services/userService";
import { authService } from "@/services/authService";
import {
  AccountStatus,
  IUser,
  UpdateChurchJourneyPayload,
  UpdateUserPayload,
  UserFilterParams,
} from "@/types/user";
import { PaginatedData } from "@/types/api";
import type { RegisterPayload } from "@/types/auth";
import MembersTable from "./_components/MembersTable";
import { ChurchJourneyDialog } from "./_components/ChurchJourneyDialog";
import { SetPasswordDialog } from "./_components/SetPasswordDialog";
import { BulkImportDialog } from "./_components/BulkImportDialog";
import { RegisterMemberDialog } from "./_components/RegisterMemberDialog";
import { EditMemberDialog } from "./_components/EditMemberDialog";

// Members view is scoped to churchStatus=MEMBER. First timers + visitors live
// at /admin/visitors so the lists stay focused. Default accountStatus filter
// to ACTIVE so suspended/archived users don't clutter the list — admins can
// flip to "all" or a specific status when needed.
const MEMBERS_ONLY: UserFilterParams = {
  page: 1,
  limit: 20,
  churchStatus: "MEMBER",
  accountStatus: "ACTIVE",
};

export default function MembersPage() {
  const [members, setMembers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState<UserFilterParams>(MEMBERS_ONLY);

  // Dialog states
  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [journeyUser, setJourneyUser] = useState<IUser | null>(null);
  const [passwordUser, setPasswordUser] = useState<IUser | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const result: PaginatedData<IUser> = await userService.getFilteredUsers(filters);
      setMembers(result.data);
      setPagination({ page: result.page, totalPages: result.totalPages, total: result.total });
    } catch {
      // Error handled by handleApiCall
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => {
        const next = searchInput || undefined;
        if (prev.search === next) return prev;
        return { ...prev, search: next, page: 1 };
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "ALL" ? undefined : value,
      page: 1,
    }));
  };

  const handleChurchJourneySave = async (id: string, data: UpdateChurchJourneyPayload) => {
    await userService.updateChurchJourney(id, data);
    fetchMembers();
  };

  const handleEditMemberSave = async (id: string, data: UpdateUserPayload) => {
    await userService.updateUser(id, data);
    fetchMembers();
  };

  const handleSetPassword = async (id: string, password: string) => {
    await userService.setPassword(id, password);
  };

  const handleDelete = async (user: IUser) => {
    if (!user.id || !confirm(`Delete ${user.firstName} ${user.lastName}?`)) return;
    await userService.deleteUser(user.id);
    fetchMembers();
  };

  const handleSendInvite = async (user: IUser) => {
    if (!user.id) return;
    if (
      !confirm(
        `Send a password-setup invite email to ${user.firstName} ${user.lastName} (${user.email})?`,
      )
    ) {
      return;
    }
    await userService.sendInvite(user.id);
  };

  const handleBulkImport = async (file: File) => {
    const result = await userService.bulkImport(file);
    fetchMembers();
    return result;
  };

  const handleRegister = async (payload: RegisterPayload) => {
    await authService.register(payload);
    fetchMembers();
  };

  const handleUpdateStatus = async (user: IUser, status: AccountStatus) => {
    if (!user.id) return;
    if (!confirm(`Set ${user.firstName} ${user.lastName} to ${status}?`)) return;
    await userService.updateAccountStatus(user.id, status);
    fetchMembers();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="text-gray-500">
            {pagination.total} total members
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowRegister(true)}>
            <Plus className="h-4 w-4 mr-2" /> Register Member
          </Button>
          <Button variant="outline" onClick={() => setShowImport(true)}>
            <Upload className="h-4 w-4 mr-2" /> Bulk Import
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.role || "ALL"}
          onValueChange={(v) => handleFilterChange("role", v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="WORKER">Worker</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.accountStatus || "ALL"}
          onValueChange={(v) => handleFilterChange("accountStatus", v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading members...</div>
      ) : (
        <MembersTable
          data={members}
          onEdit={(user) => setEditUser(user)}
          onChurchJourney={(user) => setJourneyUser(user)}
          onSetPassword={(user) => setPasswordUser(user)}
          onDelete={handleDelete}
          onSendInvite={handleSendInvite}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => setFilters((p) => ({ ...p, page: (p.page || 1) - 1 }))}
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
            onClick={() => setFilters((p) => ({ ...p, page: (p.page || 1) + 1 }))}
          >
            Next
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <EditMemberDialog
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        user={editUser}
        onSave={handleEditMemberSave}
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

      <BulkImportDialog
        open={showImport}
        onOpenChange={setShowImport}
        onImport={handleBulkImport}
      />

      <RegisterMemberDialog
        open={showRegister}
        onOpenChange={setShowRegister}
        onRegister={handleRegister}
      />
    </div>
  );
}
