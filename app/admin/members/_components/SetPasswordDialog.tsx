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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IUser } from "@/types/user";

interface SetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser | null;
  onSave: (id: string, password: string) => Promise<void>;
}

export function SetPasswordDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: SetPasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id || password.length < 6) return;
    setSaving(true);
    try {
      await onSave(user.id, password);
      setPassword("");
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Set Password - {user?.firstName} {user?.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password.length > 0 && password.length < 6 && (
              <p className="text-sm text-red-500">
                Password must be at least 6 characters
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || password.length < 6}
          >
            {saving ? "Setting..." : "Set Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
