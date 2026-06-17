"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { IUser } from "@/types/user";

type Status = "loading" | "ready" | "anonymous";

interface CurrentUserState {
  user: IUser | null;
  status: Status;
  /** True when the user is a WORKER with workerType === EXECUTIVE. */
  isExco: boolean;
  isAdmin: boolean;
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

export function useCurrentUser(): CurrentUserState {
  const [state, setState] = useState<CurrentUserState>({
    user: null,
    status: "loading",
    isExco: false,
    isAdmin: false,
  });

  useEffect(() => {
    let cancelled = false;
    fetchOnce().then((u) => {
      if (cancelled) return;
      if (!u) {
        setState({ user: null, status: "anonymous", isExco: false, isAdmin: false });
        return;
      }
      const isAdmin = u.role === "ADMIN";
      const isExco =
        u.role === "WORKER" && u.workerType === "EXECUTIVE";
      setState({ user: u, status: "ready", isExco, isAdmin });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
