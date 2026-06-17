"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { serviceDayService } from "@/services/serviceDayService";
import {
  IServiceDay,
  IServiceDayVariation,
  ServiceTemplateInput,
  WEEKDAY_LABEL,
} from "@/types/template";
import { TemplateServicesEditor, validateTemplateServices } from "./TemplateServicesEditor";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  day: IServiceDay | null;
  /** Fires after any create/update/delete so the parent can refresh its list. */
  onChanged?: () => void;
}

const blank: ServiceTemplateInput = { order: 1, serviceTime: "", preServiceTime: "", closesAt: "" };

/**
 * Manage variations under a ServiceDay. Variations are alternative service
 * presets (e.g. "Last Sunday" with 1 service when the parent normally runs 2)
 * — picked at session-start time, no date rule, the operator chooses.
 */
export function VariationsDialog({ open, onOpenChange, day, onChanged }: Props) {
  const [items, setItems] = useState<IServiceDayVariation[]>([]);
  const [loading, setLoading] = useState(false);
  const [editor, setEditor] = useState<{
    mode: "create" | "edit";
    id?: string;
    name: string;
    services: ServiceTemplateInput[];
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!day) return;
    setLoading(true);
    try {
      const rows = await serviceDayService.listVariations(day.id);
      setItems(rows ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && day) load();
    if (!open) {
      setEditor(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, day?.id]);

  const startCreate = () =>
    setEditor({ mode: "create", name: "", services: [{ ...blank }] });

  const startEdit = (v: IServiceDayVariation) =>
    setEditor({
      mode: "edit",
      id: v.id,
      name: v.name,
      services: v.services.map((s) => ({
        order: s.order,
        serviceTime: s.serviceTime,
        preServiceTime: s.preServiceTime ?? "",
        closesAt: s.closesAt ?? "",
      })),
    });

  const handleSaveEditor = async () => {
    if (!day || !editor) return;
    setError(null);
    if (!editor.name.trim()) return setError("Name is required.");
    const validationError = validateTemplateServices(editor.services);
    if (validationError) return setError(validationError);

    const payload = {
      name: editor.name.trim(),
      services: editor.services.map((s, i) => ({
        order: i + 1,
        serviceTime: s.serviceTime,
        preServiceTime: s.preServiceTime || null,
        closesAt: s.closesAt || null,
      })),
    };

    setSaving(true);
    try {
      if (editor.mode === "create") {
        await serviceDayService.createVariation(day.id, payload);
      } else if (editor.id) {
        await serviceDayService.updateVariation(day.id, editor.id, payload);
      }
      setEditor(null);
      await load();
      onChanged?.();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (v: IServiceDayVariation) => {
    if (!day) return;
    if (!confirm(`Delete variation "${v.name}"?`)) return;
    await serviceDayService.removeVariation(day.id, v.id);
    await load();
    onChanged?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Variations — {day?.name}
            {day && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({WEEKDAY_LABEL[day.weekday]})
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Existing variations list */}
          {!editor && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Pick a variation at session-start time when the day's services differ from the default.
                </p>
                <Button size="sm" onClick={startCreate}>
                  <Plus className="h-4 w-4 mr-1" /> Add variation
                </Button>
              </div>

              {loading ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              ) : items.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No variations yet. The default services on this day will always be used.
                </p>
              ) : (
                <div className="space-y-2">
                  {items.map((v) => (
                    <div
                      key={v.id}
                      className="border rounded-lg p-3 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="font-medium flex items-center gap-2">
                          {v.name}
                          <Badge variant="outline" className="text-xs">
                            {v.services.length} {v.services.length === 1 ? "service" : "services"}
                          </Badge>
                        </div>
                        <ul className="text-xs text-gray-600 mt-1 space-y-0.5">
                          {v.services.map((s) => (
                            <li key={s.id}>
                              Service {s.order}: {s.serviceTime}
                              {s.preServiceTime ? ` (pre ${s.preServiceTime})` : ""}
                              {s.closesAt ? ` → ${s.closesAt}` : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(v)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDelete(v)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Inline editor */}
          {editor && (
            <div className="space-y-4 border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">
                  {editor.mode === "create" ? "New variation" : "Edit variation"}
                </h4>
                <Button variant="ghost" size="icon" onClick={() => setEditor(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder='e.g. "Last Sunday — single service"'
                  value={editor.name}
                  onChange={(e) => setEditor({ ...editor, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Services for this variation</Label>
                <TemplateServicesEditor
                  services={editor.services}
                  onChange={(next) => setEditor({ ...editor, services: next })}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditor(null)} disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEditor} disabled={saving}>
                  {saving ? "Saving..." : "Save variation"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
