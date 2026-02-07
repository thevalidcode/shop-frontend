"use client";

import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Download, ArrowLeft, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetPayments } from "@/hooks/use-payment";
import { PaymentReceipt } from "@/components/PaymentReceipt";
import { useAppContext } from "@/context/appContext";
import { useReactToPrint } from "react-to-print";

export default function PaymentCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const uid = params.get("uid");
  const receiptRef = useRef<HTMLDivElement>(null);
  const { shopInfo } = useAppContext();

  // Fetch payment details using the uid via search
  const { data: payments, isLoading } = useGetPayments(1, 100);
  const payment = payments?.find(p => p.uid === uid);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${payment?.uid || "payment"}`,
  });

  const handleDownload = () => {
    if (!receiptRef.current) return;

    // Use print dialog for PDF download
    handlePrint();
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full mx-auto text-center">
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-2" />
              Verifying Payment...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please wait while we verify your payment
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full mx-auto text-center">
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2">
              <XCircle className="h-12 w-12 text-destructive mb-2" />
              Payment Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn't find the payment details. Please check your order history.
            </p>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => router.replace("/client/orders")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to My Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSuccess = payment.status === "SUCCESS";
  const isFailed = payment.status === "FAILED";

  return (
    <div className="min-h-screen bg-muted/10 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Status Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                    <div>
                      <h1 className="text-2xl font-bold">Payment Successful</h1>
                      <p className="text-sm text-muted-foreground font-normal">
                        Your payment has been processed successfully
                      </p>
                    </div>
                  </>
                ) : isFailed ? (
                  <>
                    <XCircle className="h-10 w-10 text-destructive" />
                    <div>
                      <h1 className="text-2xl font-bold">Payment Failed</h1>
                      <p className="text-sm text-muted-foreground font-normal">
                        There was an issue processing your payment
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Loader2 className="h-10 w-10 animate-spin text-yellow-600" />
                    <div>
                      <h1 className="text-2xl font-bold">Payment Pending</h1>
                      <p className="text-sm text-muted-foreground font-normal">
                        Your payment is being processed
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              {isSuccess && (
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

        {/* Receipt */}
        {isSuccess ? (
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
                <p className="text-muted-foreground mb-6">
                  {isFailed 
                    ? "Please try again or contact support if the issue persists."
                    : "Your payment is being verified. You will receive a confirmation shortly."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => router.replace("/client/orders")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    View Orders
                  </Button>
                  {isFailed && (
                    <Button onClick={() => router.replace("/client/checkout")}>
                      Try Again
                    </Button>
                  )}
                </div>
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
      <div className="hidden">
        <PaymentReceipt 
          ref={receiptRef}
          payment={payment}
          shopName={shopInfo?.name}
        />
      </div>
    </div>
  );
}
