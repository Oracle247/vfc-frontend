"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { attendanceService } from "@/services/attendanceService";
import { StartSessionDialog } from "./_components/SessionDialog";
import AttendanceSessionsTable from "./_components/AttendanceSessionTable";

export default function AttendancePage() {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);

  const handleStartSession = async ({
    date,
    serviceName,
    serviceTime,
  }: {
    date: string;
    serviceName: string;
    serviceTime: string;
  }) => {
    if (!date || !serviceName || !serviceTime) {
      alert("Please fill in all fields before starting the session.");
      return;
    }

    const session = await attendanceService.startSession({
      serviceName,
      startedAt: new Date(`${date}T${serviceTime}`),
    });

    router.push(`attendance/${session.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-gray-500">Record and track church attendance</p>
        </div>
        <Button
          onClick={() => setOpenDialog(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          Start New Session
        </Button>
      </div>

      <AttendanceSessionsTable />

      <StartSessionDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onStartSession={handleStartSession}
      />
    </div>
  );
}
