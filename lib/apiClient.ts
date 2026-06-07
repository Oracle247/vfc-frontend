import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

// Backend always runs on port 3030 on the same host the user is browsing
// from — we reuse the page's hostname so the API URL tracks the laptop's
// current LAN IP without rebuilds. Works for localhost, LAN IP, or any host.
const BACKEND_PORT = 3030;

function resolveApiUrl(): string {
    if (typeof window !== "undefined") {
        return `${window.location.protocol}//${window.location.hostname}:${BACKEND_PORT}/api/v1`;
    }
    // SSR / build-time fallback (no requests fire here anyway in static export)
    return "";
}

const apiClient: AxiosInstance = axios.create({
    baseURL: resolveApiUrl(),
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,
});

// ✅ Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// ✅ Response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Clear invalid tokens and redirect to login
            if (typeof window !== "undefined") {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/admin/login";
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
