"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { ServiceTemplateInput } from "@/types/template";

interface Props {
  services: ServiceTemplateInput[];
  onChange: (next: ServiceTemplateInput[]) => void;
}

const empty = (order: number): ServiceTemplateInput => ({
  order,
  serviceTime: "",
  preServiceTime: "",
  closesAt: "",
});

/**
 * Renders the editable list of service rows on a ServiceDay or SpecialProgram.
 * Both templates have an identical shape (order + HH:mm times) — this is the
 * single source of truth for that editor so the two dialogs stay in sync.
 */
export function TemplateServicesEditor({ services, onChange }: Props) {
  const updateRow = (idx: number, patch: Partial<ServiceTemplateInput>) =>
    onChange(services.map((s, i) => (i === idx ? { ...s, ...patch } : s)));

  const addRow = () => onChange([...services, empty(services.length + 1)]);
  const removeRow = (idx: number) =>
    onChange(
      services
        .filter((_, i) => i !== idx)
        // Re-order so the array stays contiguous (1, 2, 3, ...)
        .map((s, i) => ({ ...s, order: i + 1 })),
    );

  const multi = services.length > 1;

  return (
    <div className="space-y-3">
      {services.map((row, idx) => {
        const isLast = idx === services.length - 1;
        return (
          <div
            key={idx}
            className="border rounded-md p-3 bg-gray-50 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">
                Service {idx + 1}
              </span>
              {services.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 h-7 w-7"
                  onClick={() => removeRow(idx)}
                  type="button"
                  aria-label={`Remove service ${idx + 1}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            <div className={`grid gap-2 ${multi ? "grid-cols-3" : "grid-cols-2"}`}>
              <div className="space-y-1">
                <Label className="text-xs">Service time *</Label>
                <Input
                  type="time"
                  value={row.serviceTime}
                  onChange={(e) => updateRow(idx, { serviceTime: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Pre-service</Label>
                <Input
                  type="time"
                  value={row.preServiceTime ?? ""}
                  onChange={(e) =>
                    updateRow(idx, { preServiceTime: e.target.value || null })
                  }
                />
              </div>
              {multi && (
                <div className="space-y-1">
                  <Label className="text-xs">
                    Closes at {isLast ? "" : "*"}
                  </Label>
                  <Input
                    type="time"
                    value={row.closesAt ?? ""}
                    onChange={(e) =>
                      updateRow(idx, { closesAt: e.target.value || null })
                    }
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addRow}
        className="w-full"
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add another service
      </Button>
    </div>
  );
}

/** Validation shared by both dialogs. Returns the first error message or null. */
export function validateTemplateServices(services: ServiceTemplateInput[]): string | null {
  if (services.length === 0) return "At least one service is required.";
  for (let i = 0; i < services.length; i++) {
    const r = services[i];
    if (!r.serviceTime) return `Service ${i + 1}: service time is required.`;
    if (r.preServiceTime && r.preServiceTime > r.serviceTime) {
      return `Service ${i + 1}: pre-service time must be earlier than service time.`;
    }
    if (services.length > 1 && i < services.length - 1 && !r.closesAt) {
      return `Service ${i + 1}: closes-at is required when a next service exists.`;
    }
    if (r.closesAt && r.closesAt < r.serviceTime) {
      return `Service ${i + 1}: closes-at must be later than service time.`;
    }
  }
  return null;
}
