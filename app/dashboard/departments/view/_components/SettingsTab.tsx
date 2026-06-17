"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Trash2, Plus } from "lucide-react";
import { IDepartment } from "@/types/department";
import { departmentService, IDepartmentPositionRow } from "@/services/departmentService";
import { rbacService, IPosition } from "@/services/rbacService";
import { userService } from "@/services/userService";
import { IUser } from "@/types/user";

interface PermsLike {
  has: (k: "canManageDeptSettings") => boolean;
}

export default function SettingsTab({
  dept,
  perms,
  onUpdated,
}: {
  dept: IDepartment;
  perms: PermsLike;
  onUpdated: (d: IDepartment) => void;
}) {
  const canEdit = perms.has("canManageDeptSettings");

  // ── Name + description form ─────────────────────────────────────────
  const [name, setName] = useState(dept.name);
  const [description, setDescription] = useState(dept.description ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const profileDirty = name !== dept.name || (description ?? "") !== (dept.description ?? "");

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const updated = await departmentService.updateDepartment(dept.id, {
        name: name !== dept.name ? name : undefined,
        description: description !== (dept.description ?? "") ? description : undefined,
      });
      if (updated) onUpdated(updated);
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Positions: list + assignment form ───────────────────────────────
  const [positions, setPositions] = useState<IDepartmentPositionRow[]>([]);
  const [catalog, setCatalog] = useState<IPosition[]>([]);
  const [members, setMembers] = useState<IUser[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(true);
  const [pickUserId, setPickUserId] = useState<string>("");
  const [pickPositionId, setPickPositionId] = useState<string>("");
  const [assigning, setAssigning] = useState(false);

  const loadPositions = async () => {
    setPositionsLoading(true);
    try {
      const rows = await departmentService.listPositions(dept.id);
      setPositions(rows ?? []);
    } finally {
      setPositionsLoading(false);
    }
  };

  useEffect(() => {
    loadPositions();
    rbacService.listPositions().then((p) => setCatalog(p ?? []));
    userService
      .getFilteredUsers({ departmentId: dept.id, limit: 200 })
      .then((res) => setMembers(res?.data ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dept.id]);

  const handleAssign = async () => {
    if (!pickUserId || !pickPositionId) return;
    setAssigning(true);
    try {
      await departmentService.assignPosition(dept.id, pickUserId, pickPositionId);
      setPickUserId("");
      setPickPositionId("");
      loadPositions();
    } finally {
      setAssigning(false);
    }
  };

  const handleRemove = async (userId: string, positionId: string) => {
    if (!confirm("Remove this position assignment?")) return;
    await departmentService.removePosition(dept.id, userId, positionId);
    loadPositions();
  };

  if (!canEdit) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-gray-500 text-center">
          Settings are visible only to department heads (or admins).
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Department Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={saveProfile} disabled={!profileDirty || savingProfile}>
              {savingProfile ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Positions</CardTitle>
          <p className="text-xs text-gray-500">
            Assign Secretary, Coordinator, Team Lead, etc. Position-derived permissions
            stack with the user&apos;s existing head/assistant role.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Assignment row */}
          <div className="flex gap-2 flex-wrap items-end">
            <div className="flex-1 min-w-[200px] space-y-1">
              <label className="text-xs text-gray-500">Member</label>
              <Select value={pickUserId} onValueChange={setPickUserId}>
                <SelectTrigger><SelectValue placeholder="Choose a member…" /></SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id ?? ""}>
                      {m.firstName} {m.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px] space-y-1">
              <label className="text-xs text-gray-500">Position</label>
              <Select value={pickPositionId} onValueChange={setPickPositionId}>
                <SelectTrigger><SelectValue placeholder="Choose a position…" /></SelectTrigger>
                <SelectContent>
                  {catalog.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              disabled={!pickUserId || !pickPositionId || assigning}
              onClick={handleAssign}
            >
              <Plus className="h-4 w-4 mr-1" /> Assign
            </Button>
          </div>

          {/* Existing assignments */}
          {positionsLoading ? (
            <div className="py-6 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : positions.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No positions assigned yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 font-medium">Member</th>
                  <th className="py-2 font-medium">Position</th>
                  <th className="py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="py-2">{row.user.firstName} {row.user.lastName}</td>
                    <td className="py-2">
                      <Badge variant="outline">{row.position.name}</Badge>
                    </td>
                    <td className="py-2 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleRemove(row.userId, row.positionId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
