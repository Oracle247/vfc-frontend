"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ISpecialProgram, ServiceTemplateInput } from "@/types/template";
import {
  TemplateServicesEditor,
  validateTemplateServices,
} from "./TemplateServicesEditor";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: ISpecialProgram | null;
  onSave: (payload: {
    name: string;
    date?: string | null;
    services: ServiceTemplateInput[];
  }) => Promise<void>;
}

const blank: ServiceTemplateInput = { order: 1, serviceTime: "", preServiceTime: "", closesAt: "" };

// HTML date input wants YYYY-MM-DD; convert from/to ISO at the edges.
const toDateInput = (iso?: string | null) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");

export function SpecialProgramDialog({ open, onOpenChange, initial, onSave }: Props) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [services, setServices] = useState<ServiceTemplateInput[]>([{ ...blank }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setName(initial.name);
      setDate(toDateInput(initial.date));
      setServices(
        initial.services.map((s) => ({
          order: s.order,
          serviceTime: s.serviceTime,
          preServiceTime: s.preServiceTime ?? "",
          closesAt: s.closesAt ?? "",
        })),
      );
    } else {
      setName("");
      setDate("");
      setServices([{ ...blank }]);
    }
    setError(null);
  }, [open, initial]);

  const handleSave = async () => {
    if (!name.trim()) return setError("Name is required.");
    const validationError = validateTemplateServices(services);
    if (validationError) return setError(validationError);

    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        date: date ? new Date(`${date}T00:00`).toISOString() : null,
        services: services.map((s, i) => ({
          order: i + 1,
          serviceTime: s.serviceTime,
          preServiceTime: s.preServiceTime || null,
          closesAt: s.closesAt || null,
        })),
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
          <DialogTitle>{initial ? "Edit Special Program" : "Add Special Program"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="e.g. Easter Service"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>
              Date <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Leave blank if the program runs on multiple dates.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Default Services</Label>
            <TemplateServicesEditor services={services} onChange={setServices} />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
