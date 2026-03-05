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
import { Textarea } from "@/components/ui/textarea";
import { RecordPaymentPayload } from "@/types/invoice";

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  remainingBalance: number;
  currency: string;
  onSave: (data: RecordPaymentPayload) => Promise<void>;
}

export function RecordPaymentDialog({
  open,
  onOpenChange,
  remainingBalance,
  currency,
  onSave,
}: RecordPaymentDialogProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || amt > remainingBalance) return;
    setSaving(true);
    try {
      await onSave({ amount: amt, note: note.trim() || undefined });
      setAmount("");
      setNote("");
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-gray-500">
            Remaining balance: {currency} {remainingBalance.toLocaleString()}
          </p>

          <div className="space-y-2">
            <Label>Amount ({currency})</Label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={remainingBalance}
            />
            {parseFloat(amount) > remainingBalance && (
              <p className="text-sm text-red-500">
                Amount exceeds remaining balance
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Note (optional)</Label>
            <Textarea
              placeholder="Payment note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              saving ||
              !amount ||
              parseFloat(amount) <= 0 ||
              parseFloat(amount) > remainingBalance
            }
          >
            {saving ? "Recording..." : "Record Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
