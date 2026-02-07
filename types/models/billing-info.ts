export interface BillingInfo {
  id: number;
  uid: string;
  userId: number;
  fullName: string;
  email: string;
  phone?: string | null;
  address: string;
  city: string;
  state?: string | null;
  country: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
