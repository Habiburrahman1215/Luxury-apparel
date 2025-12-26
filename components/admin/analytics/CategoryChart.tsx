'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface CategoryData {
    category: string
    value: number
    revenue: number
}

interface CategoryChartProps {
    data: CategoryData[]
}

const COLORS = ['#1f2937', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb']

export default function CategoryChart({ data }: CategoryChartProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-serif text-2xl mb-6">Sales by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data as any}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => `${entry.category} ${(entry.percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: any, name: any, props: any) => [
                            `${value} items ($${(props.payload.revenue / 100).toFixed(2)})`,
                            props.payload.category
                        ]}
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '4px',
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
