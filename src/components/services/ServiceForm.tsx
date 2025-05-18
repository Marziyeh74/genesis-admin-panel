
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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
import { PlusCircle, Trash2, Film, Lock, Unlock } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for roles
const mockRoles = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Editor" },
  { id: 3, name: "Viewer" },
  { id: 4, name: "Manager" },
  { id: 5, name: "Developer" },
  { id: 6, name: "Tester" },
  { id: 7, name: "Guest" },
];

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
  accessibility: z.enum(["public", "private"]).default("public"),
  selectedRoles: z.array(z.number()).default([]),
  inputParams: z.array(
    z.object({
      key: z.string().min(1, { message: "Key is required" }),
      type: z.enum(["string", "number", "boolean", "object", "array", "date", "file"]),
      required: z.boolean().default(false),
    })
  ).default([]),
  outputParams: z.array(
    z.object({
      key: z.string().min(1, { message: "Key is required" }),
      type: z.enum(["string", "number", "boolean", "object", "array", "date"]),
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
      accessibility: "public",
      selectedRoles: [],
      inputParams: [],
      outputParams: [],
    },
  });

  const serviceType = form.watch("type");
  const inputParams = form.watch("inputParams");
  const outputParams = form.watch("outputParams");
  const category = form.watch("category");
  const name = form.watch("name");
  const accessibility = form.watch("accessibility");
  const [deleteParamIndex, setDeleteParamIndex] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteParamType, setDeleteParamType] = useState<"input" | "output">("input");

  // Generate API endpoint based on category and name
  React.useEffect(() => {
    if (category && name && (!service || !service.endpoint)) {
      const formattedCategory = category.toLowerCase().replace(/\s+/g, '-');
      const formattedName = name.toLowerCase().replace(/\s+/g, '-');
      form.setValue("endpoint", `/api/${formattedCategory}/${formattedName}`);
    }
  }, [category, name, form, service]);

  // Add a new input parameter
  const addInputParam = () => {
    const currentParams = form.getValues("inputParams") || [];
    form.setValue("inputParams", [
      ...currentParams,
      { key: "", type: "string", required: false },
    ]);
  };

  // Add a new output parameter
  const addOutputParam = () => {
    const currentParams = form.getValues("outputParams") || [];
    form.setValue("outputParams", [
      ...currentParams,
      { key: "", type: "string", required: false },
    ]);
  };

  // Remove a parameter
  const removeParam = (index: number, type: "input" | "output") => {
    setDeleteParamIndex(index);
    setDeleteParamType(type);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteParam = () => {
    if (deleteParamIndex !== null) {
      if (deleteParamType === "input") {
        const currentParams = form.getValues("inputParams") || [];
        form.setValue(
          "inputParams",
          currentParams.filter((_, i) => i !== deleteParamIndex)
        );
      } else {
        const currentParams = form.getValues("outputParams") || [];
        form.setValue(
          "outputParams",
          currentParams.filter((_, i) => i !== deleteParamIndex)
        );
      }
      setIsDeleteDialogOpen(false);
      setDeleteParamIndex(null);
    }
  };

  // Toggle role selection
  const toggleRoleSelection = (roleId: number) => {
    const currentRoles = form.getValues("selectedRoles") || [];
    const roleIndex = currentRoles.indexOf(roleId);
    
    if (roleIndex > -1) {
      form.setValue(
        "selectedRoles",
        currentRoles.filter((id) => id !== roleId)
      );
    } else {
      form.setValue("selectedRoles", [...currentRoles, roleId]);
    }
  };

  // Check if a role is selected
  const isRoleSelected = (roleId: number) => {
    const selectedRoles = form.getValues("selectedRoles") || [];
    return selectedRoles.includes(roleId);
  };

  // Select all roles
  const selectAllRoles = () => {
    form.setValue("selectedRoles", mockRoles.map(role => role.id));
  };

  // Deselect all roles
  const deselectAllRoles = () => {
    form.setValue("selectedRoles", []);
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="input">Input</TabsTrigger>
              <TabsTrigger value="output">Output</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
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
                name="endpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Endpoint</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="/api/category/service-name" 
                        {...field} 
                        readOnly 
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormDescription>
                      The endpoint path for accessing this service (auto-generated)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </TabsContent>
            
            <TabsContent value="input" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Input Parameters</h3>
                <Button type="button" variant="outline" size="sm" onClick={addInputParam}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Parameter
                </Button>
              </div>

              {inputParams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No input parameters defined. Add parameters to configure service inputs.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter Key</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-center">Required</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inputParams.map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`inputParams.${index}.key`}
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
                            name={`inputParams.${index}.type`}
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
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name={`inputParams.${index}.required`}
                            render={({ field }) => (
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="mx-auto"
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
                                onClick={() => removeParam(index, "input")}
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
                Define the input parameters for this service. These will be used to validate requests.
              </div>
            </TabsContent>

            <TabsContent value="output" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Output Parameters</h3>
                <Button type="button" variant="outline" size="sm" onClick={addOutputParam}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Parameter
                </Button>
              </div>

              {outputParams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No output parameters defined. Add parameters to configure service outputs.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter Key</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-center">Required</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outputParams.map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`outputParams.${index}.key`}
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
                            name={`outputParams.${index}.type`}
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
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name={`outputParams.${index}.required`}
                            render={({ field }) => (
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="mx-auto"
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
                                onClick={() => removeParam(index, "output")}
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
                Define the output parameters for this service. These will be used to shape the response.
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what this service does" 
                          className="min-h-[120px] resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Detailed description about this service's purpose and functionality
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="accessibility" className="pt-4">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="accessibility"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Access Control</FormLabel>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="public"
                            checked={field.value === "public"}
                            onCheckedChange={() => field.onChange("public")}
                          />
                          <label
                            htmlFor="public"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                          >
                            <Unlock className="h-4 w-4 mr-2" />
                            Public (accessible to everyone)
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="private"
                            checked={field.value === "private"}
                            onCheckedChange={() => field.onChange("private")}
                          />
                          <label
                            htmlFor="private"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            Private (role-based access)
                          </label>
                        </div>
                      </div>
                      <FormDescription>
                        Define who can access this service
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {accessibility === "private" && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <FormLabel>Select Roles</FormLabel>
                      <div className="space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={selectAllRoles}
                        >
                          Select All
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={deselectAllRoles}
                        >
                          Deselect All
                        </Button>
                      </div>
                    </div>
                    <FormDescription>
                      Choose which roles can access this service
                    </FormDescription>
                    <ScrollArea className="h-[200px] border rounded-md p-2">
                      <div className="space-y-2 p-2">
                        {mockRoles.map((role) => (
                          <div key={role.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`role-${role.id}`}
                              checked={isRoleSelected(role.id)}
                              onCheckedChange={() => toggleRoleSelection(role.id)}
                            />
                            <label
                              htmlFor={`role-${role.id}`}
                              className="text-sm font-medium leading-none"
                            >
                              {role.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
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
              This will permanently delete the parameter. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteParam}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default ServiceForm;
