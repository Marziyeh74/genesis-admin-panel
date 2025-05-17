
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";
import SqlEditor from "./SqlEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, Film } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Service schema validation
const serviceSchema = z.object({
  name: z.string().min(3, { message: "Service name must be at least 3 characters" }),
  type: z.enum(["Database Query", "Stored Procedure", "External API"]),
  status: z.enum(["Active", "Inactive"]),
  category: z.string().min(1, { message: "Category is required" }),
  source: z.string().min(1, { message: "Source is required" }),
  endpoint: z.string().min(1, { message: "Endpoint path is required" }),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]).default("GET"),
  contentType: z.enum(["application/json", "multipart/form-data", "application/x-www-form-urlencoded", "text/plain"]).default("application/json"),
  description: z.string().optional(),
  movieDescription: z.string().optional(),
  params: z.array(
    z.object({
      key: z.string().min(1, { message: "Key is required" }),
      type: z.enum(["string", "number", "boolean", "object", "array", "date", "file"]),
      title: z.string().min(1, { message: "Title is required" }),
      required: z.boolean().default(false),
    })
  ).default([]),
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
      category: "",
      source: "",
      endpoint: "",
      method: "GET",
      contentType: "application/json",
      description: "",
      movieDescription: "",
      params: [],
    },
  });

  const serviceType = form.watch("type");
  const params = form.watch("params");
  const category = form.watch("category");
  const name = form.watch("name");
  const [deleteParamIndex, setDeleteParamIndex] = React.useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  // Generate API endpoint based on category and name
  React.useEffect(() => {
    if (category && name && (!service || !service.endpoint)) {
      const formattedCategory = category.toLowerCase().replace(/\s+/g, '-');
      const formattedName = name.toLowerCase().replace(/\s+/g, '-');
      form.setValue("endpoint", `/api/${formattedCategory}/${formattedName}`);
    }
  }, [category, name, form, service]);

  // Add a new parameter
  const addParam = () => {
    const currentParams = form.getValues("params") || [];
    form.setValue("params", [
      ...currentParams,
      { key: "", type: "string", title: "", required: false },
    ]);
  };

  // Remove a parameter
  const removeParam = (index: number) => {
    setDeleteParamIndex(index);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteParam = () => {
    if (deleteParamIndex !== null) {
      const currentParams = form.getValues("params") || [];
      form.setValue(
        "params",
        currentParams.filter((_, i) => i !== deleteParamIndex)
      );
      setIsDeleteDialogOpen(false);
      setDeleteParamIndex(null);
    }
  };

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
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => {
          toast({
            title: service ? "Service updated" : "Service created",
            description: `${data.name} has been ${service ? "updated" : "created"} successfully.`,
          });
          onSubmit(data);
        })} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="params">Parameters</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 pt-4">
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

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter service category" {...field} />
                    </FormControl>
                    <FormDescription>
                      Group related services under a category
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
                        placeholder="Describe what this service does" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
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
                      <Input placeholder="/api/category/service-name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The endpoint path for accessing this service (auto-generated)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="params" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Input Parameters</h3>
                <Button type="button" variant="outline" size="sm" onClick={addParam}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Parameter
                </Button>
              </div>

              {params.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No parameters defined. Add parameters to configure service inputs.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter Key</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {params.map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`params.${index}.key`}
                            render={({ field }) => (
                              <FormControl>
                                <Input className="h-8" placeholder="param_name" {...field} />
                              </FormControl>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`params.${index}.type`}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="string">String</SelectItem>
                                  <SelectItem value="number">Number</SelectItem>
                                  <SelectItem value="boolean">Boolean</SelectItem>
                                  <SelectItem value="date">Date</SelectItem>
                                  <SelectItem value="object">Object</SelectItem>
                                  <SelectItem value="array">Array</SelectItem>
                                  <SelectItem value="file">File</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`params.${index}.title`}
                            render={({ field }) => (
                              <FormControl>
                                <Input className="h-8" placeholder="Display Title" {...field} />
                              </FormControl>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name={`params.${index}.required`}
                            render={({ field }) => (
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="h-4 w-4"
                                />
                              </FormControl>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeParam(index)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete parameter</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              <div className="text-sm text-muted-foreground mt-4">
                Define the input parameters for this service. These will be used to generate documentation and validate requests.
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HTTP Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                            <SelectItem value="PATCH">PATCH</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          HTTP method for API requests
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select content type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="application/json">JSON</SelectItem>
                            <SelectItem value="multipart/form-data">Form Data</SelectItem>
                            <SelectItem value="application/x-www-form-urlencoded">URL Encoded</SelectItem>
                            <SelectItem value="text/plain">Plain Text</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Format for request/response data
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="movieDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Movie Description</FormLabel>
                      <div className="flex items-center gap-2">
                        <Film className="h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Textarea 
                            placeholder="Enter movie description" 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Describe the movie or media content this service provides
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          </Tabs>

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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this parameter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteParam}>
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default ServiceForm;
