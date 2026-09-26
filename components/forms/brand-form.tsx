"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createBrand, updateBrand } from "@/lib/actions";
import { Brand } from "@/lib/types";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tag } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters."),
});

interface BrandFormProps {
  initialData?: Brand | null;
}

export function BrandForm({ initialData }: BrandFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isEditing && initialData) {
        await updateBrand(initialData.id, values);
        toast.success("Brand Updated", { description: "The brand details have been saved." });
      } else {
        await createBrand(values);
        toast.success("Brand Created", { description: "New brand added to the system." });
      }
      
      router.push("/brands");
      router.refresh();
    } catch (error: any) {
      toast.error("Error saving brand", { description: error.message });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" /> 
              {isEditing ? "Edit Brand" : "Add New Brand"}
            </CardTitle>
            <CardDescription>
              Manage the brand name used for categorizing products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sony, Nike, Samsung" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit">{isEditing ? "Save Changes" : "Create Brand"}</Button>
        </div>
      </form>
    </Form>
  );
}