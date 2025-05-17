
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Database, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Connection schema validation
const connectionSchema = z.object({
  name: z.string().min(3, { message: "Connection name must be at least 3 characters" }),
  type: z.enum(["MySQL", "PostgreSQL", "MSSQL", "Oracle", "MongoDB"]),
  host: z.string().min(1, { message: "Host is required" }),
  port: z.coerce.number().int().positive(),
  database: z.string().min(1, { message: "Database name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  connectionString: z.string().optional(),
  useConnectionString: z.boolean().default(false),
  ssl: z.boolean().default(false),
});

type ConnectionFormValues = z.infer<typeof connectionSchema>;

interface ConnectionFormProps {
  connection?: any;
  onSubmit: (data: ConnectionFormValues) => void;
  onCancel: () => void;
}

const defaultPortMap = {
  MySQL: 3306,
  PostgreSQL: 5432,
  MSSQL: 1433,
  Oracle: 1521,
  MongoDB: 27017,
};

const ConnectionForm: React.FC<ConnectionFormProps> = ({ connection, onSubmit, onCancel }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{status: 'success' | 'error' | null, message: string}>({
    status: null,
    message: ''
  });
  const { toast } = useToast();
  
  const form = useForm<ConnectionFormValues>({
    resolver: zodResolver(connectionSchema),
    defaultValues: connection || {
      name: "",
      type: "MySQL",
      host: "localhost",
      port: 3306,
      database: "",
      username: "",
      password: "",
      connectionString: "",
      useConnectionString: false,
      ssl: false,
    },
  });

  const connectionType = form.watch("type");
  const useConnectionString = form.watch("useConnectionString");

  // Update port when database type changes
  React.useEffect(() => {
    if (!connection) {
      form.setValue("port", defaultPortMap[connectionType] || 3306);
    }
  }, [connectionType, form, connection]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleTestConnection = async () => {
    const formValues = form.getValues();
    
    if (!form.formState.isValid) {
      form.trigger();
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields correctly before testing the connection."
      });
      return;
    }
    
    setTestingConnection(true);
    setTestResult({status: null, message: ''});
    
    // Simulate a test connection - in a real app, this would be an actual API call
    setTimeout(() => {
      // For demo purposes, succeed connections to MySQL and PostgreSQL but fail others
      const willSucceed = ["MySQL", "PostgreSQL"].includes(formValues.type);
      
      if (willSucceed) {
        setTestResult({
          status: 'success',
          message: `Successfully connected to ${formValues.database} on ${formValues.host}`
        });
        toast({
          title: "Connection Successful",
          description: `Successfully connected to ${formValues.database} on ${formValues.host}`,
        });
      } else {
        setTestResult({
          status: 'error',
          message: `Failed to connect: Authentication failed for user ${formValues.username}`
        });
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: `Could not connect to ${formValues.type} database. Check credentials and try again.`,
        });
      }
      
      setTestingConnection(false);
    }, 1500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Connection Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter connection name" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for your database connection
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select database type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MySQL">MySQL</SelectItem>
                      <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                      <SelectItem value="MSSQL">MSSQL Server</SelectItem>
                      <SelectItem value="Oracle">Oracle</SelectItem>
                      <SelectItem value="MongoDB">MongoDB</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="useConnectionString"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Use connection string</FormLabel>
                </FormItem>
              )}
            />

            {useConnectionString ? (
              <FormField
                control={form.control}
                name="connectionString"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Connection String</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter connection string" {...field} />
                    </FormControl>
                    <FormDescription>
                      Full database connection string
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="host"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Host</FormLabel>
                        <FormControl>
                          <Input placeholder="localhost" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Port</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="database"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Database Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter database name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Database username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Database password" 
                              {...field} 
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
            
            {/* Connection test button */}
            <div className="pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="w-full"
              >
                <Database className="mr-2 h-4 w-4" />
                {testingConnection ? 'Testing Connection...' : 'Test Connection'}
              </Button>
              
              {testResult.status && (
                <div className={`mt-2 p-3 rounded-md flex items-center ${
                  testResult.status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {testResult.status === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-2" />
                  )}
                  <span className="text-sm">{testResult.message}</span>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="ssl"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Use SSL/TLS</FormLabel>
                </FormItem>
              )}
            />
            
            {/* More advanced settings can be added here */}
            <div className="text-sm text-muted-foreground">
              Additional advanced connection settings will appear here based on the selected database type.
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {connection ? "Update Connection" : "Create Connection"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ConnectionForm;
