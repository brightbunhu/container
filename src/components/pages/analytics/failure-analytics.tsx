
"use client";

import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const failureData = [
  { name: "Power Supply Unit Failure", value: 400, color: "hsl(var(--chart-1))" },
  { name: "Hard Drive Corruption", value: 300, color: "hsl(var(--chart-2))" },
  { name: "RAM Malfunction", value: 250, color: "hsl(var(--chart-3))" },
  { name: "Motherboard Issue", value: 200, color: "hsl(var(--chart-4))" },
  { name: "Software/OS Error", value: 278, color: "hsl(var(--chart-5))" },
];

export function FailureAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Common Failure Causes</CardTitle>
        <CardDescription>Analysis of the most frequent root causes for item failures.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={failureData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                innerRadius={80}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={5}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (
                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
                            {`${(percent * 100).toFixed(0)}%`}
                        </text>
                    );
                }}
                >
                {failureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                ))}
                </Pie>
                <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    borderColor: 'hsl(var(--border))'
                }}
                />
                <Legend
                iconSize={12}
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ right: 0, fontSize: "14px", lineHeight: '24px' }}
                />
            </PieChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
