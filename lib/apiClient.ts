import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030/api/v1", // Backend URL
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false, // if using cookies/sessions
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
            // Example: Try refreshing token
            try {
                const refreshResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                const newToken = (refreshResponse.data as { accessToken: string }).accessToken;
                localStorage.setItem("accessToken", newToken);

                // Retry the failed request
                if (error.config) {
                    error.config.headers.Authorization = `Bearer ${newToken}`;
                    return apiClient.request(error.config);
                }
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                // redirect to login if refresh fails
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
