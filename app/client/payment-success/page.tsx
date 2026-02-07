"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, ArrowLeft, Printer, Loader2 } from "lucide-react";
import { useAppContext } from "@/context/appContext";
import { useGetPayments } from "@/hooks/use-payment";
import { PaymentReceipt } from "@/components/PaymentReceipt";
import { useReactToPrint } from "react-to-print";

export default function PaymentSuccessPage() {
  const { shopInfo } = useAppContext();
  const router = useRouter();
  const params = useSearchParams();
  const uid = params.get("uid");
  const manual = params.get("manual");
  const receiptRef = useRef<HTMLDivElement>(null);

  // Fetch payment details using the uid via search
  const { data: payments, isLoading } = useGetPayments(1, 100);
  const payment = payments?.find(p => p.uid === uid);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${payment?.uid || "payment"}`,
  });

  const handleDownload = () => {
    if (!receiptRef.current) return;
    handlePrint();
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full mx-auto text-center">
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-2" />
              Loading Payment Details...
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Status Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold">
                    {manual ? "Payment Request Submitted" : "Payment Successful"}
                  </h1>
                  <p className="text-sm text-muted-foreground font-normal">
                    {manual
                      ? "Your payment request is pending verification"
                      : "Your payment has been processed successfully"}
                  </p>
                </div>
              </div>
              
              {!manual && payment && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Receipt or Status Message */}
        {manual ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                    Manual Verification Required
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                    Your payment request has been received and is pending manual verification by our team. 
                    You will be notified once it's approved.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.replace("/client/orders")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  View My Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : payment ? (
          <Card className="overflow-hidden">
            <PaymentReceipt 
              ref={receiptRef}
              payment={payment}
              shopName={shopInfo?.name}
            />
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you! Your payment was successful and your order is being processed.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.replace("/client/orders")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  View My Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center">
          <Button
            variant="ghost"
            onClick={() => router.replace("/client/orders")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </div>

      {/* Hidden print version */}
      {payment && !manual && (
        <div className="hidden">
          <PaymentReceipt 
            ref={receiptRef}
            payment={payment}
            shopName={shopInfo?.name}
          />
        </div>
      )}
    </div>
  );
}
