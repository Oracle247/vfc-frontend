// Shared types for ServiceDay + SpecialProgram templates. Both expose the same
// "list of services with HH:mm times" shape — kept side-by-side here so the
// dialog picker (Day vs Program) and the settings page can reuse one editor.

export type Weekday =
    | "SUNDAY"
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY";

export interface IServiceTemplate {
    id: string;
    order: number;
    serviceTime: string;       // "HH:mm"
    preServiceTime?: string | null;
    closesAt?: string | null;
}

export interface ServiceTemplateInput {
    order: number;
    serviceTime: string;
    preServiceTime?: string | null;
    closesAt?: string | null;
}

export interface IServiceDay {
    id: string;
    name: string;
    weekday: Weekday;
    services: IServiceTemplate[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateServiceDayPayload {
    name: string;
    weekday: Weekday;
    services: ServiceTemplateInput[];
}

export interface UpdateServiceDayPayload {
    name?: string;
    weekday?: Weekday;
    services?: ServiceTemplateInput[];
}

export interface ISpecialProgram {
    id: string;
    name: string;
    date?: string | null;
    services: IServiceTemplate[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateSpecialProgramPayload {
    name: string;
    date?: string | null;
    services: ServiceTemplateInput[];
}

export interface UpdateSpecialProgramPayload {
    name?: string;
    date?: string | null;
    services?: ServiceTemplateInput[];
}

/** Weekdays in display order — Sunday first matches biblical / US convention. */
export const WEEKDAY_ORDER: Weekday[] = [
    "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY",
];

export const WEEKDAY_LABEL: Record<Weekday, string> = {
    SUNDAY: "Sunday",
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
    SATURDAY: "Saturday",
};
