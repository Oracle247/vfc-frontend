"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Search, UserPlus, Crown } from "lucide-react";
import { IDepartment } from "@/types/department";
import { IUser } from "@/types/user";
import { userService } from "@/services/userService";
import { debounce } from "lodash";

interface ManageMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: IDepartment | null;
  onAssignHead: (deptId: string, userId: string) => Promise<void>;
  onRemoveHead: (deptId: string) => Promise<void>;
  onAddMembers: (deptId: string, userIds: string[]) => Promise<void>;
  onRemoveMembers: (deptId: string, userIds: string[]) => Promise<void>;
}

export function ManageMembersDialog({
  open,
  onOpenChange,
  department,
  onAssignHead,
  onRemoveHead,
  onAddMembers,
  onRemoveMembers,
}: ManageMembersDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = debounce(async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const results = await userService.searchUsers(query);
      // Filter out users already in the department
      const memberIds = new Set(department?.members?.map((m) => m.id) || []);
      setSearchResults(results.filter((u) => !memberIds.has(u.id)));
    } finally {
      setLoading(false);
    }
  }, 400);

  useEffect(() => {
    searchUsers(searchQuery);
  }, [searchQuery]);

  const handleAddMember = async (userId: string) => {
    if (!department) return;
    await onAddMembers(department.id, [userId]);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveMember = async (userId: string) => {
    if (!department) return;
    await onRemoveMembers(department.id, [userId]);
  };

  const handleMakeHead = async (userId: string) => {
    if (!department) return;
    await onAssignHead(department.id, userId);
  };

  const handleRemoveHead = async () => {
    if (!department) return;
    await onRemoveHead(department.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage - {department?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Head */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Department Head</h3>
            {department?.head ? (
              <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">
                    {department.head.firstName} {department.head.lastName}
                  </span>
                  <span className="text-sm text-gray-500">
                    {department.head.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500"
                  onClick={handleRemoveHead}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No head assigned</p>
            )}
          </div>

          {/* Members */}
          <div>
            <h3 className="text-sm font-semibold mb-2">
              Members ({department?.members?.length || 0})
            </h3>
            <div className="space-y-1 max-h-[200px] overflow-y-auto">
              {department?.members?.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-50"
                >
                  <div>
                    <span className="font-medium">
                      {member.firstName} {member.lastName}
                    </span>
                    {department.headId === member.id && (
                      <Badge className="ml-2 bg-yellow-100 text-yellow-800" variant="outline">
                        Head
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {department.headId !== member.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Make Head"
                        onClick={() => handleMakeHead(member.id!)}
                      >
                        <Crown className="h-4 w-4 text-yellow-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleRemoveMember(member.id!)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {!department?.members?.length && (
                <p className="text-sm text-gray-500 py-2">No members yet</p>
              )}
            </div>
          </div>

          {/* Add Members */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Add Members</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2 border rounded-lg divide-y max-h-[150px] overflow-y-auto">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 text-left"
                    onClick={() => handleAddMember(user.id!)}
                  >
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                    <UserPlus className="h-4 w-4 text-green-600" />
                  </button>
                ))}
              </div>
            )}
            {loading && (
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
