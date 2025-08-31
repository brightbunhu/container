"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { Component } from '@/lib/types';

interface AddComponentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComponentAdded: () => void;
}

export function AddComponentDialog({ open, onOpenChange, onComponentAdded }: AddComponentDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 1,
    condition: 'GOOD',
    specs: {} as Record<string, any>,
    compatibilityTags: [] as string[],
  });
  const [newTag, setNewTag] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onComponentAdded();
        resetForm();
      } else {
        console.error('Failed to create component');
      }
    } catch (error) {
      console.error('Error creating component:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      quantity: 1,
      condition: 'GOOD',
      specs: {},
      compatibilityTags: [],
    });
    setNewTag('');
    setNewSpecKey('');
    setNewSpecValue('');
  };

  const addTag = () => {
    if (newTag.trim() && !formData.compatibilityTags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        compatibilityTags: [...prev.compatibilityTags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      compatibilityTags: prev.compatibilityTags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addSpec = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specs: { ...prev.specs, [newSpecKey.trim()]: newSpecValue.trim() }
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpec = (keyToRemove: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specs };
      delete newSpecs[keyToRemove];
      return { ...prev, specs: newSpecs };
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Component</DialogTitle>
          <DialogDescription>
            Add a new reusable hardware component to the inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Component Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., 16GB DDR4 RAM"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RAM">RAM</SelectItem>
                  <SelectItem value="HDD">HDD</SelectItem>
                  <SelectItem value="SSD">SSD</SelectItem>
                  <SelectItem value="PSU">PSU</SelectItem>
                  <SelectItem value="GPU">GPU</SelectItem>
                  <SelectItem value="MOTHERBOARD">Motherboard</SelectItem>
                  <SelectItem value="FAN">Fan</SelectItem>
                  <SelectItem value="CABLE">Cable</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value as 'GOOD' | 'FAIR' | 'POOR' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GOOD">Good</SelectItem>
                  <SelectItem value="FAIR">Fair</SelectItem>
                  <SelectItem value="POOR">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Compatibility Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="e.g., DDR4, Desktop"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            {formData.compatibilityTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.compatibilityTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Specifications</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                placeholder="e.g., Capacity"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpec())}
              />
              <Input
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                placeholder="e.g., 16GB"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpec())}
              />
            </div>
            <Button type="button" onClick={addSpec} variant="outline" size="sm">
              Add Spec
            </Button>
            {Object.keys(formData.specs).length > 0 && (
              <div className="space-y-2 mt-2">
                {Object.entries(formData.specs).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm font-medium">{key}: {value}</span>
                    <button
                      type="button"
                      onClick={() => removeSpec(key)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Component'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


