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
import { IAttendanceSession, SessionServiceInput } from "@/types/attendance";
import {
  ServicesEditor,
  rowsToServicesPayload,
  validateServicesRows,
  isoServicesToFormRows,
  type ServiceFormRow,
} from "./ServicesEditor";

interface EditSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: IAttendanceSession | null;
  onSave: (
    id: string,
    payload: {
      serviceName: string;
      date: string;
      services: SessionServiceInput[];
    },
  ) => Promise<void>;
}

const emptyRow: ServiceFormRow = { serviceTime: "", preServiceTime: "", closesAt: "" };

export function EditSessionDialog({
  open,
  onOpenChange,
  session,
  onSave,
}: EditSessionDialogProps) {
  const [serviceName, setServiceName] = useState("");
  const [date, setDate] = useState("");
  const [rows, setRows] = useState<ServiceFormRow[]>([{ ...emptyRow }]);
  const [multi, setMulti] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    setServiceName(session.serviceName);
    const { date: parsedDate, rows: parsedRows, multi: parsedMulti } =
      isoServicesToFormRows(session.services);
    // Fall back to the session's startedAt date if services weren't present.
    setDate(parsedDate || (session.startedAt ? new Date(session.startedAt).toISOString().slice(0, 10) : ""));
    setRows(parsedRows);
    setMulti(parsedMulti);
    setError(null);
  }, [session, open]);

  const handleSave = async () => {
    if (!session?.id) return;
    if (!date) return setError("Date is required.");
    if (!serviceName.trim()) return setError("Service name is required.");
    const validationError = validateServicesRows(rows, multi);
    if (validationError) return setError(validationError);

    setSaving(true);
    try {
      await onSave(session.id, {
        serviceName: serviceName.trim(),
        date,
        services: rowsToServicesPayload(date, rows),
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Service Name</Label>
            <Input
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="e.g. Sunday Service"
            />
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <ServicesEditor
            services={rows}
            onChange={setRows}
            multi={multi}
            onMultiChange={setMulti}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
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
