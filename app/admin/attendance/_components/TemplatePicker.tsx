"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    serviceDayService.list().then(setDays).catch(() => setDays([]));
    specialProgramService.list().then(setPrograms).catch(() => setPrograms([]));
  }, []);

  const currentValue = value
    ? value.kind === "day"
      ? `${DAY_PREFIX}${value.id}`
      : `${PROG_PREFIX}${value.id}`
    : "";

  const handleChange = (raw: string) => {
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
      <p className="text-xs text-gray-500">
        Selecting a template prefills the service name and service rows below.
        You can still edit any value before saving.
      </p>
    </div>
  );
}
