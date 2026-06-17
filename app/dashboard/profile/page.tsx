"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Phone, MapPin, Building2, Crown, HandHelping } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function MyProfilePage() {
  const { user, status } = useCurrentUser();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-sm text-gray-500">Sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-500">Your personal information. Contact an admin to update fields.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row label="Name" value={`${user.firstName} ${user.lastName}`.trim()} />
          <Row label="Email" value={user.email} icon={<Mail className="h-4 w-4 text-gray-400" />} />
          <Row label="Phone" value={user.phoneNumber || "—"} icon={<Phone className="h-4 w-4 text-gray-400" />} />
          <Row label="Address" value={user.address || "—"} icon={<MapPin className="h-4 w-4 text-gray-400" />} />
          <Row label="Gender" value={user.gender} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Role & Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {user.role && <Badge variant="outline">{user.role}</Badge>}
            {user.membershipType && (
              <Badge variant="outline">{user.membershipType.replace("_", " ")}</Badge>
            )}
            {user.workerType && <Badge variant="outline">{user.workerType}</Badge>}
            {user.accountStatus && (
              <Badge
                className={
                  user.accountStatus === "ACTIVE"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : user.accountStatus === "SUSPENDED"
                      ? "bg-amber-100 text-amber-800 border-amber-200"
                      : user.accountStatus === "ARCHIVED"
                        ? "bg-red-100 text-red-800 border-red-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                }
              >
                {user.accountStatus}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500" /> Departments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {(user.departments ?? []).length === 0 ? (
            <p className="text-gray-500">Not assigned to any department.</p>
          ) : (
            (user.departments ?? []).map((d) => {
              const isHead = (user.headedDepartments ?? []).some((h) => h.id === d.id);
              const isAssist = (user.assistantDepartments ?? []).some((h) => h.id === d.id);
              return (
                <div key={d.id} className="flex items-center justify-between border-b last:border-0 py-1">
                  <span>{d.name}</span>
                  <div className="flex gap-1">
                    {isHead && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        <Crown className="h-3 w-3 mr-1" /> Head
                      </Badge>
                    )}
                    {isAssist && !isHead && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        <HandHelping className="h-3 w-3 mr-1" /> Assistant
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-gray-500 w-24 shrink-0">{label}</span>
      <span className="text-right flex items-center gap-2">
        {icon}
        {value}
      </span>
    </div>
  );
}
