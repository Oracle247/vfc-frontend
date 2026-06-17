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
import { SessionServiceInput } from "@/types/attendance";
import {
  ServicesEditor,
  rowsToServicesPayload,
  validateServicesRows,
  type ServiceFormRow,
} from "./ServicesEditor";
import { TemplateLink, TemplatePicker } from "./TemplatePicker";

interface StartSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartSession: (data: {
    date: string;
    serviceName: string;
    services: SessionServiceInput[];
    serviceDayId?: string | null;
    specialProgramId?: string | null;
  }) => void;
}

const initialRow: ServiceFormRow = { serviceTime: "", preServiceTime: "", closesAt: "" };

export function StartSessionDialog({
  open,
  onOpenChange,
  onStartSession,
}: StartSessionDialogProps) {
  const [date, setDate] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [rows, setRows] = useState<ServiceFormRow[]>([{ ...initialRow }]);
  const [multi, setMulti] = useState(false);
  const [template, setTemplate] = useState<TemplateLink | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setDate("");
    setServiceName("");
    setRows([{ ...initialRow }]);
    setMulti(false);
    setTemplate(null);
    setError(null);
  };

  const handleTemplate = (
    next: TemplateLink | null,
    prefill?: { serviceName: string; rows: ServiceFormRow[] },
  ) => {
    setTemplate(next);
    if (prefill) {
      setServiceName(prefill.serviceName);
      setRows(prefill.rows);
      setMulti(prefill.rows.length > 1);
    }
  };

  const handleSubmit = () => {
    if (!template) return setError("Pick a service day or special program.");
    if (!date) return setError("Date is required.");
    if (!serviceName.trim()) return setError("Service name is required.");
    const validationError = validateServicesRows(rows, multi);
    if (validationError) return setError(validationError);

    onStartSession({
      date,
      serviceName: serviceName.trim(),
      services: rowsToServicesPayload(date, rows),
      serviceDayId: template.kind === "day" ? template.id : null,
      specialProgramId: template.kind === "program" ? template.id : null,
    });
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Start Attendance Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <TemplatePicker value={template} onChange={handleTemplate} />

          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Service Name</Label>
            <Input
              placeholder="e.g. Sunday Service"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Start Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
