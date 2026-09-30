'use client'

import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend} from 'recharts'
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/components/ui/card'
import {DemographicData} from '@/app/actions/dashboard-actions';
import * as React from "react";

const GENDER_COLORS: Record<string, string> = {
    Male: '#3b82f6',   // Blue
    Female: '#ec4899', // Pink
}

export function DemographicsChart({data = []}: { data: DemographicData[] }) {
    const totalUsers = data.reduce((acc, curr) => acc + curr.count, 0)


    return (
        <Card className="bg-white shadow-sm border border-neutral-200/80 rounded-xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-neutral-900">Advertiser Demographics</CardTitle>
                <CardDescription className="text-xs text-neutral-500">Gender distribution of registered account
                    holders</CardDescription>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="h-[240px] flex items-center justify-center text-sm text-neutral-400">
                        No demographic data found.
                    </div>
                ) : (
                    <div className="h-[240px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={85}
                                    paddingAngle={4}
                                    dataKey="count"
                                    nameKey="gender"
                                >
                                    {data.map((entry) => (
                                        <Cell
                                            key={`cell-${entry.gender}`}
                                            fill={GENDER_COLORS[entry.gender] || '#94a3b8'}
                                            stroke="none"
                                        />
                                    ))}
                                </Pie>
                                {/*<ChartTooltip*/}
                                {/*    cursor={false}*/}
                                {/*    content={*/}
                                {/*        <ChartTooltipContent*/}
                                {/*            /!* eslint-disable-next-line @typescript-eslint/ban-ts-comment *!/*/}
                                {/*            // @ts-expect-error*/}
                                {/*            labelFormatter={(value: number) => [*/}
                                {/*                `${value} users (${totalUsers > 0 ? ((value / totalUsers) * 100).toFixed(1) : 0}%)`*/}
                                {/*            ]}*/}
                                {/*            indicator="dot"*/}
                                {/*        />*/}
                                {/*    }*/}
                                {/*/>*/}
                                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Centered Total Overlay */}
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                            <span className="text-2xl font-bold text-neutral-900">{totalUsers}</span>
                            <span className="text-[10px] uppercase font-semibold text-neutral-400">Total Users</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}