"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Location } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash, MapPin } from "lucide-react"
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
import { deleteLocation } from "@/lib/actions"
import { useState } from "react"

// Create a custom cell component so we can use React hooks for the delete action
const ActionCell = ({ location }: { location: Location }) => {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    // Prevent accidental clicks
    if (!window.confirm(`Are you sure you want to delete ${location.name}?`)) return;

    try {
      setIsDeleting(true);
      await deleteLocation(location.id);
      toast.success("Location Deleted", { description: `${location.name} has been removed.` });
      
      // Instantly refresh the server component to update the table
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
        
        <Link href={`/locations/manage?id=${location.id}`}>
          <DropdownMenuItem className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" /> Edit Location
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

export const locationColumns: ColumnDef<Location>[] = [
  {
    accessorKey: "name",
    header: "Location Name",
    cell: ({ row }) => (
      <div className="font-semibold text-slate-900 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        {row.getValue("name")}
      </div>
    )
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell location={row.original} />,
  },
]