
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import SqlEditor from "./SqlEditor";

// Service schema validation
const serviceSchema = z.object({
  name: z.string().min(3, { message: "Service name must be at least 3 characters" }),
  type: z.enum(["Database Query", "Stored Procedure", "External API"]),
  status: z.enum(["Active", "Inactive"]),
  source: z.string().min(1, { message: "Source is required" }),
  endpoint: z.string().min(1, { message: "Endpoint path is required" }),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  service?: any;
  onSubmit: (data: ServiceFormValues) => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service || {
      name: "",
      type: "Database Query",
      status: "Active",
      source: "",
      endpoint: "",
    },
  });

  const serviceType = form.watch("type");

  // Update source description based on selected type
  const getSourceDescription = () => {
    switch (serviceType) {
      case "Database Query":
        return "Enter your SQL query";
      case "Stored Procedure":
        return "Enter the stored procedure name";
      case "External API":
        return "Enter the API URL or connection string";
      default:
        return "The data source for this service";
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => {
        toast({
          title: service ? "Service updated" : "Service created",
          description: `${data.name} has been ${service ? "updated" : "created"} successfully.`,
        });
        onSubmit(data);
      })} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter service name" {...field} />
              </FormControl>
              <FormDescription>
                A descriptive name for your service
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Database Query">Database Query</SelectItem>
                    <SelectItem value="Stored Procedure">Stored Procedure</SelectItem>
                    <SelectItem value="External API">External API</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{serviceType === "Database Query" ? "SQL Query" : "Source"}</FormLabel>
              <FormControl>
                {serviceType === "Database Query" ? (
                  <SqlEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="SELECT * FROM users WHERE status = 'active'"
                  />
                ) : (
                  <Input placeholder={serviceType === "Stored Procedure" ? "sp_get_users" : "Database or API source"} {...field} />
                )}
              </FormControl>
              <FormDescription>
                {getSourceDescription()}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endpoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Endpoint</FormLabel>
              <FormControl>
                <Input placeholder="/api/v1/resource" {...field} />
              </FormControl>
              <FormDescription>
                The endpoint path for accessing this service
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {service ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ServiceForm;
