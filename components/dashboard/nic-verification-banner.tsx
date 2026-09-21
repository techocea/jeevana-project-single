'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AlertTriangle, Eye, CheckCircle2, XCircle, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { approveProfile, rejectProfile } from '@/app/actions/profile-actions';
import toast from 'react-hot-toast';

interface NicVerificationBannerProps {
    isAdmin?: boolean;
    profileId: string;
    verificationId: string;
    verificationStatus?: 'pending' | 'verified' | 'rejected' | string | null;
    rejectionReason?: string | null;
    documentFrontUrl: string | null;
    documentBackUrl: string | null;
}

export default function NicVerificationBanner({
                                                  isAdmin = false,
                                                  profileId,
                                                  verificationId,
                                                  verificationStatus = 'pending',
                                                  rejectionReason,
                                                  documentFrontUrl,
                                                  documentBackUrl,
                                              }: NicVerificationBannerProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReasonInput, setRejectReasonInput] = useState('');

    const handleApprove = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading('Approving verification...');

        const res = await approveProfile(verificationId, profileId);
        setIsSubmitting(false);

        if (res.success) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast.success(res.message, { id: toastId });
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast.error(res.message, { id: toastId });
        }
    };

    const handleConfirmReject = async () => {
        if (!rejectReasonInput.trim()) return;

        setIsSubmitting(true);
        const toastId = toast.loading('Rejecting verification...');

        const res = await rejectProfile(verificationId, profileId, rejectReasonInput.trim());
        setIsSubmitting(false);
        setIsRejectModalOpen(false);
        setRejectReasonInput('');

        if (res.success) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast.success(res.message, { id: toastId });
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast.error(res.message, { id: toastId });
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
            {/* Dynamic Status Alert Banner */}
            {verificationStatus === 'pending' && (
                <div className="flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-xs">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600 mt-0.5" />
                    <div className="space-y-1">
                        <h5 className="font-semibold text-amber-950 text-sm">NIC Verification Pending</h5>
                        <p className="text-xs text-amber-800 leading-relaxed">
                            Your National Identity Card submission is under review by our verification team.
                        </p>
                    </div>
                </div>
            )}

            {verificationStatus === 'rejected' && (
                <div className="flex items-start gap-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900 shadow-xs">
                    <XCircle className="h-5 w-5 flex-shrink-0 text-rose-600 mt-0.5" />
                    <div className="space-y-1">
                        <h5 className="font-semibold text-rose-950 text-sm">Verification Rejected</h5>
                        <p className="text-xs text-rose-800 leading-relaxed">
                            Reason: <span className="font-medium text-rose-900">{rejectionReason || 'Documents provided were invalid.'}</span>
                        </p>
                    </div>
                </div>
            )}

            {verificationStatus === 'verified' && (
                <div className="flex items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 shadow-xs">
                    <ShieldCheck className="h-5 w-5 flex-shrink-0 text-emerald-600 mt-0.5" />
                    <div className="space-y-1">
                        <h5 className="font-semibold text-emerald-950 text-sm">Identity Verified</h5>
                        <p className="text-xs text-emerald-800 leading-relaxed">
                            Identity documents have been reviewed and approved.
                        </p>
                    </div>
                </div>
            )}

            {/* Admin Verification Review */}
            {isAdmin && (documentFrontUrl || documentBackUrl) && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                            <Eye className="h-5 w-5 text-slate-500" />
                            <h3 className="font-bold text-sm">Administrative Review: Document Preview</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">NIC Front View</span>
                            <div className="relative aspect-[1.586/1] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                                {documentFrontUrl ? (
                                    <Image
                                        src={documentFrontUrl}
                                        alt="NIC Front"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                        className="object-contain p-2 rounded-xl"
                                    />
                                ) : (
                                    <span className="text-xs text-slate-400">Front image missing</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">NIC Back View</span>
                            <div className="relative aspect-[1.586/1] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                                {documentBackUrl ? (
                                    <Image
                                        src={documentBackUrl}
                                        alt="NIC Back"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-contain p-2 rounded-xl"
                                    />
                                ) : (
                                    <span className="text-xs text-slate-400">Back image missing</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button
                            variant="outline"
                            disabled={isSubmitting || verificationStatus === 'rejected'}
                            onClick={() => setIsRejectModalOpen(true)}
                            className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold"
                        >
                            <XCircle className="mr-1.5 h-4 w-4" /> Reject Document
                        </Button>

                        <Button
                            disabled={isSubmitting || verificationStatus === 'verified'}
                            onClick={handleApprove}
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                        >
                            {isSubmitting ? (
                                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                            ) : (
                                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                            )}
                            {isSubmitting ? 'Processing...' : 'Approve Submission'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
                <DialogContent className="rounded-2xl max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2 text-rose-600">
                            <XCircle className="h-5 w-5" /> Reject NIC Verification
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            State the reason for rejecting this submission.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-2">
                        <Textarea
                            placeholder="e.g. Image blurry or document details mismatch..."
                            value={rejectReasonInput}
                            onChange={(e) => setRejectReasonInput(e.target.value)}
                            className="rounded-xl border-slate-200 text-xs min-h-[90px]"
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsRejectModalOpen(false)} className="rounded-xl text-xs font-bold">
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={!rejectReasonInput.trim() || isSubmitting}
                            onClick={handleConfirmReject}
                            className="rounded-xl text-xs font-bold"
                        >
                            {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}