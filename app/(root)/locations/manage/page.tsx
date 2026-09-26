import { LocationForm } from "@/components/forms/location-form";
import { getLocationById } from "@/lib/actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ManageLocationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }> | { id?: string };
}) {
  // Safely resolve search params for Next.js 15 compatibility
  const resolvedParams = await searchParams;
  const editId = resolvedParams.id ? parseInt(resolvedParams.id, 10) : null;
  
  let initialData = null;

  // If there's a valid ID in the URL, fetch the existing location data
  if (editId && !isNaN(editId)) {
    const response = await getLocationById(editId);
    initialData = response?.data || null;
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full pb-10">
      <div>
        <Link href="/locations" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Locations
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          {initialData ? "Edit Location" : "Add New Location"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {initialData 
            ? "Update the details for this existing location." 
            : "Register a new physical location to your system."}
        </p>
      </div>

      <LocationForm initialData={initialData} />
    </div>
  );
}