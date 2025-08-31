"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Loader2, Package, Monitor, Printer, ScanLine, Speaker, Cpu } from "lucide-react";
import type { Item } from '@/lib/types';

const typeIcons = {
  COMPUTER: Package,
  CPU: Cpu,
  PRINTER: Printer,
  SCANNER: ScanLine,
  MONITOR: Monitor,
  SPEAKER: Speaker,
  OTHER: Package,
};

const statusColors = {
  NEW: 'bg-green-100 text-green-800',
  OLD: 'bg-gray-100 text-gray-800',
  ALIVE: 'bg-blue-100 text-blue-800',
  DEAD: 'bg-red-100 text-red-800',
  PHASED_OUT: 'bg-yellow-100 text-yellow-800',
};

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchItem(params.id as string);
    }
  }, [params.id]);

  const fetchItem = async (id: string) => {
    try {
      const response = await fetch(`/api/items/${id}`);
      if (response.ok) {
        const data = await response.json();
        setItem(data);
      } else if (response.status === 404) {
        router.push('/items');
      }
    } catch (error) {
      console.error('Failed to fetch item:', error);
      router.push('/items');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg">Loading item...</span>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Item not found</h1>
          <p className="text-muted-foreground mb-4">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push('/items')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Items
          </Button>
        </div>
      </div>
    );
  }

  const IconComponent = typeIcons[item.type as keyof typeof typeIcons] || Package;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.push('/items')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Items
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <IconComponent className="h-8 w-8 text-muted-foreground" />
              <Badge variant="outline" className={statusColors[item.status as keyof typeof statusColors]}>
                {item.status}
              </Badge>
            </div>
                            <CardTitle className="text-2xl">{item.name || 'Unnamed Item'}</CardTitle>
            <CardDescription className="capitalize text-lg">
              {item.type?.toLowerCase() || 'Unknown'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {item.assetTag && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Asset Tag:</span>
                <span className="font-medium">{item.assetTag}</span>
              </div>
            )}
            {item.location && item.location.site && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{item.location.site}</span>
              </div>
            )}
            {item.specs && (
              <>
                {item.specs.model && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model:</span>
                    <span className="font-medium">{item.specs.model}</span>
                  </div>
                )}
                {item.specs.serial && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Serial:</span>
                    <span className="font-medium">{item.specs.serial}</span>
                  </div>
                )}
                {item.specs.cpu && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CPU:</span>
                    <span className="font-medium">{item.specs.cpu}</span>
                  </div>
                )}
                {item.specs.ram && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RAM:</span>
                    <span className="font-medium">{item.specs.ram}</span>
                  </div>
                )}
                {item.specs.storage && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Storage:</span>
                    <span className="font-medium">{item.specs.storage}</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {item.notes && (
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{item.notes}</p>
              </div>
            )}
            
            {item.issueHistory && item.issueHistory.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Issue History</h3>
                <div className="space-y-2">
                  {item.issueHistory.map((issue, index) => (
                    <div key={index} className="text-sm p-2 bg-muted rounded">
                      <div className="font-medium">{issue.description || 'No description'}</div>
                      <div className="text-muted-foreground">
                        {issue.reportedAt ? new Date(issue.reportedAt).toLocaleDateString() : 'Unknown date'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown date'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="font-medium">
                {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'Unknown date'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
