"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Monitor, Printer, ScanLine, Speaker, Cpu } from "lucide-react";
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

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/items');
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        }
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading items...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Items</h1>
          <p className="text-muted-foreground">
            Manage IT equipment and assets
          </p>
        </div>
        <Link href="/items/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => {
          const IconComponent = typeIcons[item.type as keyof typeof typeIcons] || Package;
          return (
            <Card key={item._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                  <Badge variant="outline" className={statusColors[item.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
                    {item.status || 'Unknown'}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{item.name || 'Unnamed Item'}</CardTitle>
                <CardDescription className="capitalize">
                  {item.type?.toLowerCase() || 'Unknown'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {item.assetTag && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Asset Tag:</span>
                      <span className="font-medium">{item.assetTag}</span>
                    </div>
                  )}
                  {item.location && item.location.site && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{item.location.site}</span>
                    </div>
                  )}
                  {item.specs && item.specs.model && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Model:</span>
                      <span className="font-medium">{item.specs.model}</span>
                    </div>
                  )}
                  {item.issueHistory && item.issueHistory.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Issues:</span>
                      <span className="font-medium">{item.issueHistory.length}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {items.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first item
            </p>
            <Link href="/items/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
