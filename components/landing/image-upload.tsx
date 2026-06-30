"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Camera, Loader2, Upload } from "lucide-react";
import { createSupabaseBrowserClient } from "@/utils/supabase-client";
import { Input } from "../ui/input";

interface ImageUploadZoneProps {
  value?: string | null;
  onChange: (url: string) => void;
}

const ImageUploadZone = ({ value, onChange }: ImageUploadZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const displayImage = value || null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const supabase = createSupabaseBrowserClient();

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Create a unique file name to avoid overlaps
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file directly to Supabase storage bucket
      const { error: uploadError, data } = await supabase.storage
        .from("profile_images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Extract public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile_images").getPublicUrl(filePath);

      // Pass the public URL back up to React Hook Form
      onChange(publicUrl);
    } catch (error) {
      console.error("[SUPABASE_STORAGE_UPLOAD_ERROR]:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      onClick={() => !isUploading && fileInputRef.current?.click()}
      className="border border-secondary rounded-md bg-white/50 flex flex-col items-center justify-center min-w-100 w-full min-h-48 h-full relative overflow-hidden cursor-pointer group hover:bg-white/80 transition-colors"
    >
      {value && displayImage && (
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-xl opacity-20 pointer-events-none transition-all duration-300"
          style={{ backgroundImage: `url(${displayImage})` }}
        />
      )}

      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
      <div className="z-20 relative w-full h-48 flex items-center justify-center p-4">
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 bg-white/60 p-4 rounded-lg backdrop-blur-sm shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs font-semibold text-slate-600">
              Uploading ...
            </span>
          </div>
        ) : displayImage ? (
          <>
            <Image
              src={displayImage || ""}
              alt="Profile Picture UI Element"
              fill
              priority
              className="object-contain p-2"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs gap-2 transition-opacity duration-200">
              <Upload className="h-5 w-5" />
              <span>Change Profile Picture</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-slate-400 group-hover:text-primary transition-colors duration-200">
            <div className="p-4 bg-primary/25 rounded-full group-hover:bg-primary/10 transition-colors duration-200">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <span className="text-base font-medium tracking-tight">
              Upload an image
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadZone;
