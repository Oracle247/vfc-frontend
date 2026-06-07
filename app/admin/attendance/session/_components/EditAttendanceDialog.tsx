"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IAttendance, ISessionService } from "@/types/attendance";

interface EditAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendance: IAttendance | null;
  /** Pass when the parent session has multiple services so the dialog can render a picker. */
  services?: ISessionService[];
  onSave: (
    id: string,
    payload: { markedAt: string; serviceOrder?: number },
  ) => Promise<void>;
}

// HTML's datetime-local input expects "YYYY-MM-DDTHH:mm" in the user's local
// timezone. Date#toISOString returns UTC, so we format the local fields by hand.
const toDateTimeLocal = (v?: string | Date | null) => {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export function EditAttendanceDialog({
  open,
  onOpenChange,
  attendance,
  services = [],
  onSave,
}: EditAttendanceDialogProps) {
  const [markedAt, setMarkedAt] = useState("");
  const [serviceOrder, setServiceOrder] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!attendance) return;
    setMarkedAt(toDateTimeLocal(attendance.markedAt));
    setServiceOrder(String(attendance.serviceOrder ?? 1));
  }, [attendance, open]);

  const showServicePicker = services.length > 1;

  const handleSave = async () => {
    if (!attendance?.id || !markedAt) return;
    setSaving(true);
    try {
      // datetime-local is interpreted as local time; new Date(...) produces the
      // correct UTC instant for the backend's ISO requirement.
      const iso = new Date(markedAt).toISOString();
      const parsedOrder = Number(serviceOrder);
      await onSave(attendance.id, {
        markedAt: iso,
        serviceOrder:
          showServicePicker && Number.isFinite(parsedOrder) && parsedOrder > 0
            ? parsedOrder
            : undefined,
      });
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
            Edit Attendance
            {attendance?.user && (
              <span className="block text-sm font-normal text-gray-500 mt-1">
                {attendance.user.firstName} {attendance.user.lastName}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Marked At</Label>
            <Input
              type="datetime-local"
              value={markedAt}
              onChange={(e) => setMarkedAt(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Change the date and time this attendance was recorded.
            </p>
          </div>

          {showServicePicker && (
            <div className="space-y-2">
              <Label>Service</Label>
              <Select
                value={serviceOrder}
                onValueChange={(v) => setServiceOrder(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {[...services]
                    .sort((a, b) => a.order - b.order)
                    .map((s) => (
                      <SelectItem key={s.order} value={String(s.order)}>
                        Service {s.order}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Move this attendee to a different service in the session.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !markedAt}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
