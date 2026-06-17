"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Crown, HandHelping, Loader2, User } from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { IDepartmentRef } from "@/types/user";

type Role = "HEAD" | "ASSISTANT" | "MEMBER";

interface Entry {
  dept: IDepartmentRef;
  role: Role;
  positions: string[];
}

const ROLE_BADGE: Record<Role, React.ReactNode> = {
  HEAD: (
    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
      <Crown className="h-3 w-3 mr-1" /> Head
    </Badge>
  ),
  ASSISTANT: (
    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
      <HandHelping className="h-3 w-3 mr-1" /> Assistant
    </Badge>
  ),
  MEMBER: (
    <Badge variant="outline">
      <User className="h-3 w-3 mr-1" /> Worker
    </Badge>
  ),
};

export default function MyDepartmentsPage() {
  const { user, status } = useCurrentUser();

  const entries = useMemo<Entry[]>(() => {
    if (!user) return [];
    const headedIds   = new Set((user.headedDepartments ?? []).map((d) => d.id));
    const assistIds   = new Set((user.assistantDepartments ?? []).map((d) => d.id));
    const memberIds   = (user.departments ?? []);
    const allDepts    = new Map<string, IDepartmentRef>();
    [...(user.headedDepartments ?? []), ...(user.assistantDepartments ?? []), ...memberIds]
      .forEach((d) => allDepts.set(d.id, d));

    const positionsByDept = new Map<string, string[]>();
    for (const dp of user.deptPositions ?? []) {
      const list = positionsByDept.get(dp.departmentId) ?? [];
      list.push(dp.position.name);
      positionsByDept.set(dp.departmentId, list);
    }

    return Array.from(allDepts.values()).map((dept) => {
      const role: Role = headedIds.has(dept.id)
        ? "HEAD"
        : assistIds.has(dept.id)
          ? "ASSISTANT"
          : "MEMBER";
      return { dept, role, positions: positionsByDept.get(dept.id) ?? [] };
    });
  }, [user]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Departments</h1>
        <p className="text-gray-500">
          Every department you belong to. Open one to access tools your role unlocks.
        </p>
      </div>

      {entries.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-gray-500">
            You haven't been assigned to a department yet. Ask an admin to add you.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((e) => (
            <Card key={e.dept.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" /> {e.dept.name}
                  </span>
                  {ROLE_BADGE[e.role]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {e.positions.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {e.positions.map((p) => (
                      <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                    ))}
                  </div>
                )}
                <Link href={`/dashboard/departments/view?id=${e.dept.id}`}>
                  <Button className="w-full gap-2" variant="default">
                    Open Department Dashboard <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
