// Income-tracking types — mirrored across PWA + vision-attendance so the same
// matrix shape works everywhere.

export type IncomeCategory = "TITHE" | "OFFERING" | "SPECIAL_DONATION";
export type PaymentMethod = "CASH" | "TRANSFER";

export interface ISessionIncome {
    id: string;
    sessionServiceId: string;
    category: IncomeCategory;
    method: PaymentMethod;
    amount: string;        // Decimal arrives as a string from the API
    recordedById?: string | null;
    recordedAt: string;
}

export interface IncomeEntryInput {
    category: IncomeCategory;
    method: PaymentMethod;
    amount: number;
}

export interface PerServiceIncomeInput {
    serviceOrder: number;
    entries: IncomeEntryInput[];
}

export interface UpsertIncomePayload {
    services: PerServiceIncomeInput[];
}

export const CATEGORY_LABEL: Record<IncomeCategory, string> = {
    TITHE: "Tithe",
    OFFERING: "Offering",
    SPECIAL_DONATION: "Special Donation",
};

export const METHOD_LABEL: Record<PaymentMethod, string> = {
    CASH: "Cash",
    TRANSFER: "Transfer",
};

export const CATEGORY_ORDER: IncomeCategory[] = [
    "TITHE",
    "OFFERING",
    "SPECIAL_DONATION",
];

export const METHOD_ORDER: PaymentMethod[] = ["CASH", "TRANSFER"];
