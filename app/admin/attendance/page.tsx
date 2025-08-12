"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

// Dummy person-level attendance data
const personAttendanceData: Record<
  string,
  { name: string; visitType: string }[]
> = {
  "2024-04-14": [
    { name: "John Adewale", visitType: "Member" },
    { name: "Sarah Johnson", visitType: "First-timer" },
    { name: "Michael Okoro", visitType: "Visitor" },
  ],
  "2024-04-07": [
    { name: "Emeka Obi", visitType: "Member" },
    { name: "Grace Udo", visitType: "Member" },
    { name: "David Smith", visitType: "Visitor" },
  ],
};

export default function AttendancePage() {
  const router = useRouter();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [attendance, setAttendance] = useState({
    adults: "",
    children: "",
    youth: "",
    firstTimers: "",
  });
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string | null>(
    null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ date, ...attendance });
  };

  const attendanceHistory = [
    {
      date: "2024-04-14",
      adults: 250,
      children: 120,
      youth: 180,
      firstTimers: 15,
      total: 565,
    },
    {
      date: "2024-04-07",
      adults: 245,
      children: 115,
      youth: 175,
      firstTimers: 12,
      total: 547,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Attendance Management</h1>
        <p className="text-gray-500">Record and track church attendance</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Record Attendance */}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
              <div className="space-y-2">
                <label className="text-lg font-medium">Select Date</label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>

              {/* 🔹 Start Attendance Session Button */}
              <div>
                <Button
                  onClick={() => router.push("/admin/attendance/new")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Start New Attendance Session
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance History</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedHistoryDate ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Adults</TableHead>
                    <TableHead className="text-right">Children</TableHead>
                    <TableHead className="text-right">Youth</TableHead>
                    <TableHead className="text-right">First Timers</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceHistory.map((record) => (
                    <TableRow
                      key={record.date}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedHistoryDate(record.date)}
                    >
                      <TableCell>
                        {format(new Date(record.date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        {record.adults}
                      </TableCell>
                      <TableCell className="text-right">
                        {record.children}
                      </TableCell>
                      <TableCell className="text-right">
                        {record.youth}
                      </TableCell>
                      <TableCell className="text-right">
                        {record.firstTimers}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {record.total}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">
                    Attendance Details —{" "}
                    {format(new Date(selectedHistoryDate), "MMM d, yyyy")}
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedHistoryDate(null)}
                  >
                    Back
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Visit Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {personAttendanceData[selectedHistoryDate]?.map(
                      (person, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{person.name}</TableCell>
                          <TableCell>{person.visitType}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
