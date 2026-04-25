"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAppContext } from "@/context/appContext";
import { useRegenerateUserApiKey, useUpdateUser } from "@/hooks/use-user";
import { useUploadImage } from "@/hooks/use-file";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "./components/ProfileHeader";
import { AccountForm } from "./components/AccountForm";
import { ApiKeySection } from "./components/ApiKeySection";
import { ShippingInfoList } from "./components/ShippingInfoList";

export default function UserProfilePage() {
  const [editing, setEditing] = useState(false);
  const { userCurrency, userInfo, setUserInfo } = useAppContext();
  const { mutateAsync: updateUser, isPending } = useUpdateUser();
  const { mutateAsync: regenerateApiKey, isPending: isRegeneratingApiKey } =
    useRegenerateUserApiKey();
  const { mutateAsync: uploadImage, isPending: uploadingImage } =
    useUploadImage();

  if (!userInfo) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo!, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await updateUser({
      uid: userInfo?.uid ?? "",
      username: userInfo?.username ?? "",
      image: userInfo?.image ?? "",
      fullName: userInfo?.fullName ?? "",
      phone: userInfo?.phone ?? null,
      currency: userCurrency,
    });
    setEditing(false);
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    const response = await uploadImage({ file: file!, collection: "users" });
    await updateUser({ uid: userInfo?.uid ?? "", image: response.url });
    setUserInfo({ ...userInfo!, image: response.url });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <ProfileHeader
          fullName={userInfo.fullName || ""}
          username={userInfo.username}
          joinedAt={userInfo.timestamp!}
          imageUrl={userInfo.image}
          editing={editing}
          uploadingImage={uploadingImage}
          onToggleEditing={() => setEditing((v) => !v)}
          onUploadImage={handleFileUpload}
        />
      </Card>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-4 space-y-6">
          <Card className="p-6">
            {editing ? (
              <AccountForm
                values={{
                  fullName: userInfo.fullName || "",
                  username: userInfo.username,
                  email: userInfo.email,
                  role: userInfo.role,
                  currency: userCurrency,
                  phone: userInfo.phone || "",
                }}
                isSaving={isPending}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={() => setEditing(false)}
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                Click "Edit Profile" to update your account details.
              </div>
            )}
          </Card>

          <Card className="p-6">
            <ApiKeySection
              onRegenerate={regenerateApiKey}
              isRegenerating={isRegeneratingApiKey}
            />
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="mt-4">
          <ShippingInfoList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

