import { 
  ApiResponse, 
  ProductDetailed, 
  CreateProductRequest, 
  StockAdjustmentRequest,
  ImeiResponse,
  CreateVariationPayload,
  Brand,
  Category,
  Location
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "An error occurred fetching data");
  }

  // Normalization: If the backend returns a raw object instead of the { status, data } wrapper,
  // we manually wrap it so the frontend components can always safely call `.data`
  if (json.data === undefined && !json.status) {
    return { status: 200, message: "Success", data: json as T };
  }

  return json as ApiResponse<T>;
}

// ==========================================
// PRODUCTS
// ==========================================
export const getProducts = () => fetchApi<ProductDetailed[]>("/products");
export const getProductById = (id: number) => fetchApi<ProductDetailed>(`/products/${id}`);
export const createProduct = (payload: CreateProductRequest) => 
  fetchApi<ProductDetailed>("/products", { method: "POST", body: JSON.stringify(payload) });

// ==========================================
// VARIATIONS & INVENTORY
// ==========================================
export const addProductVariation = (productId: number, variation: CreateVariationPayload) => 
  fetchApi<any>(`/products/${productId}/variations`, { 
    method: "POST", 
    body: JSON.stringify({ variation }) 
  });

export const receiveStock = (variationId: number, payload: StockAdjustmentRequest) => 
  fetchApi<any>(`/variations/${variationId}/stock`, { method: "POST", body: JSON.stringify(payload) });

export const getAvailableImeis = (variationId: number) => 
  fetchApi<ImeiResponse[]>(`/variations/${variationId}/imei`);

// ==========================================
// LOCATIONS
// ==========================================
export const getLocations = () => fetchApi<Location[]>("/locations");
export const getLocationById = (id: number) => fetchApi<Location>(`/locations/${id}`);
export const createLocation = (payload: { name: string; address: string }) => 
  fetchApi<Location>("/locations", { method: "POST", body: JSON.stringify(payload) });

export const updateLocation = (id: number, payload: { name: string; address: string }) => 
  fetchApi<Location>(`/locations/${id}`, { method: "PUT", body: JSON.stringify(payload) });

export const deleteLocation = (id: number) => 
  fetchApi<any>(`/locations/${id}`, { method: "DELETE" });

// ==========================================
// BRANDS
// ==========================================
export const getBrands = () => fetchApi<Brand[]>("/brands");
export const getBrandById = (id: number) => fetchApi<Brand>(`/brands/${id}`);
export const createBrand = (payload: { name: string }) => 
  fetchApi<Brand>("/brands", { method: "POST", body: JSON.stringify(payload) });

// Add these to the BRANDS section of lib/actions.ts
export const updateBrand = (id: number, payload: { name: string }) => 
  fetchApi<Brand>(`/brands/${id}`, { method: "PUT", body: JSON.stringify(payload) });

export const deleteBrand = (id: number) => 
  fetchApi<any>(`/brands/${id}`, { method: "DELETE" });

// ==========================================
// CATEGORIES
// ==========================================
export const getCategories = () => fetchApi<Category[]>("/categories");
export const getCategoryById = (id: number) => fetchApi<Category>(`/categories/${id}`);
export const getSubcategories = (parentId: number) => fetchApi<Category[]>(`/categories/${parentId}/subcategories`);
export const createCategory = (payload: { name: string }) => 
  fetchApi<Category>("/categories", { method: "POST", body: JSON.stringify(payload) });
export const createSubcategory = (parentId: number, payload: { name: string }) => 
  fetchApi<Category>(`/categories/${parentId}/subcategories`, { method: "POST", body: JSON.stringify(payload) });

export const updateCategory = (id: number, payload: { name: string; parent_id?: number | null }) => 
  fetchApi<Category>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(payload) });

export const deleteCategory = (id: number) => 
  fetchApi<any>(`/categories/${id}`, { method: "DELETE" });