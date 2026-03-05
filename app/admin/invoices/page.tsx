"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/datatable";
import { Plus } from "lucide-react";
import { invoiceService } from "@/services/invoiceService";
import { IInvoice, CreateInvoicePayload } from "@/types/invoice";
import { PaginatedData } from "@/types/api";
import { CreateInvoiceDialog } from "./_components/CreateInvoiceDialog";

const statusColors: Record<string, string> = {
  CREATED: "bg-gray-100 text-gray-800",
  APPROVED: "bg-blue-100 text-blue-800",
  PARTIALLY_PAID: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
};

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [showCreate, setShowCreate] = useState(false);

  const fetchInvoices = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const result: PaginatedData<IInvoice> = await invoiceService.getInvoices({ page, limit: 20 });
      setInvoices(result.data);
      setPagination({ page: result.page, totalPages: result.totalPages });
    } catch {
      // handled by handleApiCall
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleCreate = async (data: CreateInvoicePayload) => {
    await invoiceService.createInvoice(data);
    fetchInvoices();
  };

  const columns: ColumnDef<IInvoice>[] = [
    {
      header: "Invoice #",
      accessorKey: "invoiceNumber",
      cell: ({ row }) => (
        <button
          onClick={() => router.push(`/admin/invoices/${row.original.id}`)}
          className="text-blue-600 hover:underline font-medium"
        >
          {row.original.invoiceNumber}
        </button>
      ),
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Amount",
      accessorKey: "totalAmount",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.currency} {row.original.totalAmount?.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={statusColors[row.original.status] || ""}
        >
          {row.original.status.replace("_", " ")}
        </Badge>
      ),
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-gray-500">Manage church invoices and payments</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Invoice
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading invoices...</div>
      ) : (
        <DataTable
          columns={columns}
          data={invoices}
          searchPlaceholder="Search invoices..."
        />
      )}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchInvoices(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchInvoices(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <CreateInvoiceDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onSave={handleCreate}
      />
    </div>
  );
}
