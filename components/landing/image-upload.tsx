"use client";

import Image from "next/image";
import React, {useState, useRef, useId} from "react";
import {Camera, Loader2, Trash2, Eye, EyeOff, AlertCircle, Upload} from "lucide-react";
import {createSupabaseBrowserClient} from "@/utils/supabase-client";
import {Label} from "@/components/ui/label";
import { Button } from "../ui/button";

interface ImageUploadZoneProps {
    value?: string | null;
    onChange: (url: string | null) => void;
    photoVisible: boolean;
    onPhotoVisibleChange: (visible: boolean) => void;
    disabled?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const IMAGE_EXTENSIONS: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

const ImageUploadZone = ({
                             value,
                             onChange,
                             photoVisible,
                             onPhotoVisibleChange,
                             disabled = false
                         }: ImageUploadZoneProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const visibilityId = useId();
    const visibilityNoteId = useId();
    const uploadHelpId = useId();
    const uploadErrorId = useId();

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const displayImage = value || null;
    const isDisabled = disabled || isUploading;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const file = input.files?.[0];

        if (!file || isDisabled) return;

        setUploadError(null);

        const extension = IMAGE_EXTENSIONS[file.type];

        if (!extension) {
            setUploadError("Please choose a JPEG, PNG, or WEBP image.");
            input.value = "";
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setUploadError("The image must be 5MB or smaller.");
            input.value = "";
            return;
        }

        try {
            setIsUploading(true);

            const supabase = createSupabaseBrowserClient();
            const fileName = `${crypto.randomUUID()}.${extension}`;
            const filePath = `avatars/${fileName}`;

            // Upload file directly to Supabase storage bucket
            const { error } = await supabase.storage
                .from("profile_images")
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false,
                    contentType: file.type,
                });

            if (error) throw error;

            // Extract public URL
            const {
                data: {publicUrl},
            } = supabase.storage.from("profile_images").getPublicUrl(filePath);

            // Pass the public URL back up to React Hook Form
            onChange(publicUrl);
        } catch (error) {
            console.error("[SUPABASE_STORAGE_UPLOAD_ERROR]:", error);
            alert("Image upload failed. Please try again.");
        } finally {
            setIsUploading(false);
            input.value = "";
        }
    };

    const handleRemove = () => {
        if (isDisabled) return;

        onChange(null);
        setUploadError(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <section
            aria-label="Candidate photograph"
            aria-busy={isUploading}
            className="w-full min-w-0 space-y-4 rounded-md border border-border bg-card p-4 text-card-foreground sm:p-5"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                    <Label className="mb-1.5">
                        Candidate Photograph
                    </Label>

                    <p
                        id={uploadHelpId}
                        className="text-xs text-card-foreground/70"
                    >
                        JPEG, PNG, or WEBP. Maximum 5MB. A clear professional
                        headshot is recommended.
                    </p>
                </div>

                <div className="flex items-start gap-2">
                    <input
                        id={visibilityId}
                        type="checkbox"
                        checked={photoVisible}
                        onChange={(event) =>
                            onPhotoVisibleChange(event.target.checked)
                        }
                        disabled={isDisabled}
                        aria-describedby={visibilityNoteId}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                    <Label
                        htmlFor={visibilityId}
                        className="cursor-pointer text-[10px] mt-0.5"
                    >
                        Show my photo to signed-in members
                    </Label>
                </div>
            </div>

            <div
                id={visibilityNoteId}
                className="flex items-start gap-2.5 rounded-md border border-input bg-background p-3 text-xs"
            >
                {photoVisible ? (
                    <Eye
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0"
                    />
                ) : (
                    <EyeOff
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0"
                    />
                )}

                <div className="space-y-1">
                    <p className="font-semibold text-sm">
                        {photoVisible
                            ? "Photo display enabled"
                            : "Photo display disabled"}
                    </p>

                    <p className="text-muted-foreground/75 text-xs">
                        {photoVisible
                            ? "After you save, this preference allows your photo to appear in member-facing profiles and proposals."
                            : "After you save, this preference requests that your photo be hidden from member-facing profiles and proposals. It does not hide your advertisement."}
                    </p>
                </div>
            </div>

            {uploadError && (
                <div
                    id={uploadErrorId}
                    role="alert"
                    className="flex items-start gap-2 rounded-md border border-destructive/30 p-3 text-xs text-destructive"
                >
                    <AlertCircle
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0"
                    />
                    <span>{uploadError}</span>
                </div>
            )}

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-input bg-background">
                    {displayImage ? (
                        <Image
                            width={40}
                            height={40}
                            src={displayImage}
                            alt="Your selected profile photograph"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="space-y-1 p-2 text-center text-card-foreground/60">
                            <Upload
                                aria-hidden="true"
                                className="mx-auto h-6 w-6"
                            />
                            <p className="text-xs">No photo</p>
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        disabled={isDisabled}
                        aria-label="Upload candidate photograph"
                        aria-describedby={
                            uploadError
                                ? `${uploadHelpId} ${uploadErrorId}`
                                : uploadHelpId
                        }
                        className="hidden"
                    />

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isDisabled}
                            className="inline-flex items-center justify-center gap-2"
                        >
                            {isUploading ? (
                                <Loader2
                                    aria-hidden="true"
                                    className="h-4 w-4 animate-spin"
                                />
                            ) : (
                                <Upload
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                />
                            )}

                            {isUploading
                                ? "Uploading..."
                                : displayImage
                                    ? "Replace photo"
                                    : "Choose photo"}
                        </Button>

                        {displayImage && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                disabled={isDisabled}
                                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-input px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Trash2
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                />
                                Remove
                            </button>
                        )}
                    </div>

                    <p role="status" className="text-xs text-card-foreground/70">
                        {isUploading
                            ? "Uploading your photograph. Please wait."
                            : "Save or continue the form to persist your photo and visibility preference."}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ImageUploadZone;
