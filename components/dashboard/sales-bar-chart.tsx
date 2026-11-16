import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export type SalesPeriod = {
    /** Unique period identifier, e.g. "2026-11" or "2026-11-17". */
    period: string;

    /** Display label, e.g. "Nov" or "17 Nov". */
    label: string;

    /** Confirmed payment total in minor currency units. */
    salesMinor: number;

    /** Number of confirmed payments in this period. */
    paymentCount: number;
};

type SalesBarChartProps = {
    data: SalesPeriod[];

    /** Distinguishes unavailable reporting from a genuine zero. */
    isConnected?: boolean;

    currency?: string;
    locale?: string;
    minorUnitFactor?: number;
    periodLabel?: string;
};

export default function SalesBarChart({
                                          data,
                                          isConnected = false,
                                          currency = "LKR",
                                          locale = "en-LK",
                                          minorUnitFactor = 100,
                                          periodLabel = "Selected period",
                                      }: SalesBarChartProps) {
    const formatMoney = (amountMinor: number) =>
        new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amountMinor / minorUnitFactor);

    const totalSalesMinor = data.reduce(
        (total, item) => total + item.salesMinor,
        0,
    );

    const totalPayments = data.reduce(
        (total, item) => total + item.paymentCount,
        0,
    );

    const highestSalesMinor = Math.max(
        0,
        ...data.map((item) => item.salesMinor),
    );

    const averagePaymentMinor =
        totalPayments > 0
            ? totalSalesMinor / totalPayments
            : 0;

    const hasPeriods = data.length > 0;

    const summaryItems = [
        {
            label: "Confirmed sales",
            value: formatMoney(totalSalesMinor),
        },
        {
            label: "Successful payments",
            value: totalPayments.toLocaleString(locale),
        },
        {
            label: "Average payment",
            value: formatMoney(averagePaymentMinor),
        },
    ];

    return (
        <Card className="h-full">
            <CardHeader className="border-b border-border/60 pb-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                        <CardTitle className="text-base">
                            Sales overview
                        </CardTitle>

                        <CardDescription className="text-xs">
                            Confirmed payment totals by period.
                        </CardDescription>
                    </div>

                    <span className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                        {isConnected
                            ? periodLabel
                            : "Reporting not connected"}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 ">
                {/* Summary */}
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {summaryItems.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-lg border border-border/60 bg-muted/20 px-3 py-3"
                        >
                            <dt className="text-[11px] text-muted-foreground">
                                {item.label}
                            </dt>

                            <dd className="mt-1 text-lg font-semibold tabular-nums tracking-tight text-foreground">
                                {isConnected ? item.value : "—"}
                            </dd>
                        </div>
                    ))}
                </dl>

                {!isConnected ? (
                    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 text-center">
                        <p className="text-sm font-medium text-foreground">
                            Sales reporting is not connected yet
                        </p>

                        <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
                            Confirmed payment data will appear here
                            once payment reporting is integrated.
                        </p>
                    </div>
                ) : !hasPeriods ? (
                    <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            No sales reporting periods available.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                            <span>Confirmed sales · {currency}</span>

                            {highestSalesMinor === 0 ? (
                                <span>
                                    No confirmed payments in this period
                                </span>
                            ) : (
                                <span>
                                    Highest period:{" "}
                                    {formatMoney(highestSalesMinor)}
                                </span>
                            )}
                        </div>

                        <div
                            role="region"
                            aria-label="Sales chart, scroll horizontally to view all periods"
                            tabIndex={0}
                            className="overflow-x-auto rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <ul
                                aria-label="Confirmed sales by period"
                                className="grid min-w-full gap-3 pb-2"
                                style={{
                                    gridTemplateColumns: `repeat(${data.length}, minmax(80px, 1fr))`,
                                }}
                            >
                                {data.map((item) => {
                                    const heightPercentage =
                                        highestSalesMinor > 0
                                            ? (item.salesMinor /
                                                highestSalesMinor) *
                                            100
                                            : 0;

                                    return (
                                        <li
                                            key={item.period}
                                            className="min-w-0 text-center"
                                        >
                                            <p className="mb-2 whitespace-nowrap text-[10px] font-medium tabular-nums text-foreground">
                                                {formatMoney(
                                                    item.salesMinor,
                                                )}
                                            </p>

                                            <div
                                                aria-hidden="true"
                                                className="relative h-44 border-b border-border"
                                            >
                                                <div className="absolute inset-x-0 top-0 border-t border-dashed border-border/50" />
                                                <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-border/50" />

                                                <div className="absolute inset-0 flex items-end justify-center px-3">
                                                    <div
                                                        className="relative w-full max-w-12 rounded-t-md bg-primary"
                                                        style={{
                                                            height: `${heightPercentage}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <p className="mt-2 text-[11px] font-medium text-foreground">
                                                {item.label}
                                            </p>

                                            <p className="mt-1 text-[10px] tabular-nums text-muted-foreground">
                                                {item.paymentCount}{" "}
                                                {item.paymentCount === 1
                                                    ? "payment"
                                                    : "payments"}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                )}

                <p className="border-t border-border/60 pt-3 text-[11px] leading-relaxed text-muted-foreground">
                    Confirmed payment totals before refunds and
                    processing fees. Pending and failed payments
                    are excluded. This is not a profit or payout
                    report.
                </p>
            </CardContent>
        </Card>
    );
}