"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { BulkImportResult } from "@/types/user";

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (file: File) => Promise<BulkImportResult>;
  title?: string;
  description?: string;
}

export function BulkImportDialog({
  open,
  onOpenChange,
  onImport,
  title = "Bulk Import Members",
  description = "Upload an Excel file (.xlsx) with columns: firstName, lastName, email, phoneNumber, gender, address, churchStatus (optional)",
}: BulkImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    try {
      const res = await onImport(file);
      setResult(res);
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-gray-500">{description}</p>

          <div
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">
              {file ? file.name : "Click to select Excel file"}
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setResult(null);
              }}
            />
          </div>

          {result && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-sm">
              <p className="text-green-600 font-medium">
                Created: {result.created}
              </p>
              {result.skipped.length > 0 && (
                <p className="text-yellow-600">
                  Skipped: {result.skipped.length} ({result.skipped.join(", ")})
                </p>
              )}
              {result.errors.length > 0 && (
                <p className="text-red-600">
                  Errors: {result.errors.length}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {result ? "Close" : "Cancel"}
          </Button>
          {!result && (
            <Button onClick={handleImport} disabled={!file || importing}>
              {importing ? "Importing..." : "Import"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
