"use client";

import { useCurrentUser } from "./use-current-user";
import { PermissionKey } from "@/types/user";

interface DeptPermissionsState {
  loading: boolean;
  permissions: PermissionKey[];
  has: (key: PermissionKey) => boolean;
  /** Did the caller appear in this department's roster at all? */
  isMember: boolean;
}

/**
 * Permission resolver scoped to one department. Reads from the
 * `permissionsByDepartment` map already loaded by `/user/me`, so no extra
 * fetch is needed and the resolution stays consistent with backend checks.
 */
export function useDeptPermissions(deptId: string | null): DeptPermissionsState {
  const { user, status, canInDept } = useCurrentUser();

  if (status === "loading") {
    return { loading: true, permissions: [], has: () => false, isMember: false };
  }

  if (!user || !deptId) {
    return { loading: false, permissions: [], has: () => false, isMember: false };
  }

  const permissions = user.permissionsByDepartment?.[deptId] ?? [];
  const isMember =
    (user.departments ?? []).some((d) => d.id === deptId) ||
    (user.headedDepartments ?? []).some((d) => d.id === deptId) ||
    (user.assistantDepartments ?? []).some((d) => d.id === deptId);

  return {
    loading: false,
    permissions,
    has: (key) => canInDept(deptId, key),
    isMember,
  };
}
