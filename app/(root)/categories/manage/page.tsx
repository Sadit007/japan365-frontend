import { CategoryForm } from "@/components/forms/category-form";
import { getCategoryById, getCategories } from "@/lib/actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ManageCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; parent_id?: string }> | { id?: string; parent_id?: string };
}) {
  const resolvedParams = await searchParams;
  const editId = resolvedParams.id ? parseInt(resolvedParams.id, 10) : null;
  const preselectedParentId = resolvedParams.parent_id ? parseInt(resolvedParams.parent_id, 10) : null;
  
  let initialData = null;

  // Fetch all categories to populate the "Parent" dropdown
  const allCategoriesRes = await getCategories();
  const allCategories = allCategoriesRes?.data || [];
  
  // Filter out subcategories so the dropdown only shows Root categories
  const parentCategories = allCategories.filter(c => !c.parent_id);

  if (editId && !isNaN(editId)) {
    const response = await getCategoryById(editId);
    initialData = response?.data || null;
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full pb-10">
      <div>
        <Link href="/categories" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          {initialData ? "Edit Category" : preselectedParentId ? "Add Subcategory" : "Add New Category"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure the hierarchy of your inventory organization.
        </p>
      </div>

      <CategoryForm 
        initialData={initialData} 
        parentCategories={parentCategories}
        preselectedParentId={preselectedParentId}
      />
    </div>
  );
}