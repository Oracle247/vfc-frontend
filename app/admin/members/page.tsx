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

export default function MembersPage() {
  const [members, setMembers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState<UserFilterParams>({ page: 1, limit: 20 });

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

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
  };

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

  const handleBulkImport = async (file: File) => {
    const result = await userService.bulkImport(file);
    fetchMembers();
    return result;
  };

  const handleRegister = async (payload: RegisterPayload) => {
    await authService.register(payload);
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
        <div className="flex gap-2 flex-1 min-w-[200px]">
          <Input
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button variant="outline" size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Select
          value={filters.churchStatus || "ALL"}
          onValueChange={(v) => handleFilterChange("churchStatus", v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Church Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="FIRST_TIMER">First Timer</SelectItem>
            <SelectItem value="VISITOR">Visitor</SelectItem>
            <SelectItem value="MEMBER">Member</SelectItem>
          </SelectContent>
        </Select>

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
