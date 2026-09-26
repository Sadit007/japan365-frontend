"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { receiveStock } from "@/lib/actions";
import { Location } from "@/lib/types";
import { toast } from "sonner";

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
import { PackagePlus, Smartphone } from "lucide-react";

const formSchema = z.object({
  variation_id: z.coerce.number().min(1, "Please select a specific SKU/Variation."),
  location_id: z.coerce.number().min(1, "Please select a receiving location."),
  quantity: z.coerce.number().min(1, "You must receive at least 1 unit."),
  imeis_input: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.quantity > 0) {
    const imeiList = data.imeis_input 
      ? data.imeis_input.split(/[\n,]+/).map(i => i.trim()).filter(Boolean) 
      : [];
      
    if (imeiList.length > 0 && imeiList.length !== data.quantity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Quantity is ${data.quantity}, but you scanned ${imeiList.length} IMEIs. They must match exactly.`,
        path: ["imeis_input"],
      });
    }
  }
});

interface ManageStockFormProps {
  productId: string;
  productName: string;
  variations: any[]; 
  locations: Location[];
}

export function ManageStockForm({ productId, productName, variations, locations }: ManageStockFormProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variation_id: variations.length === 1 ? variations[0].id : 0,
      location_id: 0,
      quantity: 0,
      imeis_input: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        location_id: values.location_id,
        quantity: values.quantity,
        imeis: values.imeis_input ? values.imeis_input.split(/[\n,]+/).map(i => i.trim()).filter(Boolean) : [],
        type: "receive", 
      };

      // Calls your existing action: /variations/:variationId/stock
      await receiveStock(values.variation_id, payload);
      
      toast.success("Stock Received", {
        description: `Successfully added ${values.quantity} units to inventory.`,
      });
      
      router.push("/products");
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to receive stock", {
        description: error.message || "An error occurred while saving to the database.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5" /> Receive Inventory for {productName}
            </CardTitle>
            <CardDescription>Scan new IMEIs and add them to a specific warehouse location.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            
            <FormField
              control={form.control}
              name="variation_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Variation (SKU)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select which SKU you are receiving" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {variations.map((v) => (
                        <SelectItem key={v.id} value={v.id.toString()}>
                          {v.sku} (Current Stock: {v.current_stock || 0})
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
              name="location_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receiving Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select warehouse/store" />
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
              name="quantity"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Quantity Received</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="max-w-xs" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imeis_input"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" /> Scan IMEIs / Serial Numbers
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Scan barcodes here. Separate multiple IMEIs by hitting Enter or typing a comma." 
                      className="min-h-[150px] font-mono text-sm"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    The number of scanned IMEIs must exactly match the quantity entered above.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" size="lg">
            Confirm Receipt
          </Button>
        </div>
      </form>
    </Form>
  );
}