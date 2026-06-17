"use client";
import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { userService } from "@/services/userService";
import { IUser } from "@/types/user";
import { authService } from "@/services/authService";
import { attendanceService } from "@/services/attendanceService";
import { IAttendance, IAttendanceSession } from "@/types/attendance";
import { AttendanceTable } from "@/components/Attendance/AttendanceTable";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { EditAttendanceDialog } from "./_components/EditAttendanceDialog";
import { CloseSessionDialog } from "./_components/CloseSessionDialog";
import { FinancePanel } from "./_components/FinancePanel";
import { UpsertIncomePayload } from "@/types/income";
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";

export default function AttendancePage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [attendanceData, setAttendanceData] =
    useState<IAttendanceSession | null>(null);
  const [toggleMarking, setToggleMarking] = useState(false);
  // Optional past-time override for the next mark; empty = "now".
  const [pastMarkAt, setPastMarkAt] = useState("");
  const [editAttendance, setEditAttendance] = useState<IAttendance | null>(null);
  // Service override for the next mark; "" = auto (backend infers from markedAt).
  const [serviceOverride, setServiceOverride] = useState<string>("");
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const isClosed = Boolean(attendanceData?.endedAt);

  const handleSaveIncome = async (payload: UpsertIncomePayload, andClose: boolean) => {
    if (!sessionId) return;
    await attendanceService.upsertSessionIncome(sessionId, payload);
    if (andClose) {
      await attendanceService.closeSession(sessionId);
    }
    setToggleMarking((t) => !t); // triggers refetch
  };

  const handleReopen = async () => {
    if (!sessionId || !confirm("Reopen this session?")) return;
    await attendanceService.reopenSession(sessionId);
    setToggleMarking((t) => !t);
  };

  // Auto-evaluating "current service" given the configured services + clock.
  // Recomputed on every render so the indicator naturally flips once the
  // clock passes a service boundary while the page is open.
  const inferredOrder = (() => {
    const services = attendanceData?.services ?? [];
    if (services.length === 0) return 1;
    const reference = pastMarkAt ? new Date(pastMarkAt) : new Date();
    const sorted = [...services].sort((a, b) => a.order - b.order);
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];
      const boundary = new Date(current.closesAt ?? next.serviceTime);
      if (reference.getTime() < boundary.getTime()) return current.order;
    }
    return sorted[sorted.length - 1].order;
  })();

  // Debounced search function
  const searchUsers = debounce(async (query: string) => {
    if (query.trim() !== "") {
      const matches = await userService.searchUsers(query);
      setSearchResults(matches);
      setShowRegistrationForm(matches.length === 0);
    } else {
      setSearchResults([]);
    }
  }, 500);

  useEffect(() => {
    searchUsers(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (sessionId) {
        const data = await attendanceService.getSessionById(sessionId);
        setAttendanceData({
          ...data,
          startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
          endedAt: data.endedAt ? new Date(data.endedAt) : undefined,
        });
      }
    };

    fetchAttendanceData();
  }, [sessionId, toggleMarking]);

  const handleMarkAttendance = async (userId: string, sessionId: string) => {
    const markedAt = pastMarkAt ? new Date(pastMarkAt).toISOString() : undefined;
    const serviceOrder =
      serviceOverride === "" ? undefined : Number(serviceOverride);
    await attendanceService.markAttendance({ userId, sessionId, markedAt, serviceOrder });

    setSearchQuery("");
    setPastMarkAt("");
    // serviceOverride intentionally not reset — admin may want to mark several
    // people into the same service in a row. Reset on filter clear via the UI.
    setToggleMarking(!toggleMarking);
    setSearchResults([]);
    setShowRegistrationForm(false);
  };

  const handleEditAttendance = async (
    id: string,
    payload: { markedAt: string; serviceOrder?: number },
  ) => {
    await attendanceService.updateAttendance(id, payload);
    setEditAttendance(null);
    setToggleMarking((t) => !t);
  };

  const handleDeleteAttendance = async (a: IAttendance) => {
    if (!confirm("Delete this attendance entry?")) return;
    await attendanceService.deleteAttendance(a.id);
    setToggleMarking((t) => !t);
  };

  const handleRegisterUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userPayload = Object.fromEntries(formData.entries());

    const res = await authService.register(userPayload);
    if (typeof res?.user?.id === "string") {
      handleMarkAttendance(res.user.id, sessionId);
    } else {
      alert("Registration failed.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Attendance Management</h1>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-bold">
            Attendance - {attendanceData?.serviceName} (
            {attendanceData?.startedAt
              ? format(new Date(attendanceData?.startedAt), "dd MMM yyyy, hh:mm a")
              : ""}
            )
          </h2>
          <div className="ml-auto flex items-center gap-2">
            {isClosed && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-amber-50 text-amber-800 border border-amber-200">
                <Lock className="h-3 w-3" /> Closed
              </span>
            )}
            <Button
              size="sm"
              variant={isClosed ? "outline" : "default"}
              onClick={() => setShowCloseDialog(true)}
            >
              {isClosed ? "Edit Income" : "Close Session"}
            </Button>
            {isClosed && (
              <Button size="sm" variant="ghost" onClick={handleReopen}>
                <Unlock className="h-3.5 w-3.5 mr-1" />
                Reopen
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
          <input
            type="text"
            placeholder="Enter member name..."
            className="border p-2 w-full rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input
            type="datetime-local"
            value={pastMarkAt}
            onChange={(e) => setPastMarkAt(e.target.value)}
            title="Mark for a past time (blank = now)"
            className="border p-2 rounded text-sm"
          />
        </div>
        {pastMarkAt && (
          <p className="text-xs text-amber-700">
            The next mark will be recorded at{" "}
            {format(new Date(pastMarkAt), "dd MMM yyyy, hh:mm a")}.
            <button
              type="button"
              onClick={() => setPastMarkAt("")}
              className="ml-2 underline"
            >
              clear
            </button>
          </p>
        )}

        {(attendanceData?.services?.length ?? 0) > 1 && (
          <div className="flex items-center gap-2 text-xs">
            <label className="text-gray-600">Service:</label>
            <select
              value={serviceOverride}
              onChange={(e) => setServiceOverride(e.target.value)}
              className="border rounded px-2 py-1 text-xs"
            >
              <option value="">Auto (Service {inferredOrder})</option>
              {attendanceData?.services?.map((s) => (
                <option key={s.order} value={s.order}>
                  Service {s.order}
                </option>
              ))}
            </select>
            {serviceOverride !== "" && (
              <button
                type="button"
                onClick={() => setServiceOverride("")}
                className="underline text-gray-500"
              >
                reset
              </button>
            )}
          </div>
        )}

        {searchResults.length > 0 && (
          <ul className="bg-white rounded shadow divide-y">
            {searchResults.map((user) => (
              <li key={user.id} className="">
                <button
                  type="button"
                  onClick={() => handleMarkAttendance(user.id!, sessionId)}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between w-full text-left"
                >
                  <span>{user.firstName + " " + user.lastName}</span>
                  <span className="text-sm text-gray-500">
                    {user.churchStatus}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {showRegistrationForm && (
          <form
            onSubmit={handleRegisterUser}
            className="bg-white p-6 rounded shadow space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="border p-2 w-full rounded"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="border p-2 w-full rounded"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border p-2 w-full rounded"
                required
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                className="border p-2 w-full rounded"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="gender"
                className="border p-2 w-full rounded"
                required
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>

              <input
                type="text"
                name="level"
                placeholder="Level"
                className="border p-2 w-full rounded"
              />
            </div>

            <input
              type="text"
              name="address"
              placeholder="Address"
              className="border p-2 w-full rounded"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="faculty"
                placeholder="Faculty"
                className="border p-2 w-full rounded"
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                className="border p-2 w-full rounded"
              />
            </div>

            <select
              name="churchStatus"
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Select Church Status</option>
              <option value="MEMBER">Member</option>
              <option value="VISITOR">Visitor</option>
              <option value="FIRST_TIMER">First Timer</option>
            </select>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Register & Mark Attendance
            </button>
          </form>
        )}

        <FinancePanel services={attendanceData?.services ?? []} />

        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Attendance Records</h2>
          <AttendanceTable
            data={attendanceData?.attendees ?? []}
            serviceCount={attendanceData?.services?.length ?? 1}
            onEdit={(a) => setEditAttendance(a)}
            onDelete={handleDeleteAttendance}
          />
        </div>
      </div>

      <EditAttendanceDialog
        open={!!editAttendance}
        onOpenChange={(open) => !open && setEditAttendance(null)}
        attendance={editAttendance}
        services={attendanceData?.services ?? []}
        onSave={handleEditAttendance}
      />

      <CloseSessionDialog
        open={showCloseDialog}
        onOpenChange={setShowCloseDialog}
        services={attendanceData?.services ?? []}
        isClosed={isClosed}
        onSave={handleSaveIncome}
      />
    </div>
  );
}
