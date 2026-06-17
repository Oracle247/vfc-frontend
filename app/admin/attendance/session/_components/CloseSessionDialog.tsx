"use client";

import { useEffect, useMemo, useState } from "react";
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
import { ISessionService } from "@/types/attendance";
import {
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  IncomeCategory,
  METHOD_LABEL,
  METHOD_ORDER,
  PaymentMethod,
  UpsertIncomePayload,
} from "@/types/income";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Services already loaded with their `incomes[]` so we can prefill. */
  services: ISessionService[];
  /** Whether the session is currently closed — drives the button copy. */
  isClosed: boolean;
  /** Persist the income matrix (always called); when true, also closes the session. */
  onSave: (payload: UpsertIncomePayload, andClose: boolean) => Promise<void>;
}

// Compact key for the entry map — one cell per (service, category, method).
const cellKey = (svcOrder: number, cat: IncomeCategory, method: PaymentMethod) =>
  `${svcOrder}:${cat}:${method}`;

const fmtMoney = (n: number) =>
  n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function CloseSessionDialog({
  open,
  onOpenChange,
  services,
  isClosed,
  onSave,
}: Props) {
  const [cells, setCells] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Seed the form from the existing incomes whenever the dialog opens — that
  // way prior values aren't wiped on re-open.
  useEffect(() => {
    if (!open) return;
    const seeded: Record<string, string> = {};
    for (const svc of services) {
      for (const inc of svc.incomes ?? []) {
        seeded[cellKey(svc.order, inc.category, inc.method)] = String(inc.amount);
      }
    }
    setCells(seeded);
  }, [open, services]);

  const sortedServices = useMemo(
    () => [...services].sort((a, b) => a.order - b.order),
    [services],
  );

  const getCell = (svcOrder: number, cat: IncomeCategory, method: PaymentMethod) =>
    cells[cellKey(svcOrder, cat, method)] ?? "";

  const setCell = (svcOrder: number, cat: IncomeCategory, method: PaymentMethod, v: string) =>
    setCells((prev) => ({ ...prev, [cellKey(svcOrder, cat, method)]: v }));

  // Per-service totals for the live footer.
  const totalsByService = useMemo(() => {
    const out: Record<number, { cash: number; transfer: number; total: number }> = {};
    for (const s of sortedServices) {
      let cash = 0;
      let transfer = 0;
      for (const cat of CATEGORY_ORDER) {
        cash += Number(getCell(s.order, cat, "CASH")) || 0;
        transfer += Number(getCell(s.order, cat, "TRANSFER")) || 0;
      }
      out[s.order] = { cash, transfer, total: cash + transfer };
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells, sortedServices]);

  const grandTotal = useMemo(
    () => Object.values(totalsByService).reduce((acc, t) => acc + t.total, 0),
    [totalsByService],
  );

  const buildPayload = (): UpsertIncomePayload => ({
    services: sortedServices.map((s) => ({
      serviceOrder: s.order,
      entries: CATEGORY_ORDER.flatMap((cat) =>
        METHOD_ORDER.map((method) => {
          const raw = getCell(s.order, cat, method);
          const amount = Number(raw);
          return { category: cat, method, amount: Number.isFinite(amount) ? amount : 0 };
        }),
      ),
    })),
  });

  const submit = async (andClose: boolean) => {
    setSaving(true);
    try {
      await onSave(buildPayload(), andClose);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isClosed ? "Edit Income & Reopen" : "Close Session"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <p className="text-sm text-gray-500">
            Enter income figures per service. Empty cells are stored as 0.
          </p>

          {sortedServices.map((svc) => {
            const t = totalsByService[svc.order];
            return (
              <div key={svc.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semibold">
                    {sortedServices.length > 1 ? `Service ${svc.order}` : "Income"}
                  </h3>
                  <span className="text-xs text-gray-500">
                    Total {fmtMoney(t.total)}
                  </span>
                </div>

                <div className="grid grid-cols-[1fr_repeat(2,minmax(0,8rem))_minmax(0,8rem)] gap-2 items-end">
                  <div />
                  {METHOD_ORDER.map((m) => (
                    <Label key={m} className="text-xs text-gray-500">
                      {METHOD_LABEL[m]}
                    </Label>
                  ))}
                  <Label className="text-xs text-gray-500">Row total</Label>

                  {CATEGORY_ORDER.map((cat) => {
                    const cash = Number(getCell(svc.order, cat, "CASH")) || 0;
                    const transfer = Number(getCell(svc.order, cat, "TRANSFER")) || 0;
                    return (
                      <div key={cat} className="contents">
                        <div className="text-sm font-medium text-gray-700 py-2">
                          {CATEGORY_LABEL[cat]}
                        </div>
                        {METHOD_ORDER.map((m) => (
                          <Input
                            key={m}
                            type="number"
                            min="0"
                            step="0.01"
                            inputMode="decimal"
                            value={getCell(svc.order, cat, m)}
                            onChange={(e) => setCell(svc.order, cat, m, e.target.value)}
                            placeholder="0.00"
                          />
                        ))}
                        <div className="text-sm text-gray-600 py-2">
                          {fmtMoney(cash + transfer)}
                        </div>
                      </div>
                    );
                  })}

                  <div className="text-xs font-semibold text-gray-700 pt-2 border-t">
                    Service total
                  </div>
                  <div className="text-xs font-semibold text-gray-700 pt-2 border-t">
                    {fmtMoney(t.cash)}
                  </div>
                  <div className="text-xs font-semibold text-gray-700 pt-2 border-t">
                    {fmtMoney(t.transfer)}
                  </div>
                  <div className="text-xs font-bold text-gray-900 pt-2 border-t">
                    {fmtMoney(t.total)}
                  </div>
                </div>
              </div>
            );
          })}

          {sortedServices.length > 1 && (
            <div className="flex justify-between items-center border-t pt-3">
              <span className="font-semibold">Grand total</span>
              <span className="font-bold text-lg">{fmtMoney(grandTotal)}</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="outline" onClick={() => submit(false)} disabled={saving}>
            Save Income
          </Button>
          {!isClosed && (
            <Button onClick={() => submit(true)} disabled={saving}>
              {saving ? "Saving..." : "Save & Close"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
