"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateShippingInfo,
  useUpdateShippingInfo,
  useGetShippingInfoByUid,
} from "@/hooks/use-shipping-info";
import { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";

export interface ShippingInfoFormValues {
  uid?: string;
  fullName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
}

export function ShippingInfoForm({
  initial,
  onClose,
}: {
  initial?: Partial<ShippingInfoFormValues>;
  onClose: () => void;
}) {
  const [values, setValues] = useState<ShippingInfoFormValues>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    isDefault: false,
    ...initial,
  });

  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const createShippingInfo = useCreateShippingInfo();
  const updateShippingInfo = useUpdateShippingInfo();
  const { data: fetched, isLoading: fetching } = useGetShippingInfoByUid(
    initial?.uid || "",
  );

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    if (values.country) {
      const countryStates = State.getStatesOfCountry(values.country);
      setStates(countryStates);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [values.country]);

  useEffect(() => {
    if (values.country && values.state) {
      const stateCities = City.getCitiesOfState(values.country, values.state);
      setCities(stateCities);
    } else {
      setCities([]);
    }
  }, [values.country, values.state]);

  useEffect(() => {
    if (fetched) {
      setValues((s) => ({
        ...s,
        uid: fetched.uid,
        fullName: fetched.fullName,
        email: fetched.email,
        phone: fetched.phone || "",
        address: fetched.address,
        city: fetched.city,
        state: fetched.state || "",
        country: fetched.country,
        postalCode: fetched.postalCode,
        isDefault: fetched.isDefault,
      }));
    }
  }, [fetched]);

  const isEditing = Boolean(initial?.uid);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.currentTarget;
    setValues((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && values.uid) {
        await updateShippingInfo.mutateAsync({ uid: values.uid, ...values });
      } else {
        await createShippingInfo.mutateAsync(values);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save shipping info:", error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {fetching && initial?.uid ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : null}
      <div className="grid gap-2">
        <Label>Full Name</Label>
        <Input
          name="fullName"
          placeholder="John Doe"
          value={values.fullName}
          onChange={onChange}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label>Email</Label>
        <Input
          name="email"
          type="email"
          placeholder="john@example.com"
          value={values.email}
          onChange={onChange}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label>Phone</Label>
        <PhoneInput
          placeholder="Phone number (e.g., +1 234 567 8900)"
          value={values.phone || ""}
          onChange={(e) => setValues((s) => ({ ...s, phone: e.target.value || "" }))}
        />
      </div>
      <div className="grid gap-2">
        <Label>Address</Label>
        <Input
          name="address"
          placeholder="123 Main Street"
          value={values.address}
          onChange={onChange}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Country</Label>
          <Select
            value={values.country}
            onValueChange={(val) =>
              setValues((s) => ({
                ...s,
                country: val,
                state: "",
                city: "",
              }))
            }
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Select country..." />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>State/Province</Label>
          <Select
            value={values.state || ""}
            onValueChange={(val) =>
              setValues((s) => ({
                ...s,
                state: val,
                city: "",
              }))
            }
            disabled={!values.country || states.length === 0}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Select state..." />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>City</Label>
          <Select
            value={values.city}
            onValueChange={(val) => setValues((s) => ({ ...s, city: val }))}
            disabled={!values.country || !values.state || cities.length === 0}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Select city..." />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Postal Code</Label>
          <Input
            name="postalCode"
            placeholder="10001"
            value={values.postalCode}
            onChange={onChange}
            required
            className="h-11"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={createShippingInfo.isPending || updateShippingInfo.isPending}
        >
          {isEditing ? "Save" : "Create"}
        </Button>
      </div>
    </form>
  );
}
