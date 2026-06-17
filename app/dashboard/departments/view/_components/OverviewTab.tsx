"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, HandHelping, Users } from "lucide-react";
import { IDepartment } from "@/types/department";

export default function OverviewTab({ dept }: { dept: IDepartment }) {
  const memberCount = (dept.members ?? []).length;
  const assistants = dept.assistantHeads ?? [];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Head of Department</CardTitle>
          <Crown className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          {dept.head ? (
            <>
              <div className="text-base font-semibold">
                {dept.head.firstName} {dept.head.lastName}
              </div>
              <p className="text-xs text-gray-500 mt-1">{dept.head.email}</p>
            </>
          ) : (
            <p className="text-sm text-gray-500">No head assigned</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Assistant Heads</CardTitle>
          <HandHelping className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          {assistants.length === 0 ? (
            <p className="text-sm text-gray-500">No assistants assigned</p>
          ) : (
            <ul className="text-sm space-y-1">
              {assistants.map((a) => (
                <li key={a.id}>
                  {a.firstName} {a.lastName}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Members</CardTitle>
          <Users className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{memberCount}</div>
          <p className="text-xs text-gray-500">
            See the Members tab for the full roster.
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">About this department</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <p>{dept.description || "No description provided."}</p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline">ID: {dept.id.slice(0, 8)}…</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
