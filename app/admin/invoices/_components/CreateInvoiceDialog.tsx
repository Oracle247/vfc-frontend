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
import { Plus, Trash2 } from "lucide-react";
import { CreateInvoicePayload } from "@/types/invoice";

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateInvoicePayload) => Promise<void>;
}

interface DeptForm {
  departmentName: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  items: { description: string; quantity: number; unitPrice: number }[];
}

const emptyItem = () => ({ description: "", quantity: 1, unitPrice: 0 });
const emptyDept = (): DeptForm => ({
  departmentName: "",
  bankName: "",
  accountName: "",
  accountNumber: "",
  items: [emptyItem()],
});

export function CreateInvoiceDialog({
  open,
  onOpenChange,
  onSave,
}: CreateInvoiceDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [departments, setDepartments] = useState<DeptForm[]>([emptyDept()]);
  const [saving, setSaving] = useState(false);

  const updateDept = (index: number, field: string, value: string) => {
    setDepartments((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
  };

  const updateItem = (
    deptIndex: number,
    itemIndex: number,
    field: string,
    value: string | number
  ) => {
    setDepartments((prev) =>
      prev.map((d, di) =>
        di === deptIndex
          ? {
              ...d,
              items: d.items.map((item, ii) =>
                ii === itemIndex ? { ...item, [field]: value } : item
              ),
            }
          : d
      )
    );
  };

  const addItem = (deptIndex: number) => {
    setDepartments((prev) =>
      prev.map((d, i) =>
        i === deptIndex ? { ...d, items: [...d.items, emptyItem()] } : d
      )
    );
  };

  const removeItem = (deptIndex: number, itemIndex: number) => {
    setDepartments((prev) =>
      prev.map((d, i) =>
        i === deptIndex
          ? { ...d, items: d.items.filter((_, ii) => ii !== itemIndex) }
          : d
      )
    );
  };

  const handleSave = async () => {
    if (!title.trim() || departments.length === 0) return;
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        currency,
        departments: departments.map((d) => ({
          ...d,
          items: d.items.map((item) => ({
            ...item,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          })),
        })),
      });
      // Reset form
      setTitle("");
      setDescription("");
      setDepartments([emptyDept()]);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const grandTotal = departments.reduce(
    (sum, d) =>
      sum +
      d.items.reduce(
        (s, item) => s + Number(item.quantity) * Number(item.unitPrice),
        0
      ),
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Invoice title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {departments.map((dept, di) => (
            <div key={di} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Department {di + 1}</h4>
                {departments.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() =>
                      setDepartments((p) => p.filter((_, i) => i !== di))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Department name"
                  value={dept.departmentName}
                  onChange={(e) => updateDept(di, "departmentName", e.target.value)}
                />
                <Input
                  placeholder="Bank name"
                  value={dept.bankName}
                  onChange={(e) => updateDept(di, "bankName", e.target.value)}
                />
                <Input
                  placeholder="Account name"
                  value={dept.accountName}
                  onChange={(e) => updateDept(di, "accountName", e.target.value)}
                />
                <Input
                  placeholder="Account number"
                  value={dept.accountNumber}
                  onChange={(e) => updateDept(di, "accountNumber", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Items</Label>
                {dept.items.map((item, ii) => (
                  <div key={ii} className="flex gap-2 items-center">
                    <Input
                      placeholder="Description"
                      className="flex-1"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(di, ii, "description", e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Qty"
                      className="w-20"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(di, ii, "quantity", e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      className="w-28"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(di, ii, "unitPrice", e.target.value)
                      }
                    />
                    <span className="text-sm w-24 text-right font-medium">
                      {(Number(item.quantity) * Number(item.unitPrice)).toLocaleString()}
                    </span>
                    {dept.items.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => removeItem(di, ii)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addItem(di)}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Item
                </Button>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={() => setDepartments((p) => [...p, emptyDept()])}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Department
          </Button>

          <div className="text-right text-lg font-bold">
            Total: {currency} {grandTotal.toLocaleString()}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !title.trim()}>
            {saving ? "Creating..." : "Create Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
