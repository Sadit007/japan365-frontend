"use client"

import React from "react"
import { SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"

export function SidebarBrand() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex shrink-0 size-8 items-center justify-center rounded-lg bg-[#BC002D] shadow-sm shadow-[#BC002D]/30">
            <span className="text-white font-bold text-sm select-none">J</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="font-bold text-sm tracking-tight text-foreground">
                Japan<span className="text-[#BC002D]">365</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">
                POS Dashboard
              </span>
            </div>
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
