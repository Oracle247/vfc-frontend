"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IServiceDay,
  ServiceTemplateInput,
  WEEKDAY_LABEL,
  WEEKDAY_ORDER,
  Weekday,
} from "@/types/template";
import {
  TemplateServicesEditor,
  validateTemplateServices,
} from "./TemplateServicesEditor";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: IServiceDay | null;
  onSave: (payload: {
    name: string;
    weekday: Weekday;
    services: ServiceTemplateInput[];
  }) => Promise<void>;
}

const blank: ServiceTemplateInput = { order: 1, serviceTime: "", preServiceTime: "", closesAt: "" };

export function ServiceDayDialog({ open, onOpenChange, initial, onSave }: Props) {
  const [name, setName] = useState("");
  const [weekday, setWeekday] = useState<Weekday>("SUNDAY");
  const [services, setServices] = useState<ServiceTemplateInput[]>([{ ...blank }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setName(initial.name);
      setWeekday(initial.weekday);
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
      setWeekday("SUNDAY");
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
        weekday,
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
          <DialogTitle>{initial ? "Edit Service Day" : "Add Service Day"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="e.g. Sunday Service"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Weekday</Label>
            <Select value={weekday} onValueChange={(v) => setWeekday(v as Weekday)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WEEKDAY_ORDER.map((d) => (
                  <SelectItem key={d} value={d}>
                    {WEEKDAY_LABEL[d]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
