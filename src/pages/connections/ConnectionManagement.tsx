
import React, { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Check, X, Server, Database } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ConnectionForm from "@/components/connections/ConnectionForm";

// Mock connections data
const mockConnections = [
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
  const [connections, setConnections] = useState(mockConnections);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentConnection, setCurrentConnection] = useState(null);
  const { toast } = useToast();

  const handleAddConnection = (connectionData) => {
    const newConnection = {
      id: connections.length + 1,
      ...connectionData,
      status: "Connected", // Assume successful connection for mock
    };
    setConnections([...connections, newConnection]);
    setIsAddDialogOpen(false);
    toast({
      title: "Connection created",
      description: `${connectionData.name} has been created successfully.`,
    });
  };

  const handleEditConnection = (connectionData) => {
    setConnections(
      connections.map((connection) =>
        connection.id === currentConnection.id ? { ...connection, ...connectionData } : connection
      )
    );
    setIsEditDialogOpen(false);
    toast({
      title: "Connection updated",
      description: `${connectionData.name} has been updated successfully.`,
    });
  };

  const handleDeleteConnection = (id) => {
    setConnections(connections.filter((connection) => connection.id !== id));
    toast({
      title: "Connection deleted",
      description: "The connection has been deleted successfully.",
    });
  };

  const toggleConnectionStatus = (id) => {
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
    const newStatus = connection.status === "Connected" ? "Disconnected" : "Connected";
    
    toast({
      title: `Connection ${newStatus.toLowerCase()}`,
      description: `${connection.name} is now ${newStatus.toLowerCase()}.`,
    });
  };

  const openEditDialog = (connection) => {
    setCurrentConnection(connection);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Connection Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Connection
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Connections</CardTitle>
          <CardDescription>
            Manage connections to your databases for services and schema management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Database</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connections.map((connection) => (
                <TableRow key={connection.id}>
                  <TableCell className="font-medium">{connection.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Database className="mr-2 h-4 w-4" />
                      {connection.type}
                    </div>
                  </TableCell>
                  <TableCell>{`${connection.host}:${connection.port}`}</TableCell>
                  <TableCell>{connection.database}</TableCell>
                  <TableCell>{connection.username}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        connection.status === "Connected"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {connection.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
