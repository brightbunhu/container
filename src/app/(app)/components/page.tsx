"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, HardDrive, MemoryStick, Zap, Monitor, Cable, Fan, Cpu } from 'lucide-react';
import { AddComponentDialog } from '@/components/pages/components/add-component-dialog';
import type { Component } from '@/lib/types';

const categoryIcons = {
  RAM: MemoryStick,
  HDD: HardDrive,
  SSD: HardDrive,
  PSU: Zap,
  GPU: Monitor,
  MOTHERBOARD: Cpu,
  FAN: Fan,
  CABLE: Cable,
  OTHER: Package,
};

const conditionColors = {
  GOOD: 'bg-green-100 text-green-800',
  FAIR: 'bg-yellow-100 text-yellow-800',
  POOR: 'bg-red-100 text-red-800',
};

export default function ComponentsPage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const fetchComponents = async () => {
    try {
      const response = await fetch('/api/components');
      if (response.ok) {
        const data = await response.json();
        setComponents(data);
      }
    } catch (error) {
      console.error('Failed to fetch components:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const handleComponentAdded = () => {
    fetchComponents();
    setIsAddDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading components...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Components</h1>
          <p className="text-muted-foreground">
            Manage reusable hardware components and parts
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Component
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {components.map((component) => {
          const IconComponent = categoryIcons[component.category as keyof typeof categoryIcons] || Package;
          return (
            <Card key={component._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                  <Badge variant="outline" className={conditionColors[component.condition as keyof typeof conditionColors] || 'bg-gray-100 text-gray-800'}>
                    {component.condition || 'Unknown'}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{component.name || 'Unnamed Component'}</CardTitle>
                <CardDescription className="capitalize">
                  {component.category?.toLowerCase() || 'Unknown'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium">{component.quantity || 0}</span>
                  </div>
                  {component.specs && Object.keys(component.specs).length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {Object.entries(component.specs).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key || 'Unknown'}:</span>
                          <span>{String(value || 'N/A')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {component.compatibilityTags && component.compatibilityTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {component.compatibilityTags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag || 'Unknown'}
                        </Badge>
                      ))}
                      {component.compatibilityTags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{component.compatibilityTags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {components.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No components found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first component
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Component
            </Button>
          </CardContent>
        </Card>
      )}

      <AddComponentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onComponentAdded={handleComponentAdded}
      />
    </div>
  );
}
