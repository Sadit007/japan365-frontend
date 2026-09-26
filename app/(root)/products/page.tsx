import { productColumns } from "@/components/tables/product-columns"
import { DataTable } from "@/components/ui/data-table"
import { getProducts } from "@/lib/actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, PackageSearch } from "lucide-react"

export default async function ProductsPage() {
  const response = await getProducts()
  const data = response?.data || []

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <PackageSearch className="h-8 w-8 text-primary" />
            Inventory
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your products, variations, and current stock levels.
          </p>
        </div>
        
        <Link href="/products/add">
          <Button size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Product
          </Button>
        </Link>
      </div>

      <DataTable columns={productColumns} data={data} />
    </div>
  )
}