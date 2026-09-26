"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Brand } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash, Tag } from "lucide-react"
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
import { deleteBrand } from "@/lib/actions"
import { useState } from "react"

const ActionCell = ({ brand }: { brand: Brand }) => {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete the brand "${brand.name}"?`)) return;

    try {
      setIsDeleting(true);
      await deleteBrand(brand.id);
      toast.success("Brand Deleted", { description: `${brand.name} has been removed.` });
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to delete", { description: error.message || "Something went wrong." });
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
        
        <Link href={`/brands/manage?id=${brand.id}`}>
          <DropdownMenuItem className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" /> Edit Brand
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

export const brandColumns: ColumnDef<Brand>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="text-muted-foreground">#{row.getValue("id")}</span>,
  },
  {
    accessorKey: "name",
    header: "Brand Name",
    cell: ({ row }) => (
      <div className="font-semibold text-slate-900 flex items-center gap-2">
        <Tag className="h-4 w-4 text-muted-foreground" />
        {row.getValue("name")}
      </div>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell brand={row.original} />,
  },
]