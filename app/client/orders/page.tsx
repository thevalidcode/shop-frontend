"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { OrderCard } from "./components/OrderCard";
import { useGetUserOrders } from "@/hooks/use-order";
import { Input } from "@/components/ui/input";
import { Search, Package, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Wrapper from "@/components/wrapper";
import { PageContent } from "@/app/(root)/components/page-content";
import { OrderDetailClient } from "./components/OrderDetailClient";

export default function OrdersPage() {
  const { data: orders, isLoading } = useGetUserOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const orderUid = searchParams.get("uid");

  // If uid query param exists, show order detail view
  if (orderUid) {
    return <OrderDetailClient orderUid={orderUid} />;
  }

  // Filter orders by search
  const filteredOrders = orders?.filter(
    (order) =>
      order.orderRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  // Count by status
  const statusCounts = {
    all: filteredOrders?.length || 0,
    pending: filteredOrders?.filter((o) => o.status === "PENDING").length || 0,
    processing:
      filteredOrders?.filter((o) => o.status === "PROCESSING").length || 0,
    shipped: filteredOrders?.filter((o) => o.status === "SHIPPED").length || 0,
    delivered:
      filteredOrders?.filter((o) => o.status === "DELIVERED").length || 0,
    canceled:
      filteredOrders?.filter((o) => o.status === "CANCELED").length || 0,
    verifying:
      filteredOrders?.filter((o) => o.status === "VERIFYING_PAYMENT").length ||
      0,
    failed:
      filteredOrders?.filter((o) => o.status === "FAILED_DELIVERY").length || 0,
    transit:
      filteredOrders?.filter((o) => o.status === "IN_TRANSIT").length || 0,
  };

  const EmptyState = ({ status }: { status?: string }) => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <Package className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
      <p className="text-muted-foreground text-center max-w-md">
        {status
          ? `You don't have any ${status.toLowerCase()} orders yet.`
          : "You haven't placed any orders yet. Start shopping to see your orders here!"}
      </p>
    </div>
  );

  return (
    <Wrapper className="py-6">
      <PageContent pageType="ORDERS" />

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order number or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto gap-2 bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All
            {statusCounts.all > 0 && (
              <Badge variant="secondary" className="ml-2">
                {statusCounts.all}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {statusCounts.pending > 0 && (
              <Badge variant="secondary" className="ml-2">
                {statusCounts.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="processing">
            Processing
            {statusCounts.processing > 0 && (
              <Badge variant="secondary" className="ml-2">
                {statusCounts.processing}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="shipped">
            Shipped
            {statusCounts.shipped > 0 && (
              <Badge variant="secondary" className="ml-2">
                {statusCounts.shipped}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Delivered
            {statusCounts.delivered > 0 && (
              <Badge variant="secondary" className="ml-2">
                {statusCounts.delivered}
              </Badge>
            )}
          </TabsTrigger>
          {statusCounts.verifying > 0 && (
            <TabsTrigger value="verifying">
              Verifying
              <Badge variant="secondary" className="ml-2">
                {statusCounts.verifying}
              </Badge>
            </TabsTrigger>
          )}
          <TabsTrigger value="canceled">
            Canceled
            {statusCounts.canceled > 0 && (
              <Badge variant="secondary" className="ml-2">
                {statusCounts.canceled}
              </Badge>
            )}
          </TabsTrigger>
          {statusCounts.failed > 0 && (
            <TabsTrigger value="failed">
              Failed Delivery
              <Badge variant="secondary" className="ml-2">
                {statusCounts.failed}
              </Badge>
            </TabsTrigger>
          )}
          {statusCounts.transit > 0 && (
            <TabsTrigger value="transit">
              In Transit
              <Badge variant="secondary" className="ml-2">
                {statusCounts.transit}
              </Badge>
            </TabsTrigger>
          )}
        </TabsList>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <TabsContent value="all" className="mt-6">
              {filteredOrders && filteredOrders.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrders.map((order) => (
                    <OrderCard key={order.uid} order={order} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              {filteredOrders?.filter((o) => o.status === "PENDING").length ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrders
                    .filter((o) => o.status === "PENDING")
                    .map((order) => (
                      <OrderCard key={order.uid} order={order} />
                    ))}
                </div>
              ) : (
                <EmptyState status="pending" />
              )}
            </TabsContent>

            <TabsContent value="processing" className="mt-6">
              {filteredOrders?.filter((o) => o.status === "PROCESSING")
                .length ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrders
                    .filter((o) => o.status === "PROCESSING")
                    .map((order) => (
                      <OrderCard key={order.uid} order={order} />
                    ))}
                </div>
              ) : (
                <EmptyState status="processing" />
              )}
            </TabsContent>

            <TabsContent value="shipped" className="mt-6">
              {filteredOrders?.filter((o) => o.status === "SHIPPED").length ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrders
                    .filter((o) => o.status === "SHIPPED")
                    .map((order) => (
                      <OrderCard key={order.uid} order={order} />
                    ))}
                </div>
              ) : (
                <EmptyState status="shipped" />
              )}
            </TabsContent>

            <TabsContent value="delivered" className="mt-6">
              {filteredOrders?.filter((o) => o.status === "DELIVERED")
                .length ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrders
                    .filter((o) => o.status === "DELIVERED")
                    .map((order) => (
                      <OrderCard key={order.uid} order={order} />
                    ))}
                </div>
              ) : (
                <EmptyState status="delivered" />
              )}
            </TabsContent>

            <TabsContent value="verifying" className="mt-6">
              {filteredOrders?.filter((o) => o.status === "VERIFYING_PAYMENT")
                .length ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrders
                    .filter((o) => o.status === "VERIFYING_PAYMENT")
                    .map((order) => (
                      <OrderCard key={order.uid} order={order} />
                    ))}
                </div>
              ) : (
                <EmptyState status="verifying payment" />
              )}
            </TabsContent>

            <TabsContent value="canceled" className="mt-6">
              {filteredOrders?.filter((o) => o.status === "CANCELED").length ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrders
                    .filter((o) => o.status === "CANCELED")
                    .map((order) => (
                      <OrderCard key={order.uid} order={order} />
                    ))}
                </div>
              ) : (
                <EmptyState status="canceled" />
              )}
            </TabsContent>
            <TabsContent value="failed" className="mt-6">
              {filteredOrders?.filter((o) => o.status === "FAILED_DELIVERY")
                .length ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrders
                    .filter((o) => o.status === "FAILED_DELIVERY")
                    .map((order) => (
                      <OrderCard key={order.uid} order={order} />
                    ))}
                </div>
              ) : (
                <EmptyState status="failed delivery" />
              )}
            </TabsContent>
            <TabsContent value="transit" className="mt-6">
              {filteredOrders?.filter((o) => o.status === "IN_TRANSIT")
                .length ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrders
                    .filter((o) => o.status === "IN_TRANSIT")
                    .map((order) => (
                      <OrderCard key={order.uid} order={order} />
                    ))}
                </div>
              ) : (
                <EmptyState status="in transit" />
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </Wrapper>
  );
}
