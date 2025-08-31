
"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Label } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for component demand forecast
const forecastData = [
  // Historical data
  { month: "Apr", RAM: 18, SSD: 48, },
  { month: "May", RAM: 23, SSD: 38, },
  { month: "Jun", RAM: 28, SSD: 42, },
  // Forecasted data
  { month: "Jul", RAM: 32, SSD: 45, },
  { month: "Aug", RAM: 35, SSD: 48, },
  { month: "Sep", RAM: 38, SSD: 50, },
];

export function ForecastAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Component Demand Forecast</CardTitle>
        <CardDescription>Projected demand for key components over the next 3 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    borderColor: 'hsl(var(--border))'
                }}
                />
                <Legend wrapperStyle={{fontSize: "14px", paddingTop: '20px'}}/>
                <Line type="monotone" dataKey="RAM" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="SSD" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                
                <ReferenceLine x="Jun" stroke="hsl(var(--border))" strokeDasharray="3 3">
                    <Label value="Forecast" position="insideTopRight" fill="hsl(var(--muted-foreground))" fontSize={12} />
                </ReferenceLine>
            </LineChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
