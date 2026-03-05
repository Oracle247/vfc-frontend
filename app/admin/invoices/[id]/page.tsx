"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Trash2,
  DollarSign,
} from "lucide-react";
import { invoiceService } from "@/services/invoiceService";
import { IInvoice } from "@/types/invoice";
import { RecordPaymentDialog } from "../_components/RecordPaymentDialog";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  CREATED: "bg-gray-100 text-gray-800",
  APPROVED: "bg-blue-100 text-blue-800",
  PARTIALLY_PAID: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  const fetchInvoice = useCallback(async () => {
    setLoading(true);
    try {
      const data = await invoiceService.getInvoiceById(invoiceId);
      setInvoice(data);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  const handleApprove = async () => {
    if (!confirm("Approve this invoice?")) return;
    await invoiceService.approveInvoice(invoiceId);
    fetchInvoice();
  };

  const handleMarkPaid = async () => {
    if (!confirm("Mark this invoice as fully paid?")) return;
    await invoiceService.markAsPaid(invoiceId);
    fetchInvoice();
  };

  const handleRecordPayment = async (data: { amount: number; note?: string }) => {
    await invoiceService.recordPayment(invoiceId, data);
    fetchInvoice();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this invoice? This cannot be undone.")) return;
    await invoiceService.deleteInvoice(invoiceId);
    router.push("/admin/invoices");
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading invoice...</div>;
  }

  if (!invoice) {
    return <div className="text-center py-12 text-gray-500">Invoice not found</div>;
  }

  const summary = invoice.paymentSummary;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{invoice.title}</h1>
          <p className="text-gray-500">{invoice.invoiceNumber}</p>
        </div>
        <Badge
          variant="outline"
          className={`text-sm ${statusColors[invoice.status]}`}
        >
          {invoice.status.replace("_", " ")}
        </Badge>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-xl font-bold">
                {invoice.currency} {summary.totalAmount.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">Total Paid</p>
              <p className="text-xl font-bold text-green-600">
                {invoice.currency} {summary.totalPaid.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">Remaining</p>
              <p className="text-xl font-bold text-red-600">
                {invoice.currency} {summary.remainingBalance.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">Progress</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${summary.paymentProgressPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {summary.paymentProgressPercentage}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {invoice.status === "CREATED" && (
          <>
            <Button onClick={handleApprove}>
              <CheckCircle className="h-4 w-4 mr-2" /> Approve
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </>
        )}
        {(invoice.status === "APPROVED" || invoice.status === "PARTIALLY_PAID") && (
          <>
            <Button onClick={() => setShowPayment(true)}>
              <CreditCard className="h-4 w-4 mr-2" /> Record Payment
            </Button>
            <Button variant="outline" onClick={handleMarkPaid}>
              <DollarSign className="h-4 w-4 mr-2" /> Mark as Paid
            </Button>
          </>
        )}
      </div>

      {/* Departments & Items */}
      {invoice.departments?.map((dept) => (
        <Card key={dept.id}>
          <CardHeader>
            <CardTitle className="text-base">{dept.departmentName}</CardTitle>
            <p className="text-sm text-gray-500">
              {dept.bankName} - {dept.accountName} ({dept.accountNumber})
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dept.items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {item.unitPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.totalPrice?.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {/* Payment History */}
      {invoice.payments && invoice.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Recorded By</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {format(new Date(payment.paidAt), "dd MMM yyyy, hh:mm a")}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {invoice.currency} {payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {payment.recordedBy
                        ? `${payment.recordedBy.firstName} ${payment.recordedBy.lastName}`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {payment.note || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Description */}
      {invoice.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{invoice.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Record Payment Dialog */}
      <RecordPaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        remainingBalance={summary?.remainingBalance || 0}
        currency={invoice.currency}
        onSave={handleRecordPayment}
      />
    </div>
  );
}
