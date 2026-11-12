"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {
    AgeDemographic,
    ProvinceDemographic,
    MonthlyMetric,
} from "@/app/actions/dashboard-actions";

interface ControlPanelChartsProps {
    ageData: AgeDemographic[];
    provinceData: ProvinceDemographic[];
    revenueData: MonthlyMetric[];
    salesAdsData: MonthlyMetric[];
}

export function ControlPanelCharts({
    ageData,
    provinceData,
    revenueData,
    salesAdsData,
}: ControlPanelChartsProps) {
    const ageColors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];
    const provinceColors = ["#0284c7", "#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd", "#e0f2fe"];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Demographics by Age */}
            <Card className="bg-white shadow-xs border border-neutral-200/80 rounded-xl min-h-[380px] flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-neutral-900">
                        Demographics by Age
                    </CardTitle>
                    <CardDescription className="text-xs text-neutral-500">
                        Distribution of registered candidates categorized across primary age brackets
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pt-4">
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ageData} margin={{top: 15, right: 15, left: -10, bottom: 5}}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="ageGroup"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fontSize: 12, fill: "#64748b"}}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fontSize: 12, fill: "#64748b"}}
                                />
                                <Tooltip
                                    cursor={{fill: "#f8fafc"}}
                                    formatter={(value: any) => [`${value} Candidates`, "Count"]}
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: "8px",
                                        border: "1px solid #e2e8f0",
                                        fontSize: "12px",
                                    }}
                                />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                                    {ageData.map((_, index) => (
                                        <Cell
                                            key={`age-cell-${index}`}
                                            fill={ageColors[index % ageColors.length]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Demographics by Province */}
            <Card className="bg-white shadow-xs border border-neutral-200/80 rounded-xl min-h-[380px] flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-neutral-900">
                        Demographics by Province
                    </CardTitle>
                    <CardDescription className="text-xs text-neutral-500">
                        Regional distribution of candidate profiles by Sri Lankan province
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pt-4">
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={provinceData}
                                layout="vertical"
                                margin={{top: 10, right: 20, left: 30, bottom: 5}}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis
                                    type="number"
                                    allowDecimals={false}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fontSize: 12, fill: "#64748b"}}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="province"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fontSize: 11, fill: "#334155"}}
                                    width={110}
                                />
                                <Tooltip
                                    cursor={{fill: "#f8fafc"}}
                                    formatter={(value: any) => [`${value} Profiles`, "Candidates"]}
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: "8px",
                                        border: "1px solid #e2e8f0",
                                        fontSize: "12px",
                                    }}
                                />
                                <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
                                    {provinceData.map((_, index) => (
                                        <Cell
                                            key={`prov-cell-${index}`}
                                            fill={provinceColors[index % provinceColors.length]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* 3. Settled Revenue Bar Chart */}
            <Card className="bg-white shadow-xs border border-neutral-200/80 rounded-xl min-h-[380px] flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-neutral-900">
                        Settled Revenue Over the Months
                    </CardTitle>
                    <CardDescription className="text-xs text-neutral-500">
                        Monthly processed revenue in Sri Lankan Rupees (LKR) from paid membership tiers
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pt-4">
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData} margin={{top: 15, right: 15, left: 10, bottom: 5}}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fontSize: 12, fill: "#64748b"}}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fontSize: 11, fill: "#64748b"}}
                                    tickFormatter={(val) => `LKR ${(val / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    cursor={{fill: "#f8fafc"}}
                                    formatter={(value: any) => [`LKR ${Number(value).toLocaleString()}`, "Settled Revenue"]}
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: "8px",
                                        border: "1px solid #e2e8f0",
                                        fontSize: "12px",
                                    }}
                                />
                                <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={44} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* 4. Count of Sales Ads Over the Months */}
            <Card className="bg-white shadow-xs border border-neutral-200/80 rounded-xl min-h-[380px] flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-neutral-900">
                        Sales Ads Created Over the Months
                    </CardTitle>
                    <CardDescription className="text-xs text-neutral-500">
                        Total candidate advertisements and proposal portfolios created by month
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pt-4">
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesAdsData} margin={{top: 15, right: 15, left: -10, bottom: 5}}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fontSize: 12, fill: "#64748b"}}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fontSize: 12, fill: "#64748b"}}
                                />
                                <Tooltip
                                    cursor={{fill: "#f8fafc"}}
                                    formatter={(value: any) => [`${value} New Ads`, "Count"]}
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: "8px",
                                        border: "1px solid #e2e8f0",
                                        fontSize: "12px",
                                    }}
                                />
                                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={44} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
