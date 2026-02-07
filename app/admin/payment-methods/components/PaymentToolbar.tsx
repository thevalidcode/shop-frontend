"use client";

import React from "react";
import { PaymentGateway } from "@/types";
import {
  useCreatePaymentGateway,
  useUpdatePaymentGateway,
} from "@/hooks/use-paymentGateway";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import PaymentMethodForm from "./PaymentMethodForm";

export default function PaymentToolbar({
  gateways,
  setGateways,
  openForm,
  setOpenForm,
  editingGateway,
}: {
  gateways: PaymentGateway[];
  setGateways: React.Dispatch<React.SetStateAction<PaymentGateway[]>>;
  openForm: boolean;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  editingGateway?: PaymentGateway;
}) {
  const { mutateAsync: addGateway } = useCreatePaymentGateway();
  const { mutateAsync: updateGateway } = useUpdatePaymentGateway();
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();

  const createOrUpdateGateway = async (gateway: PaymentGateway) => {
    const usdMin = convert(userCurrency, "USD", gateway.min ?? "0").amount;
    const usdMax = convert(userCurrency, "USD", gateway.max ?? "0").amount;

    if (editingGateway) {
      const response = await updateGateway({
        ...gateway,
        min: usdMin,
        max: usdMax,
      });
      setGateways((prev) =>
        prev.map((g) => (g.uid === gateway.uid ? gateway : g)),
      );
      return response;
    } else {
      const response = await addGateway({
        ...gateway,
        min: usdMin,
        max: usdMax,
      });
      return response;
    }
  };

  return (
    <PaymentMethodForm
      open={openForm}
      onClose={() => setOpenForm(false)}
      onSave={createOrUpdateGateway}
      initialData={editingGateway}
    />
  );
}
