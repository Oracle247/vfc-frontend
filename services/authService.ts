import apiClient from "@/lib/apiClient";
import { handleApiCall } from "@/lib/utils";
import { ApiResponse } from "@/types/api";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";

// 🧩 Auth Service
export const authService = {
    // 🔐 Login
    async login(credentials: LoginPayload): Promise<AuthResponse> {
        const auth = await handleApiCall<AuthResponse>(
            () => apiClient.post<ApiResponse<AuthResponse>>("/auth/login", credentials),
            "Login successful!"
        );

        if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", auth.accessToken);
            if (auth.refreshToken) localStorage.setItem("refreshToken", auth.refreshToken);
        }

        return auth;
    },

    // 📝 Register
    async register(payload: RegisterPayload): Promise<AuthResponse> {
        const auth = await handleApiCall<AuthResponse>(
            () => apiClient.post<ApiResponse<AuthResponse>>("/auth/register", payload),
            "Registration successful!"
        );

        if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", auth.accessToken);
            if (auth.refreshToken) localStorage.setItem("refreshToken", auth.refreshToken);
        }

        return auth;
    },

    // 🚪 Logout
    async logout(): Promise<void> {
        try {
            await handleApiCall(
                () => apiClient.post<ApiResponse<null>>("/auth/logout"),
                "Logged out successfully!"
            );
        } catch {
            console.warn("Logout request failed, clearing tokens anyway");
        } finally {
            if (typeof window !== "undefined") {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
        }
    },

    // ♻️ Refresh Token
    async refreshToken(): Promise<string | null> {
        try {
            const storedRefresh =
                typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
            if (!storedRefresh) return null;

            const data = await handleApiCall<{ accessToken: string }>(() =>
                apiClient.post<ApiResponse<{ accessToken: string }>>("/auth/refresh", {
                    refreshToken: storedRefresh,
                })
            );

            const newToken = data.accessToken;

            if (typeof window !== "undefined") {
                localStorage.setItem("accessToken", newToken);
            }

            return newToken;
        } catch (err) {
            console.error("Token refresh failed:", err);
            return null;
        }
    },
};