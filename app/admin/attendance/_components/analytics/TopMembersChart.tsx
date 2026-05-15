"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { attendanceService } from "@/services/attendanceService";
import { TopMember } from "@/types/attendance";

export default function TopMembersChart() {
  const [data, setData] = useState<TopMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceService
      .getTopMembers({ limit: 10 })
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const chartData = data.map((m) => ({
    name: `${m.firstName} ${m.lastName}`,
    count: m.attendanceCount,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Frequent Members</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : chartData.length === 0 ? (
          <p className="text-sm text-gray-500">No attendance data yet.</p>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" fontSize={12} width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
