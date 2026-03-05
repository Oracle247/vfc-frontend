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

interface StartSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartSession: (data: {
    date: string;
    serviceName: string;
    serviceTime: string;
  }) => void;
}

export function StartSessionDialog({
  open,
  onOpenChange,
  onStartSession,
}: StartSessionDialogProps) {
  const [date, setDate] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [serviceTime, setServiceTime] = useState("");

  const handleSubmit = () => {
    if (!date || !serviceName || !serviceTime) return;
    onStartSession({ date, serviceName, serviceTime });
    setDate("");
    setServiceName("");
    setServiceTime("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start Attendance Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="Service Name"
            className="border p-2 w-full rounded"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
          <input
            type="time"
            className="border p-2 w-full rounded"
            value={serviceTime}
            onChange={(e) => setServiceTime(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Start Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
