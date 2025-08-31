
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { KnowledgeBase } from "@/lib/types";
import { MoreHorizontal, Check, X } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type KnowledgeBaseColumnsProps = {
  handleStatusChange: (id: string, status: 'APPROVED' | 'REJECTED') => void;
};

const statusVariantMap: { [key in KnowledgeBase['status']]: "default" | "secondary" | "destructive" | "outline" } = {
    PENDING: 'outline',
    APPROVED: 'secondary',
    REJECTED: 'destructive',
};

export const getColumns = ({ handleStatusChange }: KnowledgeBaseColumnsProps): ColumnDef<KnowledgeBase>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
        const kb = row.original;
        return <Link href={`/kb/${kb._id}`} className="font-medium hover:underline">{kb.title}</Link>
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as KnowledgeBase['status'];
        return <Badge variant={statusVariantMap[status]}>{status}</Badge>
    },
  },
  {
    accessorKey: "productType",
    header: "Product Type",
  },
  {
    accessorKey: "createdBy",
    header: "Author",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const kb = row.original;

      return (
        <div className="text-right">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/kb/${kb._id}`}>View article</Link>
                </DropdownMenuItem>
                {kb.status === 'PENDING' && (
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleStatusChange(kb._id, 'APPROVED')}>
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(kb._id, 'REJECTED')} className="focus:text-destructive-foreground focus:bg-destructive/90 text-destructive">
                    <X className="mr-2 h-4 w-4" />
                    Reject
                    </DropdownMenuItem>
                </>
                )}
                 <DropdownMenuSeparator />
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem className="focus:text-destructive-foreground focus:bg-destructive/90 text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    },
  },
];
