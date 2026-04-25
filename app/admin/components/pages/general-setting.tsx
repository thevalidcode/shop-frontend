"use client";

import { motion } from "framer-motion";

import { currency } from "@/app/_docs/doc";
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
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useUpdateShopSettings } from "@/hooks/use-shop";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/appContext";
import { TypographyH2, TypographyH3 } from "@/components/typography";
import { FeatureGate } from "@/components/FeatureGate";
import {
  Settings2,
  DollarSign,
  Settings,
  Sparkles,
  Share2Icon,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";

export default function GeneralSettingsForm() {
  const { generalSetting, userCurrency, setUserCurrency, shopInfo } =
    useAppContext();
  const [shopName, setShopName] = useState(generalSetting?.shopName || "");
  const [socialAccounts, setSocialAccounts] = useState({
    instagramUrl: generalSetting?.instagramUrl || "",
    xUrl: generalSetting?.xUrl || "",
    facebookUrl: generalSetting?.facebookUrl || "",
    youtubeUrl: generalSetting?.youtubeUrl || "",
    tiktokUrl: generalSetting?.tiktokUrl || "",
  });

  const [shopDescription, setShopDescription] = useState(
    generalSetting?.shopDescription || "",
  );
  const [clientCurrency, setClientCurrency] = useState(
    generalSetting?.defaultClientCurrency || "USD",
  );
  const [showBanner, setShowBanner] = useState<boolean>(
    generalSetting?.showBanner ?? true,
  );

  // Shop Address Fields
  const [shopAddress, setShopAddress] = useState({
    shopStreet: generalSetting?.shopStreet || "",
    shopCity: generalSetting?.shopCity || "",
    shopState: generalSetting?.shopState || "",
    shopPostalCode: generalSetting?.shopPostalCode || "",
    shopCountry: generalSetting?.shopCountry || "",
    shopPhone: generalSetting?.shopPhone || "",
  });

  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const { mutateAsync: updateShopSettings } = useUpdateShopSettings();

  const canToggleBanner = shopInfo?.features?.hide_platform_banner ?? false;

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    if (shopAddress.shopCountry) {
      const countryStates = State.getStatesOfCountry(shopAddress.shopCountry);
      setStates(countryStates);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [shopAddress.shopCountry]);

  useEffect(() => {
    if (shopAddress.shopCountry && shopAddress.shopState) {
      const stateCities = City.getCitiesOfState(
        shopAddress.shopCountry,
        shopAddress.shopState,
      );
      setCities(stateCities);
    } else {
      setCities([]);
    }
  }, [shopAddress.shopCountry, shopAddress.shopState]);

  const handleSave = async () => {
    await updateShopSettings({
      shopName: shopName,
      shopDescription,
      defaultClientCurrency: clientCurrency,
      showBanner,
      ...socialAccounts,
      ...shopAddress,
    });
    toast.success("Settings updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
        <div>
          <TypographyH2 className="text-2xl mb-2">
            General Settings
          </TypographyH2>
          <p className="text-muted-foreground">
            Configure your shop's basic information and preferences.
          </p>
        </div>
        <Button onClick={handleSave} size="lg" className="gap-2">
          <Sparkles className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="space-y-8">
        {/* Shop Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div>
            <TypographyH3 className="text-lg mb-4 flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              Shop Information
            </TypographyH3>
            <div className="bg-muted/30 rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shopName" className="text-sm font-medium">
                    Shop Name
                  </Label>
                  <Input
                    id="shopName"
                    type="text"
                    placeholder="Enter your shop name"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="shopDescription"
                    className="text-sm font-medium"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="shopDescription"
                    placeholder="Enter shop description"
                    value={shopDescription}
                    onChange={(e) => setShopDescription(e.target.value)}
                    className="min-h-25 resize`-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Accounts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div>
            <TypographyH3 className="text-lg mb-4 flex items-center gap-2">
              <Share2Icon className="h-5 w-5 text-primary" />
              Social Media Accounts
            </TypographyH3>
            <div className="bg-muted/30 rounded-lg p-6 space-y-6">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="instagramUrl" className="text-sm font-medium">
                    Instagram URL
                  </Label>
                  <Input
                    id="instagramUrl"
                    type="url"
                    placeholder="Enter your Instagram URL"
                    value={socialAccounts.instagramUrl}
                    onChange={(e) =>
                      setSocialAccounts((prev) => ({
                        ...prev,
                        instagramUrl: e.target.value,
                      }))
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebookUrl" className="text-sm font-medium">
                    Facebook URL
                  </Label>
                  <Input
                    id="facebookUrl"
                    type="url"
                    placeholder="Enter your Facebook URL"
                    value={socialAccounts.facebookUrl}
                    onChange={(e) =>
                      setSocialAccounts((prev) => ({
                        ...prev,
                        facebookUrl: e.target.value,
                      }))
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="xUrl" className="text-sm font-medium">
                    X URL
                  </Label>
                  <Input
                    id="xUrl"
                    type="url"
                    placeholder="Enter your X URL"
                    value={socialAccounts.xUrl}
                    onChange={(e) =>
                      setSocialAccounts((prev) => ({
                        ...prev,
                        xUrl: e.target.value,
                      }))
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl" className="text-sm font-medium">
                    Youtube URL
                  </Label>
                  <Input
                    id="youtubeUrl"
                    type="url"
                    placeholder="Enter your Youtube URL"
                    value={socialAccounts.youtubeUrl}
                    onChange={(e) =>
                      setSocialAccounts((prev) => ({
                        ...prev,
                        youtubeUrl: e.target.value,
                      }))
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktokUrl" className="text-sm font-medium">
                    TikTok URL
                  </Label>
                  <Input
                    id="tiktokUrl"
                    type="url"
                    placeholder="Enter your TikTok URL"
                    value={socialAccounts.tiktokUrl}
                    onChange={(e) =>
                      setSocialAccounts((prev) => ({
                        ...prev,
                        tiktokUrl: e.target.value,
                      }))
                    }
                    className="h-11"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Shop Address Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          <div>
            <TypographyH3 className="text-lg mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Shop Address
            </TypographyH3>
            <div className="bg-muted/30 rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shopStreet" className="text-sm font-medium">
                    Street Address
                  </Label>
                  <Input
                    id="shopStreet"
                    type="text"
                    placeholder="123 Main Street"
                    value={shopAddress.shopStreet}
                    onChange={(e) =>
                      setShopAddress((prev) => ({
                        ...prev,
                        shopStreet: e.target.value,
                      }))
                    }
                    className="h-11"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shopCountry" className="text-sm font-medium">
                    Country
                  </Label>
                  <Select
                    value={shopAddress.shopCountry}
                    onValueChange={(val) =>
                      setShopAddress((prev) => ({
                        ...prev,
                        shopCountry: val,
                        shopState: "",
                        shopCity: "",
                      }))
                    }
                  >
                    <SelectTrigger id="shopCountry" className="h-11 w-full">
                      <SelectValue placeholder="Select country..." />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem
                          key={country.isoCode}
                          value={country.isoCode}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopState" className="text-sm font-medium">
                    State/Province
                  </Label>
                  <Select
                    value={shopAddress.shopState}
                    onValueChange={(val) =>
                      setShopAddress((prev) => ({
                        ...prev,
                        shopState: val,
                        shopCity: "",
                      }))
                    }
                    disabled={!shopAddress.shopCountry || states.length === 0}
                  >
                    <SelectTrigger id="shopState" className="h-11 w-full">
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
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shopCity" className="text-sm font-medium">
                    City
                  </Label>
                  <Select
                    value={shopAddress.shopCity}
                    onValueChange={(val) =>
                      setShopAddress((prev) => ({
                        ...prev,
                        shopCity: val,
                      }))
                    }
                    disabled={
                      !shopAddress.shopCountry ||
                      !shopAddress.shopState ||
                      cities.length === 0
                    }
                  >
                    <SelectTrigger id="shopCity" className="h-11 w-full">
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
                <div className="space-y-2">
                  <Label
                    htmlFor="shopPostalCode"
                    className="text-sm font-medium"
                  >
                    Postal Code
                  </Label>
                  <Input
                    id="shopPostalCode"
                    type="text"
                    placeholder="10001"
                    value={shopAddress.shopPostalCode}
                    onChange={(e) =>
                      setShopAddress((prev) => ({
                        ...prev,
                        shopPostalCode: e.target.value,
                      }))
                    }
                    className="h-11"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shopPhone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <PhoneInput
                    id="shopPhone"
                    placeholder="Phone number (e.g., +1 234 567 8900)"
                    value={shopAddress.shopPhone}
                    onChange={(e) =>
                      setShopAddress((prev) => ({
                        ...prev,
                        shopPhone: e.target.value || "",
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Currency Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            <TypographyH3 className="text-lg mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Currency Settings
            </TypographyH3>
            <div className="bg-muted/30 rounded-lg p-6 space-y-6">
              <div className="w-full flex flex-wrap gap-6">
                {/* Client Currency */}
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="clientCurrency"
                    className="text-sm font-medium"
                  >
                    Client Default Currency
                  </Label>
                  <Select
                    value={clientCurrency}
                    onValueChange={(val) =>
                      setClientCurrency(val as typeof clientCurrency)
                    }
                  >
                    <SelectTrigger id="clientCurrency" className="h-11 w-full">
                      <SelectValue placeholder="Select currency..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(currency).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {key} - {value.split("|")[0]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Admin Currency */}
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="adminCurrency"
                    className="text-sm font-medium"
                  >
                    Admin Currency
                  </Label>
                  <Select value={userCurrency} onValueChange={setUserCurrency}>
                    <SelectTrigger id="adminCurrency" className="h-11 w-full">
                      <SelectValue placeholder="Select currency..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(currency).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {key} - {value.split("|")[0]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="space-y-6"
        >
          <div>
            <TypographyH3 className="text-lg mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Preferences
            </TypographyH3>
            <FeatureGate
              isAllowed={canToggleBanner}
              featureLabel="Hide banner"
              variant="overlay"
              description="This plan does not include hiding the promotional banner. Upgrade to remove the banner from your shop."
            >
              <div className="bg-muted/30 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="showBanner" className="text-sm font-medium">
                      Show Banner
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Display promotional banner on your shop
                    </p>
                  </div>
                  <Switch
                    id="showBanner"
                    checked={showBanner}
                    onCheckedChange={setShowBanner}
                  />
                </div>
              </div>
            </FeatureGate>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
