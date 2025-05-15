import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, Save, Play, Database, TableProperties, FileCode } from "lucide-react";
import QueryBuilder from "@/components/services/QueryBuilder";
import StoredProcedureForm from "@/components/services/StoredProcedureForm";
import ApiConfigForm from "@/components/services/ApiConfigForm";

// Mock data
const mockService = {
  id: 1,
  name: "User Data Service",
  type: "Database Query",
  status: "Active",
  source: "Main Database",
  endpoint: "/api/v1/users",
};

const mockConnections = [
  { id: 1, name: "Main Database", type: "MySQL" },
  { id: 2, name: "Products DB", type: "PostgreSQL" },
  { id: 3, name: "Analytics DB", type: "MSSQL" },
];

const mockTables = [
  { name: "users", schema: "public" },
  { name: "orders", schema: "public" },
  { name: "products", schema: "inventory" },
];

const mockStoredProcedures = [
  { name: "get_user_details", parameters: [{ name: "user_id", type: "INT" }] },
  { name: "update_order_status", parameters: [{ name: "order_id", type: "INT" }, { name: "status", type: "VARCHAR" }] },
  { name: "calculate_inventory", parameters: [] },
];

const ServiceConfiguration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [service, setService] = useState(mockService);
  const [selectedConnection, setSelectedConnection] = useState<number | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<string | null>(null);
  const [objectType, setObjectType] = useState<"tables" | "procedures">("tables");
  const [apiConfig, setApiConfig] = useState({
    format: "REST",
    authentication: "JWT",
    rateLimit: "100",
    caching: "60",
    endpoint: "users",
  });

  // Simulate loading service data
  useEffect(() => {
    // In a real app, fetch service data based on ID
    console.log(`Loading service with ID: ${id}`);
    
    // Set default connection based on service source
    const connection = mockConnections.find(conn => conn.name === mockService.source);
    if (connection) {
      setSelectedConnection(connection.id);
    }
  }, [id]);

  const handleConnectionChange = (connectionId: string) => {
    setSelectedConnection(parseInt(connectionId));
    setSelectedTable(null);
    setSelectedProcedure(null);
    toast({
      title: "Connection changed",
      description: "Database objects have been refreshed.",
    });
  };

  const handleObjectTypeChange = (type: "tables" | "procedures") => {
    setObjectType(type);
    setSelectedTable(null);
    setSelectedProcedure(null);
  };

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    setSelectedProcedure(null);
  };

  const handleProcedureSelect = (procedureName: string) => {
    setSelectedProcedure(procedureName);
    setSelectedTable(null);
  };

  const handleSaveService = () => {
    toast({
      title: "Service saved",
      description: "Your service configuration has been saved successfully.",
    });
  };

  const handleTestService = () => {
    navigate(`/services/${id}/test`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/services")}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{service.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleTestService}>
            <Play className="mr-2 h-4 w-4" />
            Test
          </Button>
          <Button onClick={handleSaveService}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Data Source</CardTitle>
            <CardDescription>
              Select database connection and objects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="connection">Database Connection</Label>
              <Select 
                value={selectedConnection?.toString()} 
                onValueChange={handleConnectionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a connection" />
                </SelectTrigger>
                <SelectContent>
                  {mockConnections.map((conn) => (
                    <SelectItem key={conn.id} value={conn.id.toString()}>
                      <div className="flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        {conn.name} ({conn.type})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedConnection && (
              <>
                <div className="pt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger 
                      value="tables" 
                      onClick={() => handleObjectTypeChange("tables")}
                      className={objectType === "tables" ? "bg-primary text-primary-foreground" : ""}
                    >
                      <TableProperties className="h-4 w-4 mr-2" />
                      Tables
                    </TabsTrigger>
                    <TabsTrigger 
                      value="procedures" 
                      onClick={() => handleObjectTypeChange("procedures")}
                      className={objectType === "procedures" ? "bg-primary text-primary-foreground" : ""}
                    >
                      <FileCode className="h-4 w-4 mr-2" />
                      Procedures
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="pt-2">
                  {objectType === "tables" && (
                    <div className="max-h-64 overflow-y-auto border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Table Name</TableHead>
                            <TableHead>Schema</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockTables.map((table) => (
                            <TableRow 
                              key={table.name} 
                              className={
                                selectedTable === table.name 
                                  ? "bg-primary/10 cursor-pointer" 
                                  : "cursor-pointer hover:bg-muted/50"
                              }
                              onClick={() => handleTableSelect(table.name)}
                            >
                              <TableCell>{table.name}</TableCell>
                              <TableCell>{table.schema}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {objectType === "procedures" && (
                    <div className="max-h-64 overflow-y-auto border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Procedure Name</TableHead>
                            <TableHead>Parameters</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockStoredProcedures.map((proc) => (
                            <TableRow 
                              key={proc.name} 
                              className={
                                selectedProcedure === proc.name 
                                  ? "bg-primary/10 cursor-pointer" 
                                  : "cursor-pointer hover:bg-muted/50"
                              }
                              onClick={() => handleProcedureSelect(proc.name)}
                            >
                              <TableCell>{proc.name}</TableCell>
                              <TableCell>{proc.parameters.length}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedTable 
                ? `Table: ${selectedTable}` 
                : selectedProcedure 
                  ? `Procedure: ${selectedProcedure}` 
                  : "Configuration"
              }
            </CardTitle>
            <CardDescription>
              {selectedTable 
                ? "Configure database query" 
                : selectedProcedure 
                  ? "Configure stored procedure execution" 
                  : "Select a database object to configure"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedConnection && (
              <div className="text-center p-6 text-muted-foreground">
                Please select a database connection
              </div>
            )}
            
            {selectedConnection && !selectedTable && !selectedProcedure && (
              <div className="text-center p-6 text-muted-foreground">
                Select a table or stored procedure from the left panel
              </div>
            )}
            
            {selectedTable && (
              <QueryBuilder tableName={selectedTable} />
            )}
            
            {selectedProcedure && (
              <StoredProcedureForm 
                procedure={mockStoredProcedures.find(p => p.name === selectedProcedure)} 
              />
            )}
          </CardContent>
        </Card>
      </div>
      
      {(selectedTable || selectedProcedure) && (
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              Configure how this service is exposed as an API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApiConfigForm 
              initialConfig={apiConfig} 
              onConfigChange={setApiConfig}
            />
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-end">
            <Button onClick={handleSaveService}>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ServiceConfiguration;
