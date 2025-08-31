"use client";

import { useState, useEffect } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Item, User } from '@/lib/types';

export function RecentIssues() {
  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, usersRes] = await Promise.all([
          fetch('/api/items'),
          fetch('/api/users'),
        ]);

        if (itemsRes.ok && usersRes.ok) {
          const itemsData = await itemsRes.json();
          const usersData = await usersRes.json();
          setItems(itemsData);
          setUsers(usersData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Issues</CardTitle>
          <CardDescription>
            A log of the most recently reported issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const recentIssues = items.filter(i => i.issueHistory && i.issueHistory.length > 0).slice(0, 5);

  if (recentIssues.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Issues</CardTitle>
          <CardDescription>
            A log of the most recently reported issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No recent issues found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Issues</CardTitle>
        <CardDescription>
          A log of the most recently reported issues.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        {recentIssues.map((item) => {
            const issue = item.issueHistory[0];
            const reporter = users.find(u => u.name === issue.reportedBy);
            return (
                <div key={item._id} className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src={reporter?.avatar} alt="Avatar" />
                    <AvatarFallback>{reporter?.name?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                    {item.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                    {issue.description}
                    </p>
                </div>
                <div className="ml-auto font-medium text-sm">
                    {new Date(issue.createdAt).toLocaleDateString()}
                </div>
                </div>
            )
        })}
      </CardContent>
    </Card>
  );
}
