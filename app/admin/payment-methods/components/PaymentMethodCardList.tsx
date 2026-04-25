"use client";

import { useState } from "react";
import Image from "next/image";
import { PaymentGateway, PaymentGatewayPlatform } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DeleteDialog from "@/app/admin/components/DeleteDialog";
import ConfirmActionDialog from "@/app/admin/components/ConfirmActionDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useUpdatePaymentGateway,
  useDeletePaymentGateway,
} from "@/hooks/use-paymentGateway";
import {
  CheckCircle2,
  XCircle,
  MoreVertical,
  Trash2,
  Pencil,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "sonner";

const platformLogos: Record<PaymentGatewayPlatform, string> = {
  PAYSTACK: "/images/paystack.png",
  FLUTTERWAVE: "/images/flutterwave.jpeg",
  STRIPE: "/images/paystack.png", // Using paystack as fallback
  MANUAL: "/images/manual-payment.webp",
  CREDIT: "/images/manual-payment.webp",
};

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

interface PaymentMethodCardListProps {
  gateways: PaymentGateway[];
  setGateways: React.Dispatch<React.SetStateAction<PaymentGateway[]>>;
  onEdit: (gateway: PaymentGateway) => void;
}

export function PaymentMethodCardList({
  gateways,
  setGateways,
  onEdit,
}: PaymentMethodCardListProps) {
  return (
    <div className="grid gap-4">
      {gateways.map((gateway) => (
        <PaymentMethodCard
          key={gateway.uid}
          gateway={gateway}
          setGateways={setGateways}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

interface PaymentMethodCardProps {
  gateway: PaymentGateway;
  setGateways: React.Dispatch<React.SetStateAction<PaymentGateway[]>>;
  onEdit: (gateway: PaymentGateway) => void;
}

function PaymentMethodCard({
  gateway,
  setGateways,
  onEdit,
}: PaymentMethodCardProps) {
  const updateMutation = useUpdatePaymentGateway();
  const deleteMutation = useDeletePaymentGateway();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);

  const handleToggleStatus = async () => {
    const newStatus = gateway.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await updateMutation.mutateAsync({
      uid: gateway.uid,
      status: newStatus,
    });
    setGateways((prev) =>
      prev.map((g) => (g.uid === gateway.uid ? { ...g, status: newStatus } : g))
    );
    setShowStatusConfirm(false);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ uid: gateway.uid });
    setGateways((prev) => prev.filter((g) => g.uid !== gateway.uid));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            {/* Platform Logo */}
            <div className="shrink-0">
              <div className="w-16 h-16 rounded-lg border bg-white dark:bg-gray-900 flex items-center justify-center p-2 shadow-sm">
                <Image
                  src={platformLogos[gateway.platform]}
                  alt={`${gateway.platform} logo`}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Gateway Info */}
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold">{gateway.name}</h3>
                <Badge
                  variant={gateway.status === "ACTIVE" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {formatLabel(gateway.status)}
                </Badge>
              </div>

              {gateway.description && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words line-clamp-3">
                  {gateway.description}
                </p>
              )}

              {gateway.content && (
                <p className="text-xs text-muted-foreground/90">
                  HTML content is configured for this gateway.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm">
                {gateway.feePercent !== undefined && gateway.feePercent > 0 && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span className="font-medium">Fee:</span>
                    <span>{gateway.feePercent}%</span>
                  </div>
                )}
                {gateway.min && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span className="font-medium">Min:</span>
                    <span>
                      {Number(gateway.min).toLocaleString()} {gateway.currency || "USD"}
                    </span>
                  </div>
                )}
                {gateway.max && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span className="font-medium">Max:</span>
                    <span>
                      {Number(gateway.max).toLocaleString()} {gateway.currency || "USD"}
                    </span>
                  </div>
                )}
              </div>

              {gateway.webhookUrl && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-md bg-muted/50 px-3 py-2 font-mono text-xs truncate">
                    {showWebhook
                      ? gateway.webhookUrl
                      : "••••••••••••••••••••••••••"}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => setShowWebhook(!showWebhook)}
                  >
                    {showWebhook ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() =>
                      copyToClipboard(gateway.webhookUrl || "", "Webhook URL")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Created {formatDistanceToNow(new Date(gateway.createdAt))} ago
              </p>
            </div>

            {/* Actions Menu */}
            <div className="shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(gateway)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowStatusConfirm(true)}>
                    {gateway.status === "ACTIVE" ? (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      </motion.div>

      <DeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        count={1}
        names={[gateway.name]}
        entityName="payment gateway"
        isDeleting={deleteMutation.isPending}
      />

      <ConfirmActionDialog
        open={showStatusConfirm}
        onOpenChange={setShowStatusConfirm}
        onConfirm={handleToggleStatus}
        title={`${gateway.status === "ACTIVE" ? "Deactivate" : "Activate"} Payment Gateway?`}
        description={`Are you sure you want to ${gateway.status === "ACTIVE" ? "deactivate" : "activate"} ${gateway.name}? ${gateway.status === "ACTIVE" ? "Customers will no longer be able to use this payment method." : "This payment method will become available to customers."}`}
        confirmLabel={gateway.status === "ACTIVE" ? "Deactivate" : "Activate"}
        variant={gateway.status === "ACTIVE" ? "destructive" : "default"}
        isLoading={updateMutation.isPending}
        icon={gateway.status === "ACTIVE" ? XCircle : CheckCircle2}
      />
    </>
  );
}
