import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
    switch (status) {
        case "approved":
            return (
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100">
                    {status}
                </Badge>
            );
        case "approved":
            return (
                <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-800  dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100">
                    {status}
                </Badge>
            );
        case "rejected":
            return (
                <Badge className="bg-rose-100 text-rose-800 border border-rose-800 dark:bg-rose-900/30 dark:text-rose-400 hover:bg-rose-100">
                    {status}
                </Badge>
            );
        case "pending":
            return (
                <Badge className="bg-amber-100 text-amber-800 border border-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100">
                    {status}
                </Badge>
            );
        default:
            null;
    }
};

export const getScoreBadgeStyle = (score: number) => {
    if (score >= 80) return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    if (score >= 60) return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
    return "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800";
};
