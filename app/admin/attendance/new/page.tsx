"use client";
import { useState, useEffect } from "react";
import { debounce } from "lodash";

interface User {
  _id: string;
  fullName: string;
  status: string; // "member", "visitor", "first-timer"
}

const dummyUsers = [
  { id: 1, fullName: "John Adewale", visitType: "member" },
  { id: 2, fullName: "Sarah Johnson", visitType: "first-timer" },
  { id: 3, fullName: "Michael Okoro", visitType: "visiting" },
  { id: 4, fullName: "Emeka Obi", visitType: "member" },
  { id: 5, fullName: "Grace Udo", visitType: "member" },
  { id: 6, fullName: "David Smith", visitType: "visiting" },
  { id: 7, fullName: "Faith Adeyemi", visitType: "member" },
  { id: 8, fullName: "Olumide George", visitType: "first-timer" },
  { id: 9, fullName: "Anita Benson", visitType: "member" },
  { id: 10, fullName: "Samuel Peters", visitType: "visiting" },
  { id: 11, fullName: "Ijeoma Nwankwo", visitType: "member" },
  { id: 12, fullName: "Paul Wilson", visitType: "member" },
  { id: 13, fullName: "Blessing Musa", visitType: "first-timer" },
  { id: 14, fullName: "Victor Chukwu", visitType: "visiting" },
  { id: 15, fullName: "Evelyn Okafor", visitType: "member" },
  { id: 16, fullName: "Henry James", visitType: "first-timer" },
  { id: 17, fullName: "Chinonso Eze", visitType: "member" },
  { id: 18, fullName: "Rosemary Patrick", visitType: "member" },
  { id: 19, fullName: "Tolu Ogun", visitType: "visiting" },
  { id: 20, fullName: "Abigail Akpan", visitType: "first-timer" },
];

export default function AttendancePage() {
  const [sessionActive, setSessionActive] = useState(false);
  const [date, setDate] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [serviceTime, setServiceTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  // Debounced search function
  const searchUsers = debounce(async (query: string) => {
    if (query.trim() !== "") {
      const matches = dummyUsers
        .filter((u) => u.fullName.toLowerCase().includes(query.toLowerCase()))
        .map((u) => ({
          _id: u.id.toString(),
          fullName: u.fullName,
          status: u.visitType === "visiting" ? "visitor" : u.visitType,
        }));
      setSearchResults(matches);
      setShowRegistrationForm(matches.length === 0);
    } else {
      setSearchResults([]);
    }
  }, 500);

  useEffect(() => {
    searchUsers(searchQuery);
  }, [searchQuery]);

  const handleStartSession = () => {
    if (!date || !serviceName || !serviceTime) {
      alert("Please fill in all fields before starting the session.");
      return;
    }
    setSessionActive(true);
  };

  const handleMarkAttendance = async (userId: string) => {
    const res = await fetch(`/api/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, date, serviceName, serviceTime }),
    });
    if (res.ok) {
      alert("Attendance recorded successfully!");
      setSearchQuery("");
      setSearchResults([]);
      setShowRegistrationForm(false);
    } else {
      alert("Failed to mark attendance.");
    }
  };

  const handleRegisterUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch(`/api/users`, {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const newUser: User = await res.json();
      handleMarkAttendance(newUser._id);
    } else {
      alert("Registration failed.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Attendance Management</h1>

      {!sessionActive ? (
        <div className="space-y-4 bg-white p-4 rounded-lg shadow">
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
          <button
            onClick={handleStartSession}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Start Attendance Session
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-bold mb-4">
            Attendance - {serviceName} ({date} @ {serviceTime})
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
                <li
                  key={user._id}
                  onClick={() => handleMarkAttendance(user._id)}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between"
                >
                  <span>{user.fullName}</span>
                  <span className="text-sm text-gray-500">{user.status}</span>
                </li>
              ))}
            </ul>
          )}

          {showRegistrationForm && (
            <form
              onSubmit={handleRegisterUser}
              className="bg-white p-4 rounded shadow space-y-3"
            >
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="border p-2 w-full rounded"
                required
              />
              <select
                name="status"
                className="border p-2 w-full rounded"
                required
              >
                <option value="">Select Status</option>
                <option value="member">Member</option>
                <option value="visitor">Visitor</option>
                <option value="first-timer">First Timer</option>
              </select>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Register & Mark Attendance
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
