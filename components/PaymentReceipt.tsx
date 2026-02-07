"use client";

import { forwardRef } from "react";
import { Payment } from "@/types";
import { format } from "date-fns";
import { CheckCircle2, Calendar, CreditCard, Hash, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getCurrencySymbol } from "@/app/_docs/doc";

interface PaymentReceiptProps {
  payment: Payment;
  shopName?: string;
}

export const PaymentReceipt = forwardRef<HTMLDivElement, PaymentReceiptProps>(
  ({ payment, shopName = "Shop" }, ref) => {
    const currencySymbol = getCurrencySymbol(payment.currency);

    return (
      <div ref={ref} className="bg-white text-black p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{shopName}</h1>
          <p className="text-gray-600 text-sm">Payment Receipt</p>
        </div>

        {/* Success Badge */}
        <div className="flex justify-center mb-6">
          <div
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 ${
              payment.status === "SUCCESS"
                ? "bg-green-50 text-green-700 border-green-200"
                : payment.status === "PENDING"
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            <CheckCircle2 className="h-6 w-6" />
            <span className="font-semibold text-lg">
              {payment.status === "SUCCESS"
                ? "Payment Successful"
                : `Payment ${payment.status}`}
            </span>
          </div>
        </div>

        {/* Receipt Number & Date */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              <Hash className="h-4 w-4" />
              <span>Receipt No.</span>
            </div>
            <p className="font-mono font-semibold text-gray-900">
              {payment.uid}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              <Calendar className="h-4 w-4" />
              <span>Date</span>
            </div>
            <p className="font-semibold text-gray-900">
              {format(new Date(payment.createdAt), "PPP 'at' p")}
            </p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </h2>
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold text-gray-900 uppercase">
                {payment.method}
              </span>
            </div>
            <Separator className="bg-gray-200" />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              <Badge
                className={`${
                  payment.status === "SUCCESS"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : payment.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                    : "bg-red-100 text-red-700 border-red-200"
                } hover:bg-opacity-100`}
              >
                {payment.status}
              </Badge>
            </div>
            {payment.orderUid && (
              <>
                <Separator className="bg-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono text-sm text-gray-900">
                    {payment.orderUid}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* User Information */}
        {payment.user && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </h2>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Name</span>
                <span className="font-semibold text-gray-900">
                  {payment.user.fullName || payment.user.username}
                </span>
              </div>
              {payment.user.email && (
                <>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Email</span>
                    <span className="text-sm text-gray-900">
                      {payment.user.email}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Amount Section */}
        <div className="border-t-2 border-gray-200 pt-6 mb-6">
          <div className="bg-gray-900 text-white p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-300 text-sm mb-1">Total Amount Paid</p>
                <p className="text-4xl font-bold">
                  {currencySymbol}
                  {parseFloat(payment.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <CheckCircle2 className="h-16 w-16 text-green-400" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Thank you for your payment!
          </p>
          <p className="text-xs text-gray-500">
            This is a computer-generated receipt and does not require a
            signature.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Generated on {format(new Date(), "PPP 'at' p")}
          </p>
        </div>
      </div>
    );
  }
);

PaymentReceipt.displayName = "PaymentReceipt";
