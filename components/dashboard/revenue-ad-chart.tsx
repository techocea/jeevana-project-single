'use client'

import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts'
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/components/ui/card'
import {RevenueAdData} from '@/app/actions/dashboard-actions';

export function RevenueAdChart({data = []}: { data: RevenueAdData[] }) {
    return (
        <Card className="bg-white shadow-sm border border-neutral-200/80 rounded-xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-neutral-900">Revenue & Paid Ads Posted</CardTitle>
                <CardDescription className="text-sm text-neutral-500">Track paid ad creations alongside total revenue
                    earned</CardDescription>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="h-[280px] flex items-center justify-center text-sm text-neutral-400">
                        No payments or ad postings recorded yet.
                    </div>
                ) : (
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{top: 10, right: 10, left: 0, bottom: 0}}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                <XAxis dataKey="date" axisLine={false} tickLine={false}
                                       tick={{fontSize: 12, fill: '#64748b'}}/>
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}}/>
                                {/*<Tooltip*/}
                                {/*    contentStyle={{*/}
                                {/*        backgroundColor: '#fff',*/}
                                {/*        borderRadius: '8px',*/}
                                {/*        border: '1px solid #e2e8f0'*/}
                                {/*    }}*/}
                                {/*    formatter={(value: number, name: string) => [*/}
                                {/*        name === 'revenue' ? `LKR ${value.toLocaleString()}` : `${value} Ads`,*/}
                                {/*        name === 'revenue' ? 'Revenue' : 'Paid Ads Posted'*/}
                                {/*    ]}*/}
                                {/*/>*/}
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    name="revenue"
                                    stroke="#10b981"
                                    strokeWidth={2.5}
                                    fill="url(#colorRev)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}