"use client";
import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { userService } from "@/services/userService";
import { IUser } from "@/types/user";
import { authService } from "@/services/authService";
import { attendanceService } from "@/services/attendanceService";
import { IAttendance, IAttendanceSession } from "@/types/attendance";
import { AttendanceTable } from "@/components/Attendance/AttendanceTable";
import { useParams } from "next/navigation";
import { format } from "date-fns";

export default function AttendancePage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [attendanceData, setAttendanceData] =
    useState<IAttendanceSession | null>(null);
  const [toggleMarking, setToggleMarking] = useState(false);

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
    await attendanceService.markAttendance({ userId, sessionId });

    setSearchQuery("");
    setToggleMarking(!toggleMarking);
    setSearchResults([]);
    setShowRegistrationForm(false);
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
        <h2 className="text-lg font-bold mb-4">
          Attendance - {attendanceData?.serviceName} (
          {attendanceData?.startedAt
            ? format(
                new Date(attendanceData?.startedAt),
                "dd MMM yyyy, hh:mm a"
              )
            : ""}
          )
        </h2>
        <input
          type="text"
          placeholder="Enter member name..."
          className="border p-2 w-full rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

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

        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Attendance Records</h2>
          <AttendanceTable data={attendanceData?.attendees!} />
        </div>
      </div>
    </div>
  );
}
