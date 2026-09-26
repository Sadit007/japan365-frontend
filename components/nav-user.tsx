"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LogOutIcon } from "lucide-react"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* Static user info row - no dropdown */}
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md">
          <Avatar className="size-7 shrink-0">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-[#BC002D] text-white text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
            <span className="truncate font-medium text-sidebar-foreground">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      </SidebarMenuItem>

      {/* Log out action */}
      <SidebarMenuItem>
        <SidebarMenuButton
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          tooltip="Log out"
        >
          <LogOutIcon className="size-4" />
          <span>Log out</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
