"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { IUser, UpdateChurchJourneyPayload } from "@/types/user";

interface ChurchJourneyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser | null;
  onSave: (id: string, data: UpdateChurchJourneyPayload) => Promise<void>;
}

export function ChurchJourneyDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: ChurchJourneyDialogProps) {
  const [churchStatus, setChurchStatus] = useState(user?.churchStatus || "");
  const [membershipType, setMembershipType] = useState(user?.membershipType || "");
  const [workerType, setWorkerType] = useState(user?.workerType || "");
  const [role, setRole] = useState(user?.role || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const payload: UpdateChurchJourneyPayload = {};
      if (churchStatus) payload.churchStatus = churchStatus as any;
      if (membershipType) payload.membershipType = membershipType as any;
      if (workerType) payload.workerType = workerType as any;
      if (role) payload.role = role as any;
      await onSave(user.id, payload);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  // Reset state when user changes
  if (user && churchStatus !== user.churchStatus && !saving) {
    setChurchStatus(user.churchStatus || "");
    setMembershipType(user.membershipType || "");
    setWorkerType(user.workerType || "");
    setRole(user.role || "");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Church Journey - {user?.firstName} {user?.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Church Status</Label>
            <Select value={churchStatus} onValueChange={setChurchStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIRST_TIMER">First Timer</SelectItem>
                <SelectItem value="VISITOR">Visitor</SelectItem>
                <SelectItem value="MEMBER">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Membership Type</Label>
            <Select value={membershipType} onValueChange={setMembershipType}>
              <SelectTrigger>
                <SelectValue placeholder="Select membership type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NON_WORKER">Non-Worker</SelectItem>
                <SelectItem value="WORKER">Worker</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Worker Type</Label>
            <Select value={workerType} onValueChange={setWorkerType}>
              <SelectTrigger>
                <SelectValue placeholder="Select worker type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REGULAR">Regular</SelectItem>
                <SelectItem value="EXECUTIVE">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>System Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="WORKER">Worker</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
