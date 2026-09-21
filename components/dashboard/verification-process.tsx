"use client";

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    UploadCloud, FileImage, X, CheckCircle2, Loader2
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import {createSupabaseBrowserClient} from "@/utils/supabase-client";
import {submitVerificationAction} from "@/app/actions/verification-actions";
import {getCurrentUser} from "@/app/actions/profile-actions";

export default function VerificationProcess({mode}: { mode: string }) {
    const router = useRouter();
    const [idNumber, setIdNumber] = useState<string | ''>("");
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!idNumber.trim()) {
            toast.error("Please enter your NIC number.");
            return;
        }

        if (!frontFile || !backFile) {
            toast.error("Please upload both front and back images of your NIC.");
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading("Uploading documents securely to Storage...");

        try {
            const supabase = await createSupabaseBrowserClient();
            const {data: currentUser} = await getCurrentUser();

            if (!currentUser) throw new Error("User session not found. Please log in again.");

            const timestamp = Date.now();
            const frontExt = frontFile.name.split(".").pop();
            const backExt = backFile.name.split(".").pop();

            const frontPath = `${currentUser.id}/front_${timestamp}.${frontExt}`;
            const backPath = `${currentUser.id}/back_${timestamp}.${backExt}`;

            toast.loading("Uploading Front side image...", {id: toastId});
            const {error: frontErr} = await supabase.storage
                .from("nic_documents")
                .upload(frontPath, frontFile, {
                    cacheControl: "3600",
                    upsert: true,
                });

            if (frontErr) throw new Error(`Front upload failed: ${frontErr.message}`);

            toast.loading("Uploading Back side image...", {id: toastId});
            const {error: backErr} = await supabase.storage
                .from("nic_documents")
                .upload(backPath, backFile, {
                    cacheControl: "3600",
                    upsert: true,
                });

            if (backErr) throw new Error(`Back upload failed: ${backErr.message}`);

            toast.loading("Images saved. Updating verification records...", {id: toastId});

            const res = await submitVerificationAction({
                documentFrontUrl: frontPath,
                documentBackUrl: backPath,
                idNumber: idNumber.trim(),
            });

            if (res.success) {
                toast.success(res.message, {id: toastId, duration: 4000});
                router.push("/my-dashboard");
            } else {
                toast.error(res.message || "Failed to submit verification request.");
            }

        } catch (err: any) {
            toast.error(err.message || "An unexpected error occurred.");
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="w-full">
            <form onSubmit={handleUpload} className="space-y-6">
                {/* ID Number Field */}
                <div className="space-y-2">
                    <Label htmlFor="idNumber" className="text-sm font-medium text-slate-700 uppercase">
                        NIC / ID Number
                    </Label>
                    <Input
                        id="idNumber"
                        placeholder="NIC Number"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        className="h-11 border-slate-300 font-medium text-sm focus:ring-emerald-500"
                    />
                </div>

                {/* Image Upload Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Front Side Upload */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 uppercase">
                            NIC Front Side
                        </Label>
                        {frontFile ? (
                            <div
                                className="relative flex flex-col items-center justify-center h-48 rounded-xl border-2 border-emerald-500/80 bg-slate-900/5 dark:bg-slate-800/80 p-2 overflow-hidden group">
                                {/* Preview Image */}
                                <div className="relative w-full h-full rounded-lg overflow-hidden">
                                    <Image
                                        src={URL.createObjectURL(frontFile)}
                                        alt="NIC Front Preview"
                                        width={400}
                                        height={400}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>

                                {/* Top Overlay Badge */}
                                <div
                                    className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400"/>
                                    <span className="truncate max-w-[120px]">{frontFile.name}</span>
                                </div>

                                {/* Remove Image Button */}
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => setFrontFile(null)}
                                    className="absolute top-3 right-3"
                                >
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        ) : (
                            <label
                                className="flex flex-col items-center justify-center h-48 rounded-xl border-2 bg-white border-dotted border-slate-300 cursor-pointer p-4 text-center transition-all group">
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors mb-2">
                                    <UploadCloud
                                        className="h-5 w-5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"/>
                                </div>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Click or drag to upload Front
        </span>
                                <span className="text-[11px] text-slate-400 mt-1">
          PNG, JPG, or WEBP (Max 5MB)
        </span>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    className="hidden"
                                    onChange={(e) => setFrontFile(e.target.files?.[0] || null)}
                                />
                            </label>
                        )}
                    </div>

                    {/* Back Side Upload */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 uppercase">
                            NIC Back Side
                        </Label>

                        {backFile ? (
                            <div
                                className="relative flex flex-col items-center justify-center h-48 rounded-xl border-2 border-emerald-500/80 bg-slate-900/5 dark:bg-slate-800/80 p-2 overflow-hidden group">
                                {/* Preview Image */}
                                <div className="relative w-full h-full rounded-lg overflow-hidden">
                                    <Image
                                        src={URL.createObjectURL(backFile)}
                                        width={400}
                                        height={400}
                                        alt="NIC Back Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>

                                {/* Top Overlay Badge */}
                                <div
                                    className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400"/>
                                    <span className="truncate max-w-[120px]">{backFile.name}</span>
                                </div>

                                {/* Remove Image Button */}
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => setBackFile(null)}
                                    className="absolute top-3 right-3"
                                >
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        ) : (
                            <label
                                className="flex flex-col items-center justify-center h-48 rounded-xl border-2 bg-white border-dotted border-slate-300 cursor-pointer p-4 text-center transition-all group">
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors mb-2">
                                    <UploadCloud
                                        className="h-5 w-5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"/>
                                </div>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Click or drag to upload Back
        </span>
                                <span className="text-[11px] text-slate-400 mt-1">
          PNG, JPG, or WEBP (Max 5MB)
        </span>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    className="hidden"
                                    onChange={(e) => setBackFile(e.target.files?.[0] || null)}
                                />
                            </label>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isUploading || !idNumber || !frontFile || !backFile}
                        size={"lg"}
                        className="w-full col-span-2 transition-all"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Uploading & Submitting...
                            </>
                        ) : (
                            "Submit for Verification"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}