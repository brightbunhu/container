"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, Wrench, CheckCircle } from "lucide-react";

interface DashboardStats {
  totalItems: number;
  activeIssues: number;
  reusableParts: number;
  resolvedTickets: number;
}

export function DashboardCards() {
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    activeIssues: 0,
    reusableParts: 0,
    resolvedTickets: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [itemsRes, componentsRes, workLogsRes] = await Promise.all([
          fetch('/api/items'),
          fetch('/api/components'),
          fetch('/api/work-logs'),
        ]);

        const items = await itemsRes.json();
        const components = await componentsRes.json();
        const workLogs = await workLogsRes.json();

        // Calculate active issues from items
        const activeIssues = items.reduce((total: number, item: any) => {
          return total + (item.issueHistory?.filter((issue: any) => 
            issue.severity === 'HIGH' || issue.severity === 'MEDIUM'
          ).length || 0);
        }, 0);

        // Calculate resolved tickets
        const resolvedTickets = workLogs.filter((log: any) => 
          log.status === 'RESOLVED' || log.status === 'CLOSED'
        ).length;

        setStats({
          totalItems: items.length,
          activeIssues,
          reusableParts: components.length,
          resolvedTickets,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cardData = [
    {
      title: "Total Items",
      value: loading ? "..." : stats.totalItems.toString(),
      change: "Total equipment tracked",
      icon: Package,
    },
    {
      title: "Active Issues",
      value: loading ? "..." : stats.activeIssues.toString(),
      change: "High and medium priority",
      icon: AlertTriangle,
    },
    {
      title: "Reusable Parts",
      value: loading ? "..." : stats.reusableParts.toString(),
      change: "Available components",
      icon: Wrench,
    },
    {
      title: "Resolved Tickets",
      value: loading ? "..." : stats.resolvedTickets.toString(),
      change: "Completed work orders",
      icon: CheckCircle,
    },
  ];

  return (
    <>
      {cardData.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.change}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
