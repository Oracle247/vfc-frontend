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
import { IAttendanceSession, SessionServiceInput } from "@/types/attendance";
import { IServiceDay } from "@/types/template";
import { serviceDayService } from "@/services/serviceDayService";
import {
  ServicesEditor,
  rowsToServicesPayload,
  validateServicesRows,
  isoServicesToFormRows,
  type ServiceFormRow,
} from "./ServicesEditor";

const NONE = "__NONE__";

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
      serviceDayId?: string | null;
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
  const [serviceDays, setServiceDays] = useState<IServiceDay[]>([]);
  const [serviceDayId, setServiceDayId] = useState<string>(NONE);
  const [serviceDayDirty, setServiceDayDirty] = useState(false);

  // Load templates once so the picker stays populated across dialog reopens.
  useEffect(() => {
    if (!open) return;
    serviceDayService.list().then((rows) => setServiceDays(rows ?? [])).catch(() => setServiceDays([]));
  }, [open]);

  useEffect(() => {
    if (!session) return;
    setServiceName(session.serviceName);
    const { date: parsedDate, rows: parsedRows, multi: parsedMulti } =
      isoServicesToFormRows(session.services);
    // Fall back to the session's startedAt date if services weren't present.
    setDate(parsedDate || (session.startedAt ? new Date(session.startedAt).toISOString().slice(0, 10) : ""));
    setRows(parsedRows);
    setMulti(parsedMulti);
    setServiceDayId(session.serviceDayId ?? NONE);
    setServiceDayDirty(false);
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
        // Only forward the link when the user touched the picker. Sending it
        // unchanged on every save would clobber any SpecialProgram link the
        // session might still have.
        ...(serviceDayDirty ? { serviceDayId: serviceDayId === NONE ? null : serviceDayId } : {}),
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

          <div className="space-y-2">
            <Label>Service Day</Label>
            <Select
              value={serviceDayId}
              onValueChange={(v) => {
                setServiceDayId(v);
                setServiceDayDirty(true);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pick a service day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>None / Unassigned</SelectItem>
                {serviceDays.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                    <span className="text-gray-400 ml-1">
                      ({d.weekday.charAt(0) + d.weekday.slice(1).toLowerCase()})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Assign this session to a service day so it groups correctly in attendance trends.
            </p>
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
