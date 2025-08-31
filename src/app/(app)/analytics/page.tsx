
"use client";

import { useAuth } from "@/context/auth";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsageAnalytics } from "@/components/pages/analytics/usage-analytics";
import { FailureAnalytics } from "@/components/pages/analytics/failure-analytics";
import { ForecastAnalytics } from "@/components/pages/analytics/forecast-analytics";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const { hasRole } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
        <div className="flex flex-col gap-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-8 w-2/3" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    )
  }

  if (!hasRole(['HOS', 'HOD', 'ADMIN'])) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>You do not have permission to view this page.</CardDescription>
            </CardHeader>
        </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold font-headline">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Insights into component usage, failures, and future forecasts.</p>
      </div>
      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Component Usage</TabsTrigger>
          <TabsTrigger value="failures">Failure Analysis</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasting</TabsTrigger>
        </TabsList>
        <TabsContent value="usage">
          <UsageAnalytics />
        </TabsContent>
        <TabsContent value="failures">
          <FailureAnalytics />
        </TabsContent>
        <TabsContent value="forecasts">
          <ForecastAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
