"use client";

import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageIcon, X, Upload } from "lucide-react";
import { PreviousImagesSelector } from "../components/PreviousImagesSelector";
import { CollectionName } from "@/types";
import {
  useUploadImage,
  useUploadImagesBatch,
  UploadImagesBatchResponse,
} from "@/hooks/use-file";
import { toast } from "sonner";

export interface ImageData {
  url: string;
  filename: string | null;
  file?: File;
}

/**
 * ImagePicker Component
 *
 * A flexible image upload component supporting both single and multiple file uploads.
 *
 * @example Single Image Upload (Default UI)
 * ```tsx
 * <ImagePicker
 *   label="Product Image"
 *   collection="products"
 *   onChange={(data) => setImage(data as ImageData)}
 * />
 * ```
 *
 * @example Multiple Image Upload (Gallery Preview)
 * ```tsx
 * <ImagePicker
 *   label="Product Gallery"
 *   collection="products"
 *   multiple={true}
 *   maxFiles={5}
 *   variant="gallery"
 *   onChange={(data) => setImages(data as ImageData[])}
 * />
 * ```
 */
type SingleImagePickerProps = {
  label?: string;
  collection: CollectionName;
  value?: string;
  className?: string;
  multiple?: false;
  maxFiles?: number;
  variant?: "default" | "gallery";
  onChange: (data: ImageData) => void;
};

type MultiImagePickerProps = {
  label?: string;
  collection: CollectionName;
  value?: string[];
  className?: string;
  multiple: true;
  maxFiles?: number;
  variant?: "default" | "gallery";
  onChange: (data: ImageData[]) => void;
};

type ImagePickerProps = SingleImagePickerProps | MultiImagePickerProps;

export default function ImagePicker({
  label,
  collection,
  value,
  className = "lg:flex-wrap",
  multiple = false,
  maxFiles = 10,
  variant = "default",
  onChange,
}: ImagePickerProps) {
  const [selectedImages, setSelectedImages] = useState<ImageData[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const { mutateAsync: uploadImage } = useUploadImage();
  const { mutateAsync: uploadImagesBatch } = useUploadImagesBatch();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check max files limit for multiple mode
    if (multiple && selectedImages.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    // For single mode, only take first file
    const filesToUpload = multiple ? files : [files[0]];

    setIsUploading(true);
    let uploadedImages: ImageData[] = [];

    if (multiple) {
      const toastId = toast.loading(
        `Uploading ${filesToUpload.length} image(s)...`,
      );
      try {
        const batch: UploadImagesBatchResponse = await uploadImagesBatch({
          files: filesToUpload,
          collection,
        });

        const successes = batch.uploads.filter(
          (u) => u.status === "success" || u.status === "already_exists",
        );
        uploadedImages = successes.map((u) => ({
          url: u.url,
          filename: u.filename,
        }));

        const errors = batch.errors?.length || 0;
        toast.success(
          `${batch.message} • ${batch.successful}/${batch.total} succeeded` +
            (errors ? ` • ${errors} error(s)` : ""),
          { id: toastId },
        );
      } catch (err) {
        toast.error("Batch upload failed", { id: toastId });
        console.error(err);
      }
    } else {
      const file = filesToUpload[0];
      const toastId = toast.loading(`Uploading ${file.name}...`);
      try {
        const response = await uploadImage({ file, collection });
        uploadedImages = [{ url: response.url, filename: file.name }];
        toast.success(`${file.name} uploaded successfully!`, { id: toastId });
      } catch (err) {
        toast.error(`Failed to upload ${file.name}`, { id: toastId });
        console.error(err);
      }
    }

    if (uploadedImages.length > 0) {
      if (multiple) {
        const newImages = [...selectedImages, ...uploadedImages];
        setSelectedImages(newImages);
        (onChange as (data: ImageData[]) => void)(newImages);
      } else {
        setSelectedImages(uploadedImages);
        setSelectedFileName(uploadedImages[0].filename);
        (onChange as (data: ImageData) => void)(uploadedImages[0]);
      }
    }

    setIsUploading(false);
    e.target.value = ""; // Reset input
  };

  const handleRemoveImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);

    if (multiple) {
      (onChange as (data: ImageData[]) => void)(newImages);
    } else {
      (onChange as (data: ImageData) => void)(
        newImages[0] || { url: "", filename: null },
      );
    }
  };

  const handleGallerySelect = (img: { url: string; filename: string }) => {
    const newImage: ImageData = {
      url: img.url,
      filename: img.filename,
      file: undefined,
    };

    if (multiple) {
      if (selectedImages.length >= maxFiles) {
        toast.error(`Maximum ${maxFiles} images allowed`);
        return;
      }
      const newImages = [...selectedImages, newImage];
      setSelectedImages(newImages);
      (onChange as (data: ImageData[]) => void)(newImages);
      // Keep dialog open for multiple selections
    } else {
      setSelectedImages([newImage]);
      setSelectedFileName(img.filename);
      (onChange as (data: ImageData) => void)(newImage);
      // Close dialog for single selection
      setGalleryDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col lg:gap-2 gap-1">
      {label && (
        <Label>
          {label}
          {multiple && variant === "gallery" && (
            <span className="text-xs text-muted-foreground ml-2">
              ({selectedImages.length}/{maxFiles} images)
            </span>
          )}
        </Label>
      )}

      <div className={`flex flex-wrap gap-3 ${className}`}>
        {/* File Upload - Default Variant */}
        {variant === "default" && (
          <div className="flex w-full items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-accent transition text-sm">
            <Input
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleFileUpload}
              disabled={isUploading}
              className="cursor-pointer w-40"
            />
            <span className="text-muted-foreground truncate max-w-35">
              {isUploading
                ? "Uploading..."
                : selectedFileName
                  ? selectedFileName
                  : value
                    ? "Image selected"
                    : multiple
                      ? `${selectedImages.length} file(s) selected`
                      : "No file selected"}
            </span>
          </div>
        )}

        {/* File Upload - Gallery Variant */}
        {variant === "gallery" && (
          <label
            htmlFor={`file-upload-${collection}`}
            className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent transition cursor-pointer text-sm"
          >
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {isUploading
                ? "Uploading..."
                : multiple
                  ? "Upload Images"
                  : "Upload Image"}
            </span>
            <Input
              id={`file-upload-${collection}`}
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleFileUpload}
              disabled={
                isUploading || (multiple && selectedImages.length >= maxFiles)
              }
              className="hidden"
            />
          </label>
        )}

        {/* Previous Images Selector */}
        <Dialog open={galleryDialogOpen} onOpenChange={setGalleryDialogOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent transition cursor-pointer text-sm"
              title="Browse previously uploaded images"
              disabled={
                multiple &&
                variant === "gallery" &&
                selectedImages.length >= maxFiles
              }
            >
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">Gallery</span>
            </button>
          </DialogTrigger>

          <PreviousImagesSelector
            collection={collection}
            onSelect={handleGallerySelect}
          />
        </Dialog>
      </div>

      {/* Selected Images Preview */}
      {selectedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-3">
          {selectedImages.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="relative group aspect-square rounded-md border overflow-hidden bg-muted"
            >
              <img
                src={image.url}
                alt={image.filename || `Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {image.filename && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                  {image.filename}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
