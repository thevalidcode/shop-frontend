"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CurrencySelect from "@/components/CurrencySelect";

interface AccountFormProps {
  values: {
    fullName: string;
    username: string;
    email: string;
    role: string;
    currency: string;
    phone?: string;
  };
  isSaving?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function AccountForm({ values, isSaving, onChange, onSubmit, onCancel }: AccountFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-2">
        <Label>Full Name</Label>
        <Input name="fullName" value={values.fullName || ""} onChange={onChange} required />
      </div>

      <div className="grid gap-2">
        <Label>Username</Label>
        <Input name="username" value={values.username} onChange={onChange} required />
      </div>

      <div className="grid gap-2">
        <Label>Email</Label>
        <Input name="email" type="email" value={values.email} onChange={onChange} disabled />
      </div>

      <div className="grid gap-2">
        <Label>Phone Number</Label>
        <Input 
          name="phone" 
          type="tel" 
          value={values.phone || ""} 
          onChange={onChange} 
          placeholder="Enter phone number (optional)" 
        />
      </div>

      <div className="grid gap-2">
        <Label>Role</Label>
        <Select disabled value={values.role}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BASIC">Basic</SelectItem>
            <SelectItem value="VIP">VIP</SelectItem>
            <SelectItem value="RESELLER">Reseller</SelectItem>
            <SelectItem value="PARTNER">Partner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Currency</Label>
        <CurrencySelect />
        <p className="text-sm text-muted-foreground">Selected currency: {values.currency}</p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isSaving ? "Saving..." : "Save Changes"}</Button>
      </div>
    </form>
  );
}
