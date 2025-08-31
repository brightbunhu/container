
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import { Separator } from "@/components/ui/separator";

const itemSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  type: z.enum(['COMPUTER', 'CPU', 'PRINTER', 'SCANNER', 'MONITOR', 'SPEAKER', 'OTHER']),
  assetTag: z.string().optional(),
  cpu: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),
  model: z.string().optional(),
  serial: z.string().optional(),
  site: z.string().min(1, { message: "Site is required." }),
  room: z.string().optional(),
  shelf: z.string().optional(),
  notes: z.string().optional(),
});

export default function AddItemPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      type: "COMPUTER",
      assetTag: "",
      cpu: "",
      ram: "",
      storage: "",
      model: "",
      serial: "",
      site: "Main Warehouse",
      room: "",
      shelf: "",
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof itemSchema>) {
    try {
      const newItem = {
        name: values.name,
        type: values.type,
        assetTag: values.assetTag,
        status: 'NEW' as const,
        specs: {
          cpu: values.cpu,
          ram: values.ram,
          storage: values.storage,
          model: values.model,
          serial: values.serial,
        },
        issueHistory: [],
        reusableParts: [],
        location: {
          site: values.site,
          room: values.room,
          shelf: values.shelf,
        },
        notes: values.notes,
      };

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        toast({
          title: "Item Added",
          description: `${values.name} has been successfully added.`,
        });
        router.push("/items");
      } else {
        throw new Error('Failed to add item');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
       <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mx-auto grid max-w-6xl flex-1 auto-rows-max gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                            <Link href="/items">
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Back</span>
                            </Link>
                        </Button>
                        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                            Add New ICT Item
                        </h1>
                        <div className="hidden items-center gap-2 md:ml-auto md:flex">
                            <Button type="submit" size="sm">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Save Item
                            </Button>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Item Details</CardTitle>
                                    <CardDescription>
                                    Enter the main details for the new ICT item.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Item Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Dell Latitude 5420" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="assetTag"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Asset Tag (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., DT-2024-123" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="notes"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Notes</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                placeholder="Any additional notes about this item"
                                                className="min-h-32"
                                                {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle>Specifications</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField 
                                            control={form.control} 
                                            name="model" 
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Model</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., Latitude 5420" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField 
                                            control={form.control} 
                                            name="serial" 
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Serial Number</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., S/N: ABC123XYZ" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField 
                                            control={form.control} 
                                            name="cpu" 
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>CPU</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., Intel Core i5-1135G7" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField 
                                            control={form.control} 
                                            name="ram" 
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>RAM</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., 16GB DDR4" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField 
                                            control={form.control} 
                                            name="storage" 
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Storage</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., 512GB NVMe SSD" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Type & Location</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Item Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select an item type" />
                                                        </SelectTrigger>
                                                    </FormControl>
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
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Separator />
                                    <FormField 
                                        control={form.control} 
                                        name="site" 
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Site</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Main Warehouse" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField 
                                        control={form.control} 
                                        name="room" 
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Room</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., A" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField 
                                        control={form.control} 
                                        name="shelf" 
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Shelf/Rack</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., 3B" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                     <div className="flex items-center justify-center gap-2 md:hidden">
                        <Button type="submit" size="sm" className="w-full">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Save Item
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
      </main>
    </div>
  );
}
