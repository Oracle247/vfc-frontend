"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, Pencil, Plus, Trash2 } from "lucide-react";
import { serviceDayService } from "@/services/serviceDayService";
import { IServiceDay, WEEKDAY_LABEL } from "@/types/template";
import { ServiceDayDialog } from "./ServiceDayDialog";
import { VariationsDialog } from "./VariationsDialog";

export function ServiceDaysTab() {
  const [days, setDays] = useState<IServiceDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<IServiceDay | null>(null);
  const [variationsTarget, setVariationsTarget] = useState<IServiceDay | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const list = await serviceDayService.list();
      setDays(list);
    } catch {
      // toast handled by handleApiCall
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (payload: Parameters<typeof serviceDayService.create>[0]) => {
    await serviceDayService.create(payload);
    refresh();
  };

  const handleUpdate = async (payload: Parameters<typeof serviceDayService.create>[0]) => {
    if (!editTarget) return;
    await serviceDayService.update(editTarget.id, payload);
    refresh();
  };

  const handleDelete = async (day: IServiceDay) => {
    if (!confirm(`Delete "${day.name}"? Existing sessions stay but will lose this link.`)) return;
    await serviceDayService.remove(day.id);
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Service Days</h2>
          <p className="text-sm text-gray-500">
            Weekly templates used to prefill new sessions (e.g. Sunday Service).
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Service Day
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : days.length === 0 ? (
        <p className="text-sm text-gray-500">No service days yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {days.map((day) => (
            <Card key={day.id}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{day.name}</p>
                    <p className="text-xs text-gray-500">{WEEKDAY_LABEL[day.weekday]}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Manage variations"
                      onClick={() => setVariationsTarget(day)}
                    >
                      <Layers className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditTarget(day)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDelete(day)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  {day.services.map((s) => (
                    <li key={s.id}>
                      Service {s.order}: {s.serviceTime}
                      {s.preServiceTime ? ` (pre ${s.preServiceTime})` : ""}
                      {s.closesAt ? ` → ${s.closesAt}` : ""}
                    </li>
                  ))}
                </ul>
                {(day.variations?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {day.variations!.map((v) => (
                      <Badge key={v.id} variant="outline" className="text-[10px]">
                        {v.name} ({v.services.length})
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ServiceDayDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        initial={null}
        onSave={handleCreate}
      />
      <ServiceDayDialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        initial={editTarget}
        onSave={handleUpdate}
      />

      <VariationsDialog
        open={!!variationsTarget}
        onOpenChange={(open) => !open && setVariationsTarget(null)}
        day={variationsTarget}
        onChanged={refresh}
      />
    </div>
  );
}
