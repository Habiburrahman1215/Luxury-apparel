'use client'

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatPrice } from '@/lib/utils'

interface RevenueData {
    date: string
    revenue: number
}

interface RevenueChartProps {
    data: RevenueData[]
}

export default function RevenueChart({ data }: RevenueChartProps) {
    const formattedData = useMemo(() => {
        return data.map(item => ({
            ...item,
            displayRevenue: item.revenue / 100, // Convert cents to dollars
        }))
    }, [data])

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-serif text-2xl mb-6">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        formatter={(value: number | undefined) => [`$${(value || 0).toFixed(2)}`, 'Revenue']}
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '4px',
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="displayRevenue"
                        stroke="#1f2937"
                        strokeWidth={2}
                        dot={{ fill: '#1f2937', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
