"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function AddItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    assetTag: '',
    name: '',
    type: '',
    status: 'ALIVE',
    specs: {
      cpu: '',
      ram: '',
      storage: '',
      model: '',
      serial: '',
    },
    location: {
      site: '',
      room: '',
      shelf: '',
    },
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/items');
      } else {
        console.error('Failed to create item');
      }
    } catch (error) {
      console.error('Error creating item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/items">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Items
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Item</h1>
          <p className="text-muted-foreground">
            Add a new piece of equipment to the inventory
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Item Information</CardTitle>
          <CardDescription>
            Enter the details for the new equipment item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assetTag">Asset Tag</Label>
                <Input
                  id="assetTag"
                  value={formData.assetTag}
                  onChange={(e) => setFormData(prev => ({ ...prev, assetTag: e.target.value }))}
                  placeholder="e.g., DT-2023-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Dell Optiplex 7080"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPUTER">Computer</SelectItem>
                    <SelectItem value="CPU">CPU</SelectItem>
                    <SelectItem value="PRINTER">Printer</SelectItem>
                    <SelectItem value="SCANNER">Scanner</SelectItem>
                    <SelectItem value="MONITOR">Monitor</SelectItem>
                    <SelectItem value="SPEAKER">Speaker</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="OLD">Old</SelectItem>
                    <SelectItem value="ALIVE">Alive</SelectItem>
                    <SelectItem value="DEAD">Dead</SelectItem>
                    <SelectItem value="PHASED_OUT">Phased Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpu">CPU</Label>
                  <Input
                    id="cpu"
                    value={formData.specs.cpu}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      specs: { ...prev.specs, cpu: e.target.value }
                    }))}
                    placeholder="e.g., Intel Core i7-10700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ram">RAM</Label>
                  <Input
                    id="ram"
                    value={formData.specs.ram}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      specs: { ...prev.specs, ram: e.target.value }
                    }))}
                    placeholder="e.g., 16GB DDR4"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage">Storage</Label>
                  <Input
                    id="storage"
                    value={formData.specs.storage}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      specs: { ...prev.specs, storage: e.target.value }
                    }))}
                    placeholder="e.g., 512GB SSD"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.specs.model}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      specs: { ...prev.specs, model: e.target.value }
                    }))}
                    placeholder="e.g., Optiplex 7080"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serial">Serial Number</Label>
                  <Input
                    id="serial"
                    value={formData.specs.serial}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      specs: { ...prev.specs, serial: e.target.value }
                    }))}
                    placeholder="e.g., S/N: 12345ABC"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site">Site</Label>
                  <Input
                    id="site"
                    value={formData.location.site}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, site: e.target.value }
                    }))}
                    placeholder="e.g., Main Office"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room">Room</Label>
                  <Input
                    id="room"
                    value={formData.location.room}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, room: e.target.value }
                    }))}
                    placeholder="e.g., IT Department"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shelf">Shelf</Label>
                  <Input
                    id="shelf"
                    value={formData.location.shelf}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, shelf: e.target.value }
                    }))}
                    placeholder="e.g., A1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about the item..."
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Adding...' : 'Add Item'}
              </Button>
              <Link href="/items">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


