import { categoryColumns, CategoryTableRow } from "@/components/tables/category-columns"
import { DataTable } from "@/components/ui/data-table"
import { getCategories, getSubcategories } from "@/lib/actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Layers } from "lucide-react"

export default async function CategoriesPage() {
  // 1. Fetch only the top-level root categories
  const parentResponse = await getCategories()
  const parentCategories = parentResponse?.data || []

  // 2. Fetch all subcategories concurrently for maximum speed
  const subcategoryPromises = parentCategories.map((parent) => getSubcategories(parent.id))
  const subcategoryResponses = await Promise.all(subcategoryPromises)

  // 3. Assemble the array so subcategories appear directly under their parents
  const formattedData: CategoryTableRow[] = [];

  parentCategories.forEach((parent, index) => {
    // Push the parent category
    formattedData.push({ ...parent, isSub: false });
    
    // Extract the children for this specific parent from our Promise.all array
    const children = subcategoryResponses[index]?.data || [];
    
    // Push the children immediately underneath
    children.forEach((child) => {
      formattedData.push({ ...child, isSub: true, parent_name: parent.name });
    });
  });

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Layers className="h-8 w-8 text-primary" />
            Categories
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your inventory categories and subcategories.
          </p>
        </div>
        
        <Link href="/categories/manage">
          <Button size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Category
          </Button>
        </Link>
      </div>

      <DataTable columns={categoryColumns} data={formattedData} />
    </div>
  )
}