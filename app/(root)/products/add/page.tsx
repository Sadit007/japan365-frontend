import { ProductForm } from "@/components/forms/product-form";
import { getBrands, getCategories, getLocations } from "@/lib/actions";

export default async function AddProductPage() {
  const [brandsResponse, categoriesResponse, locationsResponse] = await Promise.all([
    getBrands(),
    getCategories(),
    getLocations(),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl pb-10">
      <ProductForm
        brands={brandsResponse.data ?? []}
        categories={categoriesResponse.data ?? []}
        locations={locationsResponse.data ?? []}
      />
    </div>
  );
}