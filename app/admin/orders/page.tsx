"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Order } from "@/types/models/order";
import { AdminOrderCard } from "./components/AdminOrderCard";
import { AdminOrderDetailClient } from "./components/AdminOrderDetailClient";
import {
  useGetAdminOrders,
  useDeleteOrder,
  useVerifyPayment,
  useBulkUpdateOrders,
} from "@/hooks/use-order";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Package,
  Loader2,
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Download,
} from "lucide-react";
import DeleteDialog from "../components/DeleteDialog";
import Wrapper from "@/components/wrapper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminOrderPage() {
  const { data: orders, isLoading } = useGetAdminOrders();
  const deleteOrder = useDeleteOrder();
  const verifyPayment = useVerifyPayment();
  const searchParams = useSearchParams();
  const orderUid = searchParams.get("uid");

  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
  const [verifyingOrder, setVerifyingOrder] = useState<{
    order: Order;
    verified: boolean;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders?.filter((order) => {
      const matchesSearch =
        order.orderRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item) =>
          item.product.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesPayment =
        paymentFilter === "all" || order.payment.status === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  // Stats
  const stats = useMemo(() => {
    if (!orders) return null;

    const total = orders.length;
    const pending = orders.filter((o) => o.status === "PENDING").length;
    const processing = orders.filter((o) => o.status === "PROCESSING").length;
    const shipped = orders.filter((o) => o.status === "SHIPPED").length;
    const delivered = orders.filter((o) => o.status === "DELIVERED").length;
    const verifying = orders.filter(
      (o) => o.status === "VERIFYING_PAYMENT",
    ).length;

    const totalRevenue = orders
      .filter((o) => o.payment.status === "SUCCESS")
      .reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);

    return {
      total,
      pending,
      processing,
      shipped,
      delivered,
      verifying,
      totalRevenue,
    };
  }, [orders]);

  // If uid query param exists, show order detail view
  if (orderUid) {
    return <AdminOrderDetailClient orderUid={orderUid} />;
  }

  const handleDelete = async () => {
    if (!deletingOrder) return;
    await deleteOrder.mutateAsync(deletingOrder.uid);
    setDeletingOrder(null);
  };

  const handleVerifyPayment = async (order: Order, verified: boolean) => {
    setVerifyingOrder({ order, verified });
  };

  const confirmVerifyPayment = async () => {
    if (!verifyingOrder) return;
    await verifyPayment.mutateAsync({
      orderUid: verifyingOrder.order.uid,
      verified: verifyingOrder.verified,
    });
    setVerifyingOrder(null);
  };

  const toggleSelectAll = () => {
    if (selectedOrders.size === filteredOrders?.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders?.map((o) => o.uid) || []));
    }
  };

  const toggleSelect = (uid: string) => {
    const newSet = new Set(selectedOrders);
    if (newSet.has(uid)) {
      newSet.delete(uid);
    } else {
      newSet.add(uid);
    }
    setSelectedOrders(newSet);
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <Package className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
      <p className="text-muted-foreground text-center max-w-md">{message}</p>
    </div>
  );

  return (
    <Wrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="text-muted-foreground">
          Manage and track all customer orders
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.processing}</p>
                <p className="text-xs text-muted-foreground">Processing</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.shipped}</p>
                <p className="text-xs text-muted-foreground">Shipped</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.delivered}</p>
                <p className="text-xs text-muted-foreground">Delivered</p>
              </div>
            </div>
          </Card>

          {stats.verifying > 0 && (
            <Card className="p-4 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                    {stats.verifying}
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Need Verification
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Filters & Search */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by order #, customer, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="VERIFYING_PAYMENT">
                Verifying Payment
              </SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELED">Canceled</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.size > 0 && (
          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between">
            <p className="text-sm font-medium">
              {selectedOrders.size} order{selectedOrders.size > 1 ? "s" : ""}{" "}
              selected
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedOrders(new Set())}
              >
                Clear Selection
              </Button>
              <Button size="sm" variant="secondary">
                <Download className="w-3 h-3 mr-2" />
                Export Selected
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredOrders && filteredOrders.length > 0 ? (
        <>
          {filteredOrders.length > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredOrders.length} order
                {filteredOrders.length > 1 ? "s" : ""}
              </p>
              <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                {selectedOrders.size === filteredOrders.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <AdminOrderCard
                key={order.uid}
                order={order}
                onDelete={setDeletingOrder}
                onVerifyPayment={handleVerifyPayment}
                selected={selectedOrders.has(order.uid)}
                onSelect={(selected) => toggleSelect(order.uid)}
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          message={
            searchQuery || statusFilter !== "all" || paymentFilter !== "all"
              ? "No orders match your search criteria. Try adjusting your filters."
              : "No orders have been placed yet. Orders will appear here once customers start purchasing."
          }
        />
      )}

      {/* Dialogs */}
      <DeleteDialog
        open={!!deletingOrder}
        onOpenChange={(open: boolean) => !open && setDeletingOrder(null)}
        onConfirm={handleDelete}
        count={1}
        names={deletingOrder ? [`Order #${deletingOrder.orderRef}`] : []}
        entityName="order"
      />

      <AlertDialog
        open={!!verifyingOrder}
        onOpenChange={(open) => !open && setVerifyingOrder(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {verifyingOrder?.verified ? "Verify Payment" : "Reject Payment"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {verifyingOrder?.verified
                ? `Are you sure you want to verify the payment for order #${verifyingOrder.order.orderRef}? The order will proceed to processing.`
                : `Are you sure you want to reject the payment for order #${verifyingOrder?.order.orderRef}? The order will be canceled.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmVerifyPayment}
              className={
                verifyingOrder?.verified
                  ? ""
                  : "bg-destructive hover:bg-destructive/90"
              }
            >
              {verifyingOrder?.verified ? "Verify Payment" : "Reject Payment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Wrapper>
  );
}
