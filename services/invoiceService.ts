import apiClient from "@/lib/apiClient";
import { ApiResponse, PaginatedData } from "@/types/api";
import { handleApiCall } from "@/lib/utils";
import {
    CreateInvoicePayload,
    IInvoice,
    IInvoicePayment,
    PaymentSummary,
    RecordPaymentPayload,
} from "@/types/invoice";

export const invoiceService = {
    createInvoice: (payload: CreateInvoicePayload) =>
        handleApiCall<IInvoice>(
            () => apiClient.post<ApiResponse<IInvoice>>("/invoices", payload),
            "Invoice created successfully!"
        ),

    getInvoices: (params?: { page?: number; limit?: number }) =>
        handleApiCall<PaginatedData<IInvoice>>(
            () => apiClient.get<ApiResponse<PaginatedData<IInvoice>>>("/invoices", { params })
        ),

    getInvoiceById: (id: string) =>
        handleApiCall<IInvoice>(
            () => apiClient.get<ApiResponse<IInvoice>>(`/invoices/${id}`)
        ),

    approveInvoice: (id: string) =>
        handleApiCall<IInvoice>(
            () => apiClient.patch<ApiResponse<IInvoice>>(`/invoices/${id}/approve`),
            "Invoice approved successfully!"
        ),

    recordPayment: (id: string, payload: RecordPaymentPayload) =>
        handleApiCall<IInvoicePayment>(
            () => apiClient.post<ApiResponse<IInvoicePayment>>(`/invoices/${id}/payments`, payload),
            "Payment recorded successfully!"
        ),

    getPayments: (id: string) =>
        handleApiCall<{ payments: IInvoicePayment[]; summary: PaymentSummary }>(
            () => apiClient.get<ApiResponse<{ payments: IInvoicePayment[]; summary: PaymentSummary }>>(`/invoices/${id}/payments`)
        ),

    markAsPaid: (id: string) =>
        handleApiCall<IInvoicePayment>(
            () => apiClient.patch<ApiResponse<IInvoicePayment>>(`/invoices/${id}/mark-paid`),
            "Invoice marked as paid!"
        ),

    updateInvoice: (id: string, data: Partial<{ title: string; description: string }>) =>
        handleApiCall<IInvoice>(
            () => apiClient.put<ApiResponse<IInvoice>>(`/invoices/${id}`, data),
            "Invoice updated successfully!"
        ),

    deleteInvoice: (id: string) =>
        handleApiCall<IInvoice>(
            () => apiClient.delete<ApiResponse<IInvoice>>(`/invoices/${id}`),
            "Invoice deleted successfully!"
        ),
};
