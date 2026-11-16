import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export type AgeDemographic = {
    ageGroup: string;
    count: number;
};

type AgeDemographicsChartProps = {
    data: AgeDemographic[];
};

export default function AgeDemographicsChart({
                                                 data,
                                             }: AgeDemographicsChartProps) {
    const totalMembers = data.reduce(
        (total, item) => total + item.count,
        0,
    );

    return (
        <Card className="h-full">
            <CardHeader className="border-b border-border/60 pb-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <CardTitle className="text-base">
                            Age distribution
                        </CardTitle>

                        <CardDescription className="text-xs">
                            Members grouped by age bracket.
                        </CardDescription>
                    </div>

                    <span className="shrink-0 rounded-md bg-muted px-2.5 py-1 text-xs font-medium tabular-nums text-foreground">
                        {totalMembers.toLocaleString()} members
                    </span>
                </div>
            </CardHeader>

            <CardContent>
                {totalMembers === 0 ? (
                    <div className="flex min-h-56 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            No age distribution data available.
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-5">
                        {data.map((item) => {
                            const percentage =
                                (item.count / totalMembers) * 100;

                            return (
                                <li
                                    key={item.ageGroup}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between gap-3 text-xs">
                                        <span className="font-medium text-foreground">
                                            {item.ageGroup} years
                                        </span>

                                        <div className="flex shrink-0 items-center gap-3 tabular-nums">
                                            <span className="font-semibold text-foreground">
                                                {item.count.toLocaleString()}
                                            </span>

                                            <span className="w-12 text-right text-muted-foreground">
                                                {percentage.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        aria-hidden="true"
                                        className="h-2.5 overflow-hidden rounded-full bg-muted"
                                    >
                                        <div
                                            className="h-full rounded-full bg-primary"
                                            style={{
                                                width: `${percentage}%`,
                                            }}
                                        />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

                <p className="mt-5 border-t border-border/60 pt-3 text-[11px] leading-relaxed text-muted-foreground">
                    Percentages are based on members included in
                    the supplied age groups.
                </p>
            </CardContent>
        </Card>
    );
}