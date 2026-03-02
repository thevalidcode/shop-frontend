"use client";

import { useState } from "react";
import Image from "next/image";
import { ShippingAccount, ShippingPlatform } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ConfirmActionDialog from "@/app/admin/components/ConfirmActionDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useConnectShippingAccount,
  useUpdateShippingAccount,
  useDisconnectShippingAccount,
} from "@/hooks/use-shipping";
import {
  CheckCircle2,
  XCircle,
  MoreVertical,
  Trash2,
  Star,
  StarOff,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/appContext";
import { FeatureGate } from "@/components/FeatureGate";

const platformLogos: Record<ShippingPlatform, string> = {
  SENDBOX: "/images/sendbox.png",
  SHIPPO: "/images/shippo.svg",
};

interface ConnectAccountDialogProps {
  onSuccess?: () => void;
}

export function ConnectAccountDialog({ onSuccess }: ConnectAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<ShippingPlatform>("SENDBOX");
  const [apiKey, setApiKey] = useState("");
  const [testMode, setTestMode] = useState(true);
  const [webhookSecret, setWebhookSecret] = useState("");
  const { shopInfo } = useAppContext();

  const connectMutation = useConnectShippingAccount();
  const isSubscriptionActive = shopInfo?.subscriptionStatus === "ACTIVE";

  const handleConnect = async () => {
    await connectMutation.mutateAsync({
      platform,
      apiKey,
      testMode,
      webhookSecret: webhookSecret || undefined,
    });
    setOpen(false);
    setPlatform("SENDBOX");
    setApiKey("");
    setTestMode(true);
    setWebhookSecret("");
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <FeatureGate
          isAllowed={isSubscriptionActive}
          featureLabel="Shipping Account Connection"
          description="Your subscription must be active to connect shipping accounts. Please renew your subscription to continue."
          variant="tooltip"
        >
          <Button>Connect Shipping Account</Button>
        </FeatureGate>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 max-h-[90vh] p-0 overflow-y-auto">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Connect Shipping Account</DialogTitle>
          <DialogDescription>
            Connect a shipping provider to automatically create and manage
            shipments.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="platform">Platform</Label>
            <Select
              value={platform}
              onValueChange={(value) => setPlatform(value as ShippingPlatform)}
            >
              <SelectTrigger id="platform" className="w-full">
                <SelectValue placeholder="Select platform">
                  {platform && (
                    <div className="flex items-center gap-2">
                      <Image
                        src={platformLogos[platform]}
                        alt={platform}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                      <span>{platform}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SENDBOX">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/sendbox.png"
                      alt="Sendbox"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                    <span>Sendbox</span>
                  </div>
                </SelectItem>
                <SelectItem value="SHIPPO">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/shippo.svg"
                      alt="Shippo"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                    <span>Shippo</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="webhookSecret">Webhook Secret (Optional)</Label>
            <Input
              id="webhookSecret"
              type="password"
              placeholder="Enter webhook secret"
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="testMode">Test Mode</Label>
            <Switch
              id="testMode"
              checked={testMode}
              onCheckedChange={setTestMode}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              disabled={!apiKey || connectMutation.isPending}
            >
              {connectMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ShippingAccountCardProps {
  account: ShippingAccount;
}

export function ShippingAccountCard({ account }: ShippingAccountCardProps) {
  const updateMutation = useUpdateShippingAccount();
  const disconnectMutation = useDisconnectShippingAccount();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [showPreferredConfirm, setShowPreferredConfirm] = useState(false);
  const { shopInfo } = useAppContext();
  const isSubscriptionActive = shopInfo?.subscriptionStatus === "ACTIVE";

  const handleToggleActive = async () => {
    await updateMutation.mutateAsync({
      accountUid: account.uid,
      data: { isActive: !account.isActive },
    });
    setShowStatusConfirm(false);
  };

  const handleTogglePreferred = async () => {
    await updateMutation.mutateAsync({
      accountUid: account.uid,
      data: { isPreferred: !account.isPreferred },
    });
    setShowPreferredConfirm(false);
  };

  const handleDisconnect = async () => {
    await disconnectMutation.mutateAsync(account.uid);
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
                  src={platformLogos[account.platform]}
                  alt={`${account.platform} logo`}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Account Info */}
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold">{account.platform}</h3>
                <Badge
                  variant={account.isActive ? "default" : "secondary"}
                  className="text-xs"
                >
                  {account.isActive ? "Active" : "Inactive"}
                </Badge>
                {account.isPreferred && (
                  <Badge variant="outline" className="text-xs gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Preferred
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {account.connectionTestPassed ? (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Connection verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <XCircle className="h-4 w-4" />
                    <span>Connection failed</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Connected {formatDistanceToNow(new Date(account.createdAt))} ago
              </p>
            </div>

            {/* Actions Menu */}
            <div className="shrink-0">
              <FeatureGate
                isAllowed={isSubscriptionActive}
                featureLabel="Shipping Account Management"
                description="Your subscription must be active to manage shipping accounts. Please renew your subscription to continue."
                variant="tooltip"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowStatusConfirm(true)}>
                      {account.isActive ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowPreferredConfirm(true)}
                    >
                      {account.isPreferred ? (
                        <>
                          <StarOff className="h-4 w-4 mr-2" />
                          Remove as Preferred
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4 mr-2" />
                          Set as Preferred
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FeatureGate>
            </div>
          </div>
        </Card>
      </motion.div>

      <ConfirmActionDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDisconnect}
        title="Disconnect Shipping Account?"
        description={`Are you sure you want to disconnect this ${account.platform} account? This action cannot be undone and all shipment integrations will be disabled.`}
        confirmLabel="Disconnect"
        variant="destructive"
        isLoading={disconnectMutation.isPending}
        icon={Trash2}
      />

      <ConfirmActionDialog
        open={showStatusConfirm}
        onOpenChange={setShowStatusConfirm}
        onConfirm={handleToggleActive}
        title={`${account.isActive ? "Deactivate" : "Activate"} Shipping Account?`}
        description={`Are you sure you want to ${account.isActive ? "deactivate" : "activate"} this ${account.platform} account? ${account.isActive ? "You will no longer be able to create shipments with this account." : "This account will become available for creating shipments."}`}
        confirmLabel={account.isActive ? "Deactivate" : "Activate"}
        variant={account.isActive ? "destructive" : "default"}
        isLoading={updateMutation.isPending}
        icon={account.isActive ? XCircle : CheckCircle2}
      />

      <ConfirmActionDialog
        open={showPreferredConfirm}
        onOpenChange={setShowPreferredConfirm}
        onConfirm={handleTogglePreferred}
        title={`${account.isPreferred ? "Remove" : "Set"} as Preferred Account?`}
        description={`Are you sure you want to ${account.isPreferred ? "remove this as the preferred" : "set this as the preferred"} ${account.platform} account? ${!account.isPreferred ? "This will be used by default when creating shipments." : ""}`}
        confirmLabel={account.isPreferred ? "Remove" : "Set as Preferred"}
        variant="default"
        isLoading={updateMutation.isPending}
        icon={account.isPreferred ? StarOff : Star}
      />
    </>
  );
}
