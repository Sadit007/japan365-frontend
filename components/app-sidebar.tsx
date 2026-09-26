"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { SidebarBrand } from "@/components/sidebar-brand"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  PackageIcon,
  TagIcon,
  MapPinIcon,
  LayoutGridIcon,
} from "lucide-react"

const data = {
  user: {
    name: "Admin",
    email: "admin@japan365.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Products",
      url: "/products",
      icon: <PackageIcon />,
      isActive: true,
      items: [
        { title: "All Products", url: "/products" },
        { title: "Add Product", url: "/products/add" },
      ],
    },
    {
      title: "Brands",
      url: "/brands",
      icon: <TagIcon />,
      items: [
        { title: "All Brands", url: "/brands" },
        { title: "Manage Brands", url: "/brands/manage" },
      ],
    },
    {
      title: "Locations",
      url: "/locations",
      icon: <MapPinIcon />,
      items: [
        { title: "All Locations", url: "/locations" },
        { title: "Manage Locations", url: "/locations/manage" },
      ],
    },
    {
      title: "Categories",
      url: "/categories",
      icon: <LayoutGridIcon />,
      items: [
        { title: "All Categories", url: "/categories" },
        { title: "Add Category", url: "/categories/manage" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarBrand />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
