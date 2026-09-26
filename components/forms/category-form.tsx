"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createCategory, createSubcategory, updateCategory } from "@/lib/actions";
import { Category } from "@/lib/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Layers } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters."),
  parent_id: z.string().optional(),
});

interface CategoryFormProps {
  initialData?: Category | null;
  parentCategories: Category[]; // Array of categories where parent_id is null
  preselectedParentId?: number | null; // Used if "Add Subcategory" is clicked from the table
}

export function CategoryForm({ initialData, parentCategories, preselectedParentId }: CategoryFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  // Determine initial parent value
  let defaultParent = "none";
  if (initialData?.parent_id) defaultParent = initialData.parent_id.toString();
  else if (preselectedParentId) defaultParent = preselectedParentId.toString();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      parent_id: defaultParent,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const isSubcategory = values.parent_id && values.parent_id !== "none";
      const parsedParentId = isSubcategory ? parseInt(values.parent_id as string, 10) : null;

      if (isEditing && initialData) {
        // Update existing category
        await updateCategory(initialData.id, { 
          name: values.name, 
          parent_id: parsedParentId 
        });
        toast.success("Category Updated");
      } else {
        // Create new
        if (isSubcategory) {
          // Uses your nested endpoint: /categories/:parentId/subcategories
          await createSubcategory(parsedParentId as number, { name: values.name });
          toast.success("Subcategory Created");
        } else {
          // Uses your root endpoint: /categories
          await createCategory({ name: values.name });
          toast.success("Root Category Created");
        }
      }
      
      router.push("/categories");
      router.refresh();
    } catch (error: any) {
      toast.error("Error saving category", { description: error.message });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" /> 
              {isEditing ? "Edit Category" : "Add New Category"}
            </CardTitle>
            <CardDescription>
              Organize your inventory hierarchy. Leave parent blank to create a top-level category.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Electronics, Smartphones..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parent category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None (Top-Level Category)</SelectItem>
                      {parentCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecting a parent makes this a subcategory.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit">{isEditing ? "Save Changes" : "Create Category"}</Button>
        </div>
      </form>
    </Form>
  );
}