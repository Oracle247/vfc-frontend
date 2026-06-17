"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Crown, HandHelping, Loader2, UserMinus, Search } from "lucide-react";
import { IDepartment } from "@/types/department";
import { IUser } from "@/types/user";
import { userService } from "@/services/userService";
import { departmentService } from "@/services/departmentService";

interface PermsLike {
  has: (k: "canManageMembers") => boolean;
}

export default function MembersTab({
  dept,
  perms,
}: {
  dept: IDepartment;
  perms: PermsLike;
}) {
  const [members, setMembers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const canManage = perms.has("canManageMembers");

  const load = async () => {
    setLoading(true);
    try {
      const res = await userService.getFilteredUsers({
        departmentId: dept.id,
        search: debouncedSearch || undefined,
        limit: 100,
      });
      setMembers(res?.data ?? []);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dept.id, debouncedSearch]);

  const headId = dept.headId;
  const assistantIds = useMemo(
    () => new Set((dept.assistantHeads ?? []).map((a) => a.id)),
    [dept.assistantHeads],
  );

  const handleRemove = async (userId: string) => {
    if (!confirm("Remove this member from the department?")) return;
    setBusyId(userId);
    try {
      await departmentService.removeMembers(dept.id, [userId]);
      load();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
        <CardTitle className="text-base">Members ({members.length})</CardTitle>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : members.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">
            {debouncedSearch ? "No matches." : "No members yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Email</th>
                  <th className="py-2 font-medium">Role</th>
                  {canManage && <th className="py-2 font-medium text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  const isHead = m.id === headId;
                  const isAssist = m.id && assistantIds.has(m.id);
                  return (
                    <tr key={m.id} className="border-b last:border-0">
                      <td className="py-2 font-medium">{m.firstName} {m.lastName}</td>
                      <td className="py-2 text-gray-600">{m.email}</td>
                      <td className="py-2">
                        <div className="flex gap-1 flex-wrap">
                          {isHead && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              <Crown className="h-3 w-3 mr-1" /> Head
                            </Badge>
                          )}
                          {isAssist && !isHead && (
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                              <HandHelping className="h-3 w-3 mr-1" /> Assistant
                            </Badge>
                          )}
                          {!isHead && !isAssist && <span className="text-gray-400">Worker</span>}
                        </div>
                      </td>
                      {canManage && (
                        <td className="py-2 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={busyId === m.id || isHead}
                            onClick={() => m.id && handleRemove(m.id)}
                            className="text-red-600 hover:text-red-700"
                            title={isHead ? "Remove the head from the Settings tab first" : "Remove"}
                          >
                            <UserMinus className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!canManage && (
          <p className="text-xs text-gray-500 mt-4">
            You can view this list but not modify it. Ask your head or an admin to add or remove members.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
