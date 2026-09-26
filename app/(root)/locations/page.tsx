import { locationColumns } from "@/components/tables/location-columns"
import { DataTable } from "@/components/ui/data-table"
import { getLocations } from "@/lib/actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Store } from "lucide-react"

export default async function LocationsPage() {
  const response = await getLocations()
  const data = response?.data || []

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Store className="h-8 w-8 text-primary" />
            Locations
          </h1>
          <p className="text-muted-foreground mt-1">
            View all physical store and warehouse locations.
          </p>
        </div>
        
        {/* Navigates to the manage page with no ID (Create Mode) */}
        <Link href="/locations/manage">
          <Button size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Manage New Location
          </Button>
        </Link>
      </div>

      <DataTable columns={locationColumns} data={data} />
    </div>
  )
}