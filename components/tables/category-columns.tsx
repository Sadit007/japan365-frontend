"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Category } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash, Plus, CornerDownRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { deleteCategory } from "@/lib/actions"
import { useState } from "react"

// Extend standard Category type just for the table view
export type CategoryTableRow = Category & { isSub?: boolean; parent_name?: string };

const ActionCell = ({ category }: { category: CategoryTableRow }) => {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) return;
    try {
      setIsDeleting(true);
      await deleteCategory(category.id);
      toast.success("Category Deleted");
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to delete", { description: error.message });
    } finally {
      setIsDeleting(false);
    }
  }

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
        <DropdownMenuSeparator />
        
        {/* Only show "Add Subcategory" if it's a top-level category */}
        {!category.isSub && (
          <Link href={`/categories/manage?parent_id=${category.id}`}>
            <DropdownMenuItem className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" /> Add Subcategory
            </DropdownMenuItem>
          </Link>
        )}
        
        <Link href={`/categories/manage?id=${category.id}`}>
          <DropdownMenuItem className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
        </Link>
        
        <DropdownMenuItem 
          onClick={handleDelete} 
          disabled={isDeleting}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          <Trash className="mr-2 h-4 w-4" /> 
          {isDeleting ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const categoryColumns: ColumnDef<CategoryTableRow>[] = [
  {
    accessorKey: "name",
    header: "Category Name",
    cell: ({ row }) => {
      const isSub = row.original.isSub;
      return (
        <div className={`flex items-center gap-2 ${isSub ? "pl-8 text-muted-foreground" : "font-bold text-slate-900"}`}>
          {isSub && <CornerDownRight className="h-4 w-4" />}
          {row.getValue("name")}
        </div>
      )
    }
  },
  {
    id: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.isSub ? `Subcategory of ${row.original.parent_name}` : "Root Category"}
      </span>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell category={row.original} />,
  },
]