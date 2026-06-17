"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Church, Loader2 } from "lucide-react";
import { settingsService } from "@/services/settingsService";
import { IChurchSettings } from "@/types/settings";

interface FormState {
  name: string;
  logoUrl: string;
  address: string;
}

const emptyForm: FormState = { name: "", logoUrl: "", address: "" };

const isValidHttpUrl = (s: string) => {
  if (!s) return true;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

export function ChurchInfoTab() {
  const [settings, setSettings] = useState<IChurchSettings | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsService
      .getChurchSettings()
      .then((s) => {
        setSettings(s);
        setForm({
          name: s.name,
          logoUrl: s.logoUrl ?? "",
          address: s.address ?? "",
        });
      })
      .catch(() => {
        // error toast handled by handleApiCall
      })
      .finally(() => setLoading(false));
  }, []);

  const logoValid = isValidHttpUrl(form.logoUrl);
  const dirty =
    !!settings &&
    (form.name !== settings.name ||
      (form.logoUrl || "") !== (settings.logoUrl ?? "") ||
      (form.address || "") !== (settings.address ?? ""));

  const handleSave = async () => {
    if (!form.name.trim() || !logoValid) return;
    setSaving(true);
    try {
      const updated = await settingsService.updateChurchSettings({
        name: form.name.trim(),
        logoUrl: form.logoUrl.trim() ? form.logoUrl.trim() : null,
        address: form.address.trim() ? form.address.trim() : null,
      });
      setSettings(updated);
      setForm({
        name: updated.name,
        logoUrl: updated.logoUrl ?? "",
        address: updated.address ?? "",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!settings) return;
    setForm({
      name: settings.name,
      logoUrl: settings.logoUrl ?? "",
      address: settings.address ?? "",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 py-12">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading settings...
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Church Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="church-name">
            Church Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="church-name"
            placeholder="e.g. Vision Faith Church"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <p className="text-xs text-gray-500">Used in the PDF report header.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="church-logo">Logo URL</Label>
          <Input
            id="church-logo"
            placeholder="https://example.com/logo.png"
            value={form.logoUrl}
            onChange={(e) =>
              setForm((f) => ({ ...f, logoUrl: e.target.value }))
            }
          />
          {!logoValid && (
            <p className="text-xs text-red-600">
              Enter a valid http(s) URL or leave blank.
            </p>
          )}
          <div className="mt-2">
            {form.logoUrl && logoValid ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.logoUrl}
                alt="Church logo preview"
                className="h-20 w-20 rounded-md border object-cover bg-gray-50"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-gray-50 text-gray-400">
                <Church className="h-6 w-6" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="church-address">Address</Label>
          <Textarea
            id="church-address"
            placeholder="Street, City, Country"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-gray-400">
            {settings &&
              `Last updated: ${new Date(settings.updatedAt).toLocaleString()}`}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!dirty || saving}
            >
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={!dirty || saving || !form.name.trim() || !logoValid}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
