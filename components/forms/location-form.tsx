"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createLocation, updateLocation } from "@/lib/actions";
import { Location } from "@/lib/types";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Store } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Location name must be at least 2 characters."),
  address: z.string().min(5, "Address must be at least 5 characters."),
});

interface LocationFormProps {
  initialData?: Location | null;
}

export function LocationForm({ initialData }: LocationFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      address: initialData?.address || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isEditing && initialData) {
        await updateLocation(initialData.id, values);
        toast.success("Location Updated", { description: "The details have been saved." });
      } else {
        await createLocation(values);
        toast.success("Location Created", { description: "New location added to the system." });
      }
      
      router.push("/locations");
      router.refresh();
    } catch (error: any) {
      toast.error("Error saving location", { description: error.message });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" /> 
              {isEditing ? "Edit Location" : "Add New Location"}
            </CardTitle>
            <CardDescription>
              Manage the details and physical address of this branch.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Downtown Tokyo Hub" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter the complete physical address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit">{isEditing ? "Save Changes" : "Create Location"}</Button>
        </div>
      </form>
    </Form>
  );
}