// ==========================================
// GLOBAL RESPONSE WRAPPER
// ==========================================
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// ==========================================
// BASE ENTITIES 
// ==========================================
export interface Brand {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  parent_id?: number | null;
}

export interface Location {
  id: number;
  name: string;
  address: string | null;
}

// ==========================================
// PRODUCT SHAPES
// ==========================================
export interface ProductVariationDetailed {
  id: number;
  sku: string;
  purchase_price: number; // Fixed: Mapped to number based on prompt.txt
  selling_price: number;  // Fixed: Mapped to number based on prompt.txt
  attributes: Record<string, string>;
  image_url: string | null;
  current_stock: number; 
}

export interface ProductDetailed {
  id: number;
  name: string;
  product_type: string;
  barcode_type: string | null;
  unit: string | null;
  brand_id: number | null;
  category_id: number | null;
  warranty: string | null;
  tax: string | null;
  manage_stock: boolean;
  alert_quantity: number;
  description: string | null;
  image_url: string | null;
  brand_name: string | null; 
  category_name: string | null; 
  variations: ProductVariationDetailed[]; 
}

export interface ImeiResponse {
  id: number;
  imei: string;
}

// ==========================================
// WRITE SHAPES (Request Bodies)
// ==========================================
export interface CreateVariationPayload {
  sku: string;
  purchase_price: number;
  selling_price: number;
  attributes?: Record<string, string>;
  location_id?: number; 
  opening_stock?: number;
  imeis?: string[];
}

export interface CreateProductRequest {
  product: {
    name: string;
    product_type?: string;
    unit?: string;
    brand_id?: number;
    category_id?: number;
    description?: string;
  };
  variations: CreateVariationPayload[];
}

export interface StockAdjustmentRequest {
  location_id: number;
  quantity: number;
  imeis?: string[];
}