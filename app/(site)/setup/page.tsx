"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Church, Loader2 } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api";

interface TokenInfo {
  email: string;
  firstName: string;
  lastName: string;
}

type FetchStatus = "loading" | "valid" | "invalid";

export default function SetupPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;
  const router = useRouter();
  const [info, setInfo] = useState<TokenInfo | null>(null);
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await apiClient.get<ApiResponse<TokenInfo>>(`/auth/setup/${token}`);
        const data = res.data?.data;
        if (data) {
          setInfo(data);
          setStatus("valid");
        } else {
          setStatus("invalid");
          setError("Invalid invite link.");
        }
      } catch (err: unknown) {
        setStatus("invalid");
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Invalid or expired invite link.";
        setError(msg);
      }
    })();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post(`/auth/setup/${token}`, { password });
      setDone(true);
      // Give them a beat to see the success then route to login.
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to set password.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <Church className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Set Your Password</CardTitle>
          {info && (
            <p className="text-sm text-gray-500">
              Welcome {info.firstName}. Set a password to access your account.
            </p>
          )}
        </CardHeader>
        <CardContent>
          {status === "invalid" && (
            <div className="space-y-3">
              <p className="text-sm text-red-600">{error}</p>
              <Button variant="outline" className="w-full" onClick={() => router.push("/login")}>
                Back to login
              </Button>
            </div>
          )}

          {status === "valid" && !done && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={info?.email ?? ""} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw">New Password</Label>
                <Input
                  id="pw"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw2">Confirm Password</Label>
                <Input
                  id="pw2"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Saving..." : "Set Password"}
              </Button>
            </form>
          )}

          {done && (
            <div className="text-center space-y-2">
              <p className="text-sm text-emerald-700 font-medium">Password set!</p>
              <p className="text-xs text-gray-500">Redirecting to login…</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
