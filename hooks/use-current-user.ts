"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { IUser, PermissionKey } from "@/types/user";

type Status = "loading" | "ready" | "anonymous";

interface CurrentUserState {
  user: IUser | null;
  status: Status;
  /** True when the user is a WORKER with workerType === EXECUTIVE. */
  isExco: boolean;
  isAdmin: boolean;
  /** True when the user heads or assists at least one department. */
  isAnyDeptExec: boolean;
  /**
   * Convenience: check a permission scoped to a department. Returns false
   * during `loading`/`anonymous` so call sites don't need a separate guard.
   */
  canInDept: (deptId: string, key: PermissionKey) => boolean;
}

/**
 * Fetches /user/me and caches the result for the rest of the session in a
 * module-level variable so the sidebar + page guards don't fire N requests.
 *
 * The cached promise is dropped (so the next mount refetches) only when the
 * caller has no token — i.e. after a logout.
 */
let cached: Promise<IUser | null> | null = null;

const fetchOnce = (): Promise<IUser | null> => {
  if (cached) return cached;
  cached = (async () => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
      return await userService.getMe();
    } catch {
      return null;
    }
  })();
  return cached;
};

/** Call this from auth-flow callbacks so the next consumer fetches fresh. */
export const resetCurrentUserCache = () => {
  cached = null;
};

const NEVER_CAN = (_deptId: string, _key: PermissionKey) => false;

const empty = (status: Status): CurrentUserState => ({
  user: null,
  status,
  isExco: false,
  isAdmin: false,
  isAnyDeptExec: false,
  canInDept: NEVER_CAN,
});

export function useCurrentUser(): CurrentUserState {
  const [state, setState] = useState<CurrentUserState>(() => empty("loading"));

  useEffect(() => {
    let cancelled = false;
    fetchOnce().then((u) => {
      if (cancelled) return;
      if (!u) {
        setState(empty("anonymous"));
        return;
      }
      const isAdmin = u.role === "ADMIN";
      const isExco =
        u.role === "WORKER" && u.workerType === "EXECUTIVE";
      const isAnyDeptExec =
        (u.headedDepartments?.length ?? 0) > 0 ||
        (u.assistantDepartments?.length ?? 0) > 0;
      const perms = u.permissionsByDepartment ?? {};
      const canInDept = (deptId: string, key: PermissionKey) =>
        (perms[deptId] ?? []).includes(key);

      setState({
        user: u,
        status: "ready",
        isExco,
        isAdmin,
        isAnyDeptExec,
        canInDept,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
