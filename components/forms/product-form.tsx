"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/actions";
import { Brand, Category, Location } from "@/lib/types";
import { toast } from "sonner"; // Using modern Sonner instead of useToast

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Smartphone, Layers } from "lucide-react";

// 1. Define the Strict Zod Schema
const formSchema = z.object({
  product: z.object({
    name: z.string().min(2, "Product name must be at least 2 characters."),
    unit: z.string().min(1, "Unit is required (e.g., piece)."),
    brand_id: z.coerce.number().min(1, "Brand is required."),
    category_id: z.coerce.number().min(1, "Category is required."),
    description: z.string().optional(),
  }),
  variations: z.array(
    z.object({
      sku: z.string().min(3, "SKU must be at least 3 characters."),
      purchase_price: z.coerce.number().min(0, "Cannot be negative."),
      selling_price: z.coerce.number().min(0, "Cannot be negative."),
      location_id: z.coerce.number().optional(),
      opening_stock: z.coerce.number().min(0).optional(),
      // IMEIs are captured as a single textarea string (separated by commas or newlines)
      // and transformed into an array during submission.
      imeis_input: z.string().optional(), 
    })
  )
}).superRefine((data, ctx) => {
  // Custom Validation: IMEI count must exactly match Opening Stock
  data.variations.forEach((variation, index) => {
    if (variation.opening_stock && variation.opening_stock > 0 && variation.imeis_input) {
      const imeiList = variation.imeis_input.split(/[\n,]+/).map(i => i.trim()).filter(Boolean);
      if (imeiList.length > 0 && imeiList.length !== variation.opening_stock) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Stock is ${variation.opening_stock}, but you scanned ${imeiList.length} IMEIs. They must match.`,
          path: ["variations", index, "imeis_input"],
        });
      }
    }
  });
});

interface ProductFormProps {
  brands: Brand[];
  categories: Category[];
  locations: Location[];
}

export function ProductForm({ brands, categories, locations }: ProductFormProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: {
        name: "",
        unit: "piece",
        description: "",
      },
      variations: [{
        sku: "",
        purchase_price: 0,
        selling_price: 0,
        opening_stock: 0,
        imeis_input: "",
      }],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "variations",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Transform the textarea IMEI string into a clean array before sending to port 5001
      const payload = {
        product: values.product,
        variations: values.variations.map((v) => ({
          sku: v.sku,
          purchase_price: v.purchase_price,
          selling_price: v.selling_price,
          location_id: v.location_id,
          opening_stock: v.opening_stock,
          imeis: v.imeis_input ? v.imeis_input.split(/[\n,]+/).map(i => i.trim()).filter(Boolean) : [],
        })),
      };

      await createProduct(payload);
      
      toast.success("Product Created", {
        description: "The product and stock were successfully saved to the database.",
      });
      
      router.push("/products");
      router.refresh();
    } catch (error: any) {
      toast.error("Error Creating Product", {
        description: error.message || "Failed to create product.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* BLOCK 1: General Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" /> General Information
            </CardTitle>
            <CardDescription>Primary details that apply to all variations of this product.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="product.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. iPhone 15 Pro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product.unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. piece, box" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product.brand_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product.category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* BLOCK 2: Variations & Initial Stock */}
        {fields.map((field, index) => (
          <Card key={field.id} className="border-primary/20 shadow-sm">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layers className="h-5 w-5" /> Primary SKU & Inventory
              </CardTitle>
              <CardDescription>Define the specific barcode, pricing, and opening stock for this warehouse.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
              <FormField
                control={form.control}
                name={`variations.${index}.sku`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU / Barcode</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. IP15P-BLK-128" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`variations.${index}.purchase_price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`variations.${index}.selling_price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name={`variations.${index}.location_id`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Where is this stock stored?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id.toString()}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`variations.${index}.opening_stock`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Stock Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`variations.${index}.imeis_input`}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" /> Scan IMEIs / Serial Numbers
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Scan barcodes here. Separate multiple IMEIs by hitting Enter or typing a comma." 
                        className="min-h-[100px] font-mono text-sm"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      If you entered an Opening Stock quantity above, you must scan exactly that many IMEIs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" size="lg">
            Save Product to Database
          </Button>
        </div>
      </form>
    </Form>
  );
}