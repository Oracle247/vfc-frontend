"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { specialProgramService } from "@/services/specialProgramService";
import { ISpecialProgram } from "@/types/template";
import { SpecialProgramDialog } from "./SpecialProgramDialog";

const formatDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Anytime";

export function SpecialProgramsTab() {
  const [programs, setPrograms] = useState<ISpecialProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<ISpecialProgram | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const list = await specialProgramService.list();
      setPrograms(list);
    } catch {
      // toast handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (payload: Parameters<typeof specialProgramService.create>[0]) => {
    await specialProgramService.create(payload);
    refresh();
  };

  const handleUpdate = async (payload: Parameters<typeof specialProgramService.create>[0]) => {
    if (!editTarget) return;
    await specialProgramService.update(editTarget.id, payload);
    refresh();
  };

  const handleDelete = async (p: ISpecialProgram) => {
    if (!confirm(`Delete "${p.name}"? Existing sessions stay but will lose this link.`)) return;
    await specialProgramService.remove(p.id);
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Special Programs</h2>
          <p className="text-sm text-gray-500">
            One-off named events with their own service times (e.g. Easter Service).
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Special Program
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : programs.length === 0 ? (
        <p className="text-sm text-gray-500">No special programs yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <Card key={p.id}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(p.date)}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditTarget(p)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDelete(p)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  {p.services.map((s) => (
                    <li key={s.id}>
                      Service {s.order}: {s.serviceTime}
                      {s.preServiceTime ? ` (pre ${s.preServiceTime})` : ""}
                      {s.closesAt ? ` → ${s.closesAt}` : ""}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SpecialProgramDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        initial={null}
        onSave={handleCreate}
      />
      <SpecialProgramDialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        initial={editTarget}
        onSave={handleUpdate}
      />
    </div>
  );
}
