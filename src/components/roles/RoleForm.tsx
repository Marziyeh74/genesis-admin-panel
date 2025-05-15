
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define role schema for form validation
const roleSchema = z.object({
  name: z.string().min(3, {
    message: "Role name must be at least 3 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  permissions: z.array(z.string()).min(1, {
    message: "Select at least one permission.",
  }),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormProps {
  onSubmit: (data: RoleFormValues) => void;
  isSubmitting: boolean;
  defaultValues?: Partial<RoleFormValues>;
  availablePermissions: string[];
}

export function RoleForm({
  onSubmit,
  isSubmitting,
  defaultValues,
  availablePermissions,
}: RoleFormProps) {
  const [permissionCategories, setPermissionCategories] = useState(() => {
    // Group permissions by category
    const categories: Record<string, string[]> = {};
    availablePermissions.forEach(permission => {
      const [action, resource] = permission.split(':');
      if (!categories[resource]) {
        categories[resource] = [];
      }
      categories[resource].push(permission);
    });
    return categories;
  });

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      permissions: defaultValues?.permissions || [],
    },
  });

  const handleSubmit = (values: RoleFormValues) => {
    onSubmit(values);
  };

  // Get all permissions for a category
  const getCategoryPermissions = (category: string) => {
    return permissionCategories[category] || [];
  };

  // Check if all permissions in a category are selected
  const isCategoryFullySelected = (category: string) => {
    const categoryPermissions = getCategoryPermissions(category);
    return categoryPermissions.every(permission => 
      form.watch("permissions").includes(permission)
    );
  };

  // Handle select/deselect all permissions in a category
  const toggleCategory = (category: string, isSelected: boolean) => {
    const categoryPermissions = getCategoryPermissions(category);
    const currentPermissions = form.watch("permissions");
    
    let newPermissions: string[];
    if (isSelected) {
      // Add all permissions from this category
      newPermissions = Array.from(new Set([
        ...currentPermissions, 
        ...categoryPermissions
      ]));
    } else {
      // Remove all permissions from this category
      newPermissions = currentPermissions.filter(
        permission => !categoryPermissions.includes(permission)
      );
    }
    
    form.setValue("permissions", newPermissions, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Admin, Editor, Viewer" {...field} />
              </FormControl>
              <FormDescription>
                A unique name for the role.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the purpose and capabilities of this role" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                A brief description of what this role is used for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="permissions"
          render={() => (
            <FormItem>
              <FormLabel>Permissions</FormLabel>
              <FormDescription>
                Select the permissions that this role should have.
              </FormDescription>
              <ScrollArea className="h-[200px] border rounded-md p-4">
                <div className="space-y-5">
                  {Object.keys(permissionCategories).map((category) => (
                    <div key={category} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox 
                          checked={isCategoryFullySelected(category)}
                          onCheckedChange={(checked) => 
                            toggleCategory(category, checked === true)
                          }
                          id={`category-${category}`}
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="font-medium capitalize cursor-pointer"
                        >
                          {category}
                        </label>
                      </div>
                      <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getCategoryPermissions(category).map((permission) => (
                          <FormField
                            key={permission}
                            control={form.control}
                            name="permissions"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={permission}
                                  className="flex flex-row items-start space-x-2 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(permission)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...field.value, permission]
                                          : field.value?.filter(
                                              (val) => val !== permission
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer">
                                    {permission.split(":")[0]}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (defaultValues) {
                form.reset(defaultValues);
              } else {
                form.reset();
              }
            }}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : defaultValues ? "Update Role" : "Create Role"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
