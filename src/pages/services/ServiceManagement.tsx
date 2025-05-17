
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Play, Database, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ServiceForm from "@/components/services/ServiceForm";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Mock service data
const mockServices = [
  { 
    id: 1, 
    name: "User Data Service", 
    type: "Database Query", 
    status: "Active", 
    category: "Users", 
    source: "Main Database", 
    endpoint: "/api/users/user-data-service",
    method: "GET",
    contentType: "application/json" 
  },
  { 
    id: 2, 
    name: "Product Catalog", 
    type: "Stored Procedure", 
    status: "Active", 
    category: "Products", 
    source: "Products DB", 
    endpoint: "/api/products/product-catalog",
    method: "POST",
    contentType: "application/json" 
  },
  { 
    id: 3, 
    name: "Analytics Service", 
    type: "External API", 
    status: "Inactive", 
    category: "Analytics", 
    source: "Google Analytics", 
    endpoint: "/api/analytics/analytics-service",
    method: "GET",
    contentType: "application/json" 
  },
];

const ServiceManagement = () => {
  const [services, setServices] = useState(mockServices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
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

  const openDeleteConfirmation = (service) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteService = () => {
    if (!serviceToDelete) return;
    
    setServices(services.filter((service) => service.id !== serviceToDelete.id));
    setIsDeleteDialogOpen(false);
    setServiceToDelete(null);
    
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

  // AG Grid column definitions
  const columnDefs = useMemo(() => [
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { headerName: "Category", field: "category", sortable: true, filter: true },
    { 
      headerName: "Type", 
      field: "type", 
      sortable: true, 
      filter: true 
    },
    { 
      headerName: "Status", 
      field: "status", 
      sortable: true, 
      filter: true,
      cellRenderer: (params) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            params.value === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    { headerName: "Source", field: "source", sortable: true, filter: true },
    { headerName: "Method", field: "method", sortable: true, filter: true },
    { headerName: "Endpoint", field: "endpoint", sortable: true, filter: true },
    {
      headerName: "Actions",
      field: "id",
      width: 180,
      cellRenderer: (params) => {
        const service = services.find(s => s.id === params.value);
        return (
          <TooltipProvider>
            <div className="flex items-center justify-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateToServiceConfig(service.id)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Configure Service</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Service</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteConfirmation(service)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Service</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/services/${service.id}/test`)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Test Service</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        );
      },
    },
  ], [services, navigate]);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    resizable: true,
  }), []);

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
          <div className="ag-theme-alpine w-full h-[500px]">
            <AgGridReact
              rowData={services}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              animateRows={true}
              rowSelection="single"
              pagination={true}
              paginationPageSize={10}
            />
          </div>
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service
              {serviceToDelete && `: ${serviceToDelete.name}`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteService}>
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServiceManagement;
