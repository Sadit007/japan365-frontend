import { BrandForm } from "@/components/forms/brand-form";
import { getBrandById } from "@/lib/actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ManageBrandPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }> | { id?: string };
}) {
  const resolvedParams = await searchParams;
  const editId = resolvedParams.id ? parseInt(resolvedParams.id, 10) : null;
  
  let initialData = null;

  if (editId && !isNaN(editId)) {
    const response = await getBrandById(editId);
    initialData = response?.data || null;
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full pb-10">
      <div>
        <Link href="/brands" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Brands
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          {initialData ? "Edit Brand" : "Add New Brand"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {initialData 
            ? "Update the details for this existing brand." 
            : "Register a new brand to your system."}
        </p>
      </div>

      <BrandForm initialData={initialData} />
    </div>
  );
}