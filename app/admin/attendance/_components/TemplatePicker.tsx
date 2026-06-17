"use client";

import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { serviceDayService } from "@/services/serviceDayService";
import { specialProgramService } from "@/services/specialProgramService";
import { IServiceDay, ISpecialProgram, WEEKDAY_LABEL } from "@/types/template";
import { ServiceFormRow } from "./ServicesEditor";

export type TemplateLink =
  | { kind: "day"; id: string }
  | { kind: "program"; id: string };

interface Props {
  /** Current selection. */
  value: TemplateLink | null;
  /** Fires when admin picks a different day/program. Parent should also prefill rows. */
  onChange: (
    next: TemplateLink | null,
    prefill?: { serviceName: string; rows: ServiceFormRow[] },
  ) => void;
  /** Hide picker when editing — switching templates mid-edit gets noisy. */
  disabled?: boolean;
}

const DAY_PREFIX = "day:";
const PROG_PREFIX = "prog:";
const DEFAULT_VARIATION = "__DEFAULT__";

const templateToFormRows = (
  services: { serviceTime: string; preServiceTime?: string | null; closesAt?: string | null }[],
): ServiceFormRow[] =>
  services.map((s) => ({
    serviceTime: s.serviceTime,
    preServiceTime: s.preServiceTime ?? "",
    closesAt: s.closesAt ?? "",
  }));

export function TemplatePicker({ value, onChange, disabled }: Props) {
  const [days, setDays] = useState<IServiceDay[]>([]);
  const [programs, setPrograms] = useState<ISpecialProgram[]>([]);
  // Per-day variation choice. Resets when the day changes. DEFAULT = use the
  // day's own services. Otherwise = use the named variation's services.
  const [variationId, setVariationId] = useState<string>(DEFAULT_VARIATION);

  useEffect(() => {
    serviceDayService.list().then(setDays).catch(() => setDays([]));
    specialProgramService.list().then(setPrograms).catch(() => setPrograms([]));
  }, []);

  const currentValue = value
    ? value.kind === "day"
      ? `${DAY_PREFIX}${value.id}`
      : `${PROG_PREFIX}${value.id}`
    : "";

  // Variations on the currently-picked ServiceDay (if any). SpecialPrograms
  // have no variations, so this stays empty for them.
  const currentDayVariations = useMemo(() => {
    if (!value || value.kind !== "day") return [];
    return days.find((d) => d.id === value.id)?.variations ?? [];
  }, [value, days]);

  const handleChange = (raw: string) => {
    setVariationId(DEFAULT_VARIATION);
    if (raw.startsWith(DAY_PREFIX)) {
      const id = raw.slice(DAY_PREFIX.length);
      const day = days.find((d) => d.id === id);
      onChange(
        { kind: "day", id },
        day
          ? { serviceName: day.name, rows: templateToFormRows(day.services) }
          : undefined,
      );
    } else if (raw.startsWith(PROG_PREFIX)) {
      const id = raw.slice(PROG_PREFIX.length);
      const program = programs.find((p) => p.id === id);
      onChange(
        { kind: "program", id },
        program
          ? { serviceName: program.name, rows: templateToFormRows(program.services) }
          : undefined,
      );
    }
  };

  const handleVariationChange = (next: string) => {
    setVariationId(next);
    if (!value || value.kind !== "day") return;
    const day = days.find((d) => d.id === value.id);
    if (!day) return;

    if (next === DEFAULT_VARIATION) {
      // Re-emit the day's own services. The TemplateLink doesn't change, but
      // the parent needs the prefill to reset its rows.
      onChange(
        { kind: "day", id: day.id },
        { serviceName: day.name, rows: templateToFormRows(day.services) },
      );
      return;
    }

    const variation = (day.variations ?? []).find((v) => v.id === next);
    if (!variation) return;
    onChange(
      { kind: "day", id: day.id },
      {
        // Suffix the day's name so the operator can see which preset is in
        // play on the form below the picker. They can still edit it.
        serviceName: `${day.name} — ${variation.name}`,
        rows: templateToFormRows(variation.services),
      },
    );
  };

  return (
    <div className="space-y-2">
      <Label>Use a template</Label>
      <Select value={currentValue} onValueChange={handleChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Pick a service day or special program" />
        </SelectTrigger>
        <SelectContent>
          {days.length > 0 && (
            <>
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                Service Days
              </div>
              {days.map((d) => (
                <SelectItem key={d.id} value={`${DAY_PREFIX}${d.id}`}>
                  {d.name} <span className="text-gray-400 text-xs">({WEEKDAY_LABEL[d.weekday]})</span>
                </SelectItem>
              ))}
            </>
          )}
          {programs.length > 0 && (
            <>
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                Special Programs
              </div>
              {programs.map((p) => (
                <SelectItem key={p.id} value={`${PROG_PREFIX}${p.id}`}>
                  {p.name}
                </SelectItem>
              ))}
            </>
          )}
          {days.length === 0 && programs.length === 0 && (
            <div className="px-2 py-2 text-xs text-gray-500">
              No templates yet. Create some in Settings → Service Days.
            </div>
          )}
        </SelectContent>
      </Select>

      {currentDayVariations.length > 0 && (
        <div className="space-y-1">
          <Label className="text-xs">Variation</Label>
          <Select value={variationId} onValueChange={handleVariationChange} disabled={disabled}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DEFAULT_VARIATION}>Default ({/* services count */}
                {days.find((d) => value && value.kind === "day" && d.id === value.id)?.services.length ?? 0}{" "}
                services)
              </SelectItem>
              {currentDayVariations.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name} ({v.services.length} {v.services.length === 1 ? "service" : "services"})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Selecting a template prefills the service name and service rows below.
        You can still edit any value before saving.
      </p>
    </div>
  );
}
