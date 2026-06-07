"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

export interface ServiceFormRow {
  /** HH:mm — local time, paired with the parent session's date at submit time. */
  serviceTime: string;
  preServiceTime?: string;
  closesAt?: string;
}

interface ServicesEditorProps {
  services: ServiceFormRow[];
  onChange: (next: ServiceFormRow[]) => void;
  /** When true, render the multi-service controls (add/remove + per-row close time). */
  multi: boolean;
  onMultiChange: (next: boolean) => void;
}

const emptyRow: ServiceFormRow = { serviceTime: "", preServiceTime: "", closesAt: "" };

export function ServicesEditor({
  services,
  onChange,
  multi,
  onMultiChange,
}: ServicesEditorProps) {
  const updateRow = (idx: number, patch: Partial<ServiceFormRow>) => {
    const next = services.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    onChange(next);
  };

  const addRow = () => onChange([...services, { ...emptyRow }]);
  const removeRow = (idx: number) =>
    onChange(services.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Service Schedule</Label>
        <label className="inline-flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={multi}
            onChange={(e) => {
              const on = e.target.checked;
              onMultiChange(on);
              // When turning multi off, drop everything but the first row.
              if (!on && services.length > 1) onChange([services[0]]);
              // When turning multi on, ensure at least 2 rows.
              if (on && services.length < 2) onChange([...services, { ...emptyRow }]);
            }}
            className="h-3.5 w-3.5 rounded border-gray-300"
          />
          Multi-service
        </label>
      </div>

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
                {multi && services.length > 1 && (
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
                  <Label className="text-xs">Pre-service time</Label>
                  <Input
                    type="time"
                    value={row.preServiceTime ?? ""}
                    onChange={(e) =>
                      updateRow(idx, { preServiceTime: e.target.value })
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
                        updateRow(idx, { closesAt: e.target.value })
                      }
                      placeholder={isLast ? "optional" : "required"}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {multi && (
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
      )}
    </div>
  );
}

/** Convert form rows into `SessionServiceInput[]` ISO strings using the session date. */
export function rowsToServicesPayload(
  date: string,
  rows: ServiceFormRow[],
): Array<{
  order: number;
  serviceTime: string;
  preServiceTime?: string | null;
  closesAt?: string | null;
}> {
  return rows.map((row, idx) => {
    const iso = (t: string) =>
      t ? new Date(`${date}T${t}`).toISOString() : null;
    return {
      order: idx + 1,
      serviceTime: iso(row.serviceTime)!,
      preServiceTime: iso(row.preServiceTime ?? "") ?? null,
      closesAt: iso(row.closesAt ?? "") ?? null,
    };
  });
}

/** Validate rows: every service has a serviceTime, non-last services have closesAt when multi. */
export function validateServicesRows(rows: ServiceFormRow[], multi: boolean): string | null {
  if (rows.length === 0) return "At least one service is required.";
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (!r.serviceTime) return `Service ${i + 1}: service time is required.`;
    if (r.preServiceTime && r.preServiceTime > r.serviceTime) {
      return `Service ${i + 1}: pre-service time must be earlier than service time.`;
    }
    if (multi && i < rows.length - 1 && !r.closesAt) {
      return `Service ${i + 1}: closes-at time is required when there's a next service.`;
    }
    if (r.closesAt && r.closesAt < r.serviceTime) {
      return `Service ${i + 1}: closes-at must be later than service time.`;
    }
  }
  return null;
}

/** Pull the date (YYYY-MM-DD) and HH:mm rows from an existing session's ISO services array. */
export function isoServicesToFormRows(
  services?: Array<{
    order: number;
    serviceTime: string;
    preServiceTime?: string | null;
    closesAt?: string | null;
  }>,
): { date: string; rows: ServiceFormRow[]; multi: boolean } {
  if (!services || services.length === 0) {
    return { date: "", rows: [{ serviceTime: "", preServiceTime: "", closesAt: "" }], multi: false };
  }
  const sorted = [...services].sort((a, b) => a.order - b.order);
  const first = new Date(sorted[0].serviceTime);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${first.getFullYear()}-${pad(first.getMonth() + 1)}-${pad(first.getDate())}`;
  const toTime = (iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  return {
    date: dateStr,
    rows: sorted.map((s) => ({
      serviceTime: toTime(s.serviceTime),
      preServiceTime: toTime(s.preServiceTime),
      closesAt: toTime(s.closesAt),
    })),
    multi: sorted.length > 1,
  };
}
