"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { attendanceService } from "@/services/attendanceService";
import { StartSessionDialog } from "./_components/SessionDialog";
import AttendanceSessionsTable from "./_components/AttendanceSessionTable";
import AnalyticsDashboard from "./_components/analytics/AnalyticsDashboard";

export default function AttendancePage() {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("sessions");

  const handleStartSession = async ({
    date,
    serviceName,
    services,
  }: {
    date: string;
    serviceName: string;
    services: Array<{
      order: number;
      serviceTime: string;
      preServiceTime?: string | null;
      closesAt?: string | null;
    }>;
  }) => {
    // startedAt anchors the session on the calendar; use the first service's
    // serviceTime so the date+time stay in sync.
    const startedAt = services[0]?.serviceTime ?? new Date(`${date}T00:00`).toISOString();

    const session = await attendanceService.startSession({
      serviceName,
      date: new Date(`${date}T00:00`).toISOString(),
      startedAt,
      services,
    });

    router.push(`attendance/session?sessionId=${session.id}`);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-gray-500">Record and track church attendance</p>
        </div>
        <div className="flex items-center gap-4">
          <TabsList>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          {activeTab === "sessions" && (
            <Button
              onClick={() => setOpenDialog(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Start New Session
            </Button>
          )}
        </div>
      </div>

      <TabsContent value="sessions">
        <AttendanceSessionsTable />
      </TabsContent>

      <TabsContent value="analytics">
        <AnalyticsDashboard />
      </TabsContent>

      <StartSessionDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onStartSession={handleStartSession}
      />
    </Tabs>
  );
}
