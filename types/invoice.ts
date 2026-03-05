import { IUser } from "./user";

export type InvoiceStatus = "CREATED" | "APPROVED" | "PARTIALLY_PAID" | "PAID";

export interface IInvoiceItem {
    id?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice?: number;
}

export interface IInvoiceDepartment {
    id?: string;
    invoiceId?: string;
    departmentName: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    items: IInvoiceItem[];
}

export interface IInvoicePayment {
    id: string;
    invoiceId: string;
    amount: number;
    receiptUrl?: string;
    note?: string;
    recordedBy?: IUser;
    paidAt: Date;
    createdAt: Date;
}

export interface IInvoice {
    id: string;
    invoiceNumber: string;
    title: string;
    description?: string;
    currency: string;
    status: InvoiceStatus;
    totalAmount: number;
    createdBy?: IUser;
    markedPaidBy?: IUser;
    approvedBy?: IUser;
    departments: IInvoiceDepartment[];
    payments: IInvoicePayment[];
    receiptUrl?: string;
    paidAt?: Date;
    approvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    paymentSummary?: PaymentSummary;
}

export interface PaymentSummary {
    totalAmount: number;
    totalPaid: number;
    remainingBalance: number;
    paymentProgressPercentage: number;
}

export interface CreateInvoicePayload {
    title: string;
    description?: string;
    currency?: string;
    departments: {
        departmentName: string;
        bankName: string;
        accountName: string;
        accountNumber: string;
        items: {
            description: string;
            quantity: number;
            unitPrice: number;
        }[];
    }[];
}

export interface RecordPaymentPayload {
    amount: number;
    receiptUrl?: string;
    note?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
