"use client";

import React from "react";
import { PaymentGateway } from "@/types";
import {
  useCreatePaymentGateway,
  useUpdatePaymentGateway,
} from "@/hooks/use-paymentGateway";
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

  const createOrUpdateGateway = async (gateway: PaymentGateway) => {
    if (editingGateway) {
      const response = await updateGateway({
        ...gateway,
      });
      setGateways((prev) =>
        prev.map((g) => (g.uid === gateway.uid ? gateway : g)),
      );
      return response;
    } else {
      const response = await addGateway({
        ...gateway,
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
