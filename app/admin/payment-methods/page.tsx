"use client";

import { useEffect, useState } from "react";
import {
  PaymentMethodCardList,
  PaymentMethodsHeader,
  PaymentMethodStats,
  PaymentToolbar,
} from "./components";
import { PaymentGateway } from "@/types";
import { useGetAllPaymentGatewaysForAdmins } from "@/hooks/use-paymentGateway";
import { EmptyState } from "@/components/empty-state";
import { CreditCard } from "lucide-react";
import { useAppContext } from "@/context/appContext";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function PaymentMethodsPage() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [editingGateway, setEditingGateway] = useState<
    PaymentGateway | undefined
  >();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const { data: gatewaysData } = useGetAllPaymentGatewaysForAdmins();
  const { shopInfo } = useAppContext();

  const maxPaymentGateways = shopInfo?.features?.payment_gateways ?? 0;
  const canAddMoreGateways = gateways.length < maxPaymentGateways;

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredGateways = gateways
    ?.filter((gateway) => {
      // Status filter
      if (statusFilter === "All") return true;
      return gateway.status === statusFilter;
    })
    .filter((gateway) => {
      if (!normalizedSearch) return true;

      const descriptionText = (gateway.description || "").toLowerCase();
      const contentText = (gateway.content || "").toLowerCase();

      return (
        gateway.name.toLowerCase().includes(normalizedSearch) ||
        descriptionText.includes(normalizedSearch) ||
        contentText.includes(normalizedSearch) ||
        gateway.platform.toLowerCase().includes(normalizedSearch)
      );
    });

  const hasFilter = statusFilter !== "All" || normalizedSearch.length > 0;

  const handleAddClick = () => {
    if (!canAddMoreGateways) {
      toast.error(
        `You can only add up to ${maxPaymentGateways} payment gateways. Upgrade your plan for more.`,
      );
      return;
    }
    setEditingGateway(undefined);
    setOpenForm(true);
  };

  const handleEdit = (gateway: PaymentGateway) => {
    setEditingGateway(gateway);
    setOpenForm(true);
  };

  useEffect(() => {
    if (gatewaysData) {
      setGateways(
        gatewaysData.filter((gateway) => gateway.platform !== "CREDIT"),
      );
    }
  }, [gatewaysData]);

  if (gateways.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <PaymentMethodsHeader
          onCreateClick={handleAddClick}
          search={searchQuery}
          status={statusFilter}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
          canAddMoreGateways={canAddMoreGateways}
          maxPaymentGateways={maxPaymentGateways}
        />

        <EmptyState
          icon={CreditCard}
          title="No Payment Method Found"
          description="No payment method have been created yet."
          actionLabel="Create Payment Method"
          onAction={handleAddClick}
          maxAmount={maxPaymentGateways}
          canAddMore={canAddMoreGateways}
          featureLabel="Payment gateway limit"
          tooltipDescription={`You've reached the maximum of ${maxPaymentGateways} payment gateways. Upgrade to add more.`}
        />

        <PaymentToolbar
          openForm={openForm}
          setOpenForm={setOpenForm}
          gateways={gateways}
          setGateways={setGateways}
          editingGateway={editingGateway}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PaymentMethodsHeader
        onCreateClick={handleAddClick}
        search={searchQuery}
        status={statusFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        canAddMoreGateways={canAddMoreGateways}
        maxPaymentGateways={maxPaymentGateways}
      />

      <PaymentMethodStats gateways={gateways} />

      {filteredGateways.length === 0 && hasFilter ? (
        <EmptyState
          icon={CreditCard}
          title="No payment methods match your filters"
          description="Try a different search term or reset the status filter."
        />
      ) : (
        <PaymentMethodCardList
          gateways={filteredGateways}
          setGateways={setGateways}
          onEdit={handleEdit}
        />
      )}

      <PaymentToolbar
        openForm={openForm}
        setOpenForm={setOpenForm}
        gateways={gateways}
        setGateways={setGateways}
        editingGateway={editingGateway}
      />
    </motion.div>
  );
}
