import { brandColumns } from "@/components/tables/brand-columns"
import { DataTable } from "@/components/ui/data-table"
import { getBrands } from "@/lib/actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Tag } from "lucide-react"

export default async function BrandsPage() {
  const response = await getBrands()
  const data = response?.data || []

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Tag className="h-8 w-8 text-primary" />
            Brands
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage product brands and manufacturers.
          </p>
        </div>
        
        <Link href="/brands/manage">
          <Button size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Manage New Brand
          </Button>
        </Link>
      </div>

      <DataTable columns={brandColumns} data={data} />
    </div>
  )
}