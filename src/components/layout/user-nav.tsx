"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth";
import { Check, LogOut, User as UserIcon, Loader2 } from "lucide-react";

export function UserNav() {
  const { user, users, setUser, logout, loading } = useAuth();

  // Show loading state while auth is initializing
  if (loading || !user) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full" disabled>
        <Avatar className="h-9 w-9">
          <AvatarFallback>
            <Loader2 className="h-4 w-4 animate-spin" />
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">Switch User</DropdownMenuLabel>
             {users.map((u) => (
                <DropdownMenuItem key={u._id} onSelect={() => setUser(u)}>
                    <div className="flex items-center justify-between w-full">
                        <span>{u.name} ({u.role})</span>
                        {user._id === u._id && <Check className="h-4 w-4" />}
                    </div>
                </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={logout}>
            <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
