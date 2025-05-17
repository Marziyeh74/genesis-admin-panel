
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Check, X, Server, Database } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ConnectionForm from "@/components/connections/ConnectionForm";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Define the connection type
interface Connection {
  id: number;
  name: string;
  type: string;
  host: string;
  port: number;
  database: string;
  username: string;
  status: string;
}

// Mock connections data
const mockConnections: Connection[] = [
  { 
    id: 1, 
    name: "Main Database", 
    type: "MySQL", 
    host: "localhost", 
    port: 3306, 
    database: "main_db", 
    username: "admin",
    status: "Connected" 
  },
  { 
    id: 2, 
    name: "Products DB", 
    type: "PostgreSQL", 
    host: "products.example.com", 
    port: 5432, 
    database: "products", 
    username: "product_user",
    status: "Connected" 
  },
  { 
    id: 3, 
    name: "Analytics DB", 
    type: "MSSQL", 
    host: "analytics.internal", 
    port: 1433, 
    database: "analytics", 
    username: "analyst",
    status: "Disconnected" 
  },
];

const ConnectionManagement = () => {
  const [connections, setConnections] = useState<Connection[]>(mockConnections);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentConnection, setCurrentConnection] = useState<Connection | null>(null);
  const { toast } = useToast();

  const handleAddConnection = (connectionData: Partial<Connection>) => {
    const newConnection = {
      id: connections.length + 1,
      ...connectionData,
      status: "Connected", // Assume successful connection for mock
    } as Connection;
    setConnections([...connections, newConnection]);
    setIsAddDialogOpen(false);
    toast({
      title: "Connection created",
      description: `${connectionData.name} has been created successfully.`,
    });
  };

  const handleEditConnection = (connectionData: Partial<Connection>) => {
    setConnections(
      connections.map((connection) =>
        connection.id === currentConnection?.id ? { ...connection, ...connectionData } as Connection : connection
      )
    );
    setIsEditDialogOpen(false);
    toast({
      title: "Connection updated",
      description: `${connectionData.name} has been updated successfully.`,
    });
  };

  const handleDeleteConnection = (id: number) => {
    setConnections(connections.filter((connection) => connection.id !== id));
    toast({
      title: "Connection deleted",
      description: "The connection has been deleted successfully.",
    });
  };

  const toggleConnectionStatus = (id: number) => {
    setConnections(
      connections.map((connection) =>
        connection.id === id
          ? {
              ...connection,
              status: connection.status === "Connected" ? "Disconnected" : "Connected",
            }
          : connection
      )
    );
    
    const connection = connections.find(c => c.id === id);
    if (!connection) return;
    
    const newStatus = connection.status === "Connected" ? "Disconnected" : "Connected";
    
    toast({
      title: `Connection ${newStatus.toLowerCase()}`,
      description: `${connection.name} is now ${newStatus.toLowerCase()}.`,
    });
  };

  const openEditDialog = (connection: Connection) => {
    setCurrentConnection(connection);
    setIsEditDialogOpen(true);
  };

  // AG Grid column definitions
  const columnDefs = useMemo<ColDef<Connection>[]>(() => [
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { 
      headerName: "Type", 
      field: "type", 
      sortable: true, 
      filter: true,
      cellRenderer: (params) => (
        <div className="flex items-center">
          <Database className="mr-2 h-4 w-4" />
          {params.value}
        </div>
      )
    },
    { 
      headerName: "Host", 
      field: "host", 
      sortable: true, 
      filter: true,
      valueGetter: (params) => `${params.data?.host}:${params.data?.port}`
    },
    { headerName: "Database", field: "database", sortable: true, filter: true },
    { headerName: "Username", field: "username", sortable: true, filter: true },
    { 
      headerName: "Status", 
      field: "status", 
      sortable: true, 
      filter: true,
      cellRenderer: (params) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            params.value === "Connected"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {params.value}
        </span>
      )
    },
    {
      headerName: "Actions",
      field: "id",
      sortable: false,
      filter: false,
      width: 150,
      cellRenderer: (params) => {
        const connection = connections.find(c => c.id === params.value);
        if (!connection) return null;
        
        return (
          <div className="flex justify-end space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleConnectionStatus(connection.id)}
              title={connection.status === "Connected" ? "Disconnect" : "Connect"}
            >
              {connection.status === "Connected" ? (
                <X className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditDialog(connection)}
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteConnection(connection.id)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ], [connections]);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    resizable: true,
  }), []);

  return (
    <div className="mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Connection Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Connection
        </Button>
      </div>

       <div className="ag-theme-alpine w-full h-[500px]">
            <AgGridReact
              rowData={connections}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              animateRows={true}
              rowSelection="single"
              pagination={true}
              paginationPageSize={10}
            />
          </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Database Connection</DialogTitle>
          </DialogHeader>
          <ConnectionForm 
            onSubmit={handleAddConnection} 
            onCancel={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Connection</DialogTitle>
          </DialogHeader>
          <ConnectionForm
            connection={currentConnection}
            onSubmit={handleEditConnection}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConnectionManagement;
