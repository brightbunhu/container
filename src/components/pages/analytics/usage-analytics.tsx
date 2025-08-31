
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const data30days = [
    { name: 'RAM', total: 55 },
    { name: 'SSD', total: 65 },
    { name: 'PSU', total: 32 },
    { name: 'GPU', total: 38 },
    { name: 'Motherboard', total: 20 },
    { name: 'Fan', total: 45 },
    { name: 'Cable', total: 80 },
];
const data6months = [
    { name: 'RAM', total: 200 },
    { name: 'SSD', total: 290 },
    { name: 'PSU', total: 150 },
    { name: 'GPU', total: 140 },
    { name: 'Motherboard', total: 90 },
    { name: 'Fan', total: 180 },
    { name: 'Cable', total: 350 },
];
const data1year = [
    { name: 'RAM', total: 400 },
    { name: 'SSD', total: 550 },
    { name: 'PSU', total: 310 },
    { name: 'GPU', total: 280 },
    { name: 'Motherboard', total: 180 },
    { name: 'Fan', total: 360 },
    { name: 'Cable', total: 700 },
];

type Period = "30d" | "6m" | "1y";

const dataMap = {
    "30d": data30days,
    "6m": data6months,
    "1y": data1year,
};

export function UsageAnalytics() {
  const [period, setPeriod] = useState<Period>("6m");
  const data = dataMap[period].sort((a, b) => b.total - a.total);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Components Used</CardTitle>
        <CardDescription>Number of components used in repairs and builds.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
            <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="6m">Last 6 months</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} tickLine={false} axisLine={false} />
                <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    borderColor: 'hsl(var(--border))'
                }}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
