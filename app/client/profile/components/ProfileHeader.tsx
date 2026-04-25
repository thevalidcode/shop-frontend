"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";

interface ProfileHeaderProps {
  fullName: string;
  username: string;
  joinedAt?: string;
  imageUrl?: string | null;
  editing: boolean;
  uploadingImage?: boolean;
  onToggleEditing: () => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileHeader({
  fullName,
  username,
  joinedAt,
  imageUrl,
  editing,
  uploadingImage,
  onToggleEditing,
  onUploadImage,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col gap-8 sm:flex-row">
      <div className="relative h-32 w-32 shrink-0">
        <img
          src={imageUrl || "/images/default-profile.jpg"}
          alt="Profile"
          className="h-32 w-32 rounded-full object-cover border"
        />

        {editing && (
          <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition hover:opacity-100">
            <Camera className="h-6 w-6 text-white" />
            <Input
              type="file"
              accept="image/*"
              disabled={uploadingImage}
              className="hidden"
              onChange={onUploadImage}
            />
          </label>
        )}
      </div>

      <div className="flex-1">
        <h1 className="text-2xl font-semibold">{fullName || "Unnamed User"}</h1>
        <p className="text-sm text-muted-foreground">@{username}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Joined {joinedAt ? new Date(joinedAt).toLocaleDateString() : "N/A"}
        </p>

        <div className="mt-6">
          <Button variant="outline" onClick={onToggleEditing}>
            {editing ? "Cancel Editing" : "Edit Profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}
