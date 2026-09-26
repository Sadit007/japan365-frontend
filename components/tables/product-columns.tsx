"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ProductDetailed } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Plus, Edit, Trash, Package } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export const productColumns: ColumnDef<ProductDetailed>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    )
  },
  {
    accessorKey: "brand_name",
    header: "Brand",
    cell: ({ row }) => row.getValue("brand_name") || "—",
  },
  {
    accessorKey: "category_name",
    header: "Category",
    cell: ({ row }) => row.getValue("category_name") || "—",
  },
  {
    id: "total_stock",
    header: "Total Stock",
    cell: ({ row }) => {
      const product = row.original
      const variations = product.variations || []
      const totalStock = variations.reduce((sum, v) => sum + (v.current_stock || 0), 0)
      
      const isLowStock = totalStock <= product.alert_quantity

      return (
        <span className={isLowStock ? "text-red-500 font-bold" : "text-green-600 font-medium"}>
          {totalStock} {product.unit}
        </span>
      )
    }
  },
  {
    id: "price_range",
    header: "Selling Price",
    cell: ({ row }) => {
      const variations = row.original.variations || []
      if (variations.length === 0) return "—"
      
      const prices = variations.map(v => Number(v.selling_price))
      const min = Math.min(...prices)
      const max = Math.max(...prices)
      
      return min === max 
        ? `$${min.toFixed(2)}` 
        : `$${min.toFixed(2)} - $${max.toFixed(2)}`
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id.toString())}>
              Copy Product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href={`/products/${product.id}/variations/add`}>
              <DropdownMenuItem className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" /> Add Variation
              </DropdownMenuItem>
            </Link>
            <Link href={`/products/${product.id}/stock`}>
              <DropdownMenuItem className="cursor-pointer">
                <Package className="mr-2 h-4 w-4" /> Manage Stock
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]