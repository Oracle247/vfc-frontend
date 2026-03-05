import { toast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function handleApiCall<T>(
  apiCall: () => Promise<{ data: ApiResponse<T> }>,
  successMessage?: string
): Promise<T> {
  try {
    const { data } = await apiCall();

    if (!data.data) throw new Error(data.message || "Unexpected server response");

    // ✅ Show success toast if message provided
    if (successMessage) {
      toast({
        title: "Success",
        description: successMessage,
        variant: "default",
      });
    }

    return data.data;
  } catch (error: any) {
    console.error("API call error:", error);

    const errMessage =
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred. Please try again.";

    toast({
      title: "Error",
      description: errMessage,
      variant: "destructive",
    });

    throw new Error(errMessage);
  }
}