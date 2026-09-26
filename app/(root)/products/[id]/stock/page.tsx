import { getProductById, getLocations } from "@/lib/actions";
import { ManageStockForm } from "@/components/forms/manage-stock-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Note: Next.js 15 requires params to be a Promise
export default async function ManageStockPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // 1. Safely unwrap params (Handles both Next.js 14 and 15)
  const resolvedParams = await params;
  
  // 2. Parse the ID
  const productId = parseInt(resolvedParams.id, 10);

  // 3. Prevent crashing the backend if the URL is bad
  if (isNaN(productId)) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold text-red-600">Invalid URL</h2>
        <p className="text-muted-foreground mt-2">The product ID "{resolvedParams.id}" is not a valid number.</p>
        <Link href="/products" className="mt-4">
          <Button>Return to Inventory</Button>
        </Link>
      </div>
    );
  }

  // Fetch product and location data
  const [productRes, locationsRes] = await Promise.all([
    getProductById(productId),
    getLocations()
  ]);

  const product = productRes?.data;
  const locations = locationsRes?.data || [];

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="text-muted-foreground mt-2">The product you are trying to manage does not exist.</p>
        <Link href="/products" className="mt-4">
          <Button>Return to Inventory</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10">
      <div>
        <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Manage Stock</h1>
        <p className="text-muted-foreground mt-1">
          Receive new inventory and track IMEIs for <strong>{product.name}</strong>.
        </p>
      </div>

      <ManageStockForm 
        productId={resolvedParams.id} 
        productName={product.name}
        variations={product.variations || []}
        locations={locations}
      />
    </div>
  );
}