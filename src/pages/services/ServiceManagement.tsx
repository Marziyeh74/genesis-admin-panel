
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Play, Database, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ServiceForm from "@/components/services/ServiceForm";

// Mock service data
const mockServices = [
  { id: 1, name: "User Data Service", type: "Database Query", status: "Active", source: "Main Database", endpoint: "/api/v1/users" },
  { id: 2, name: "Product Catalog", type: "Stored Procedure", status: "Active", source: "Products DB", endpoint: "/api/v1/products" },
  { id: 3, name: "Analytics Service", type: "External API", status: "Inactive", source: "Google Analytics", endpoint: "/api/v1/analytics" },
];

const ServiceManagement = () => {
  const [services, setServices] = useState(mockServices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddService = (serviceData) => {
    const newService = {
      id: services.length + 1,
      ...serviceData,
    };
    setServices([...services, newService]);
    setIsAddDialogOpen(false);
    toast({
      title: "Service created",
      description: `${serviceData.name} has been created successfully.`,
    });
  };

  const handleEditService = (serviceData) => {
    setServices(
      services.map((service) =>
        service.id === currentService.id ? { ...service, ...serviceData } : service
      )
    );
    setIsEditDialogOpen(false);
    toast({
      title: "Service updated",
      description: `${serviceData.name} has been updated successfully.`,
    });
  };

  const handleDeleteService = (id) => {
    setServices(services.filter((service) => service.id !== id));
    toast({
      title: "Service deleted",
      description: "The service has been deleted successfully.",
    });
  };

  const openEditDialog = (service) => {
    setCurrentService(service);
    setIsEditDialogOpen(true);
  };

  const navigateToServiceConfig = (serviceId) => {
    navigate(`/services/${serviceId}/configure`);
  };

  const navigateToConnections = () => {
    navigate("/connections");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Service Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={navigateToConnections}>
            <Database className="mr-2 h-4 w-4" />
            Manage Connections
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
          <CardDescription>
            Manage your database queries, stored procedures, and external API connections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.type}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        service.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {service.status}
                    </span>
                  </TableCell>
                  <TableCell>{service.source}</TableCell>
                  <TableCell className="font-mono text-xs">{service.endpoint}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateToServiceConfig(service.id)}
                        title="Configure"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(service)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/services/${service.id}/test`)}
                        title="Test Service"
                      >
                        <Play className="h-4 w-4" />
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
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <ServiceForm onSubmit={handleAddService} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <ServiceForm
            service={currentService}
            onSubmit={handleEditService}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceManagement;
