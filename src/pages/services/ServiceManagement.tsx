import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Edit, Trash2, Play, Database, FileText, Search, Filter, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ServiceForm from "@/components/services/ServiceForm";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Define the service type
interface Service {
  id: number;
  name: string;
  type: string;
  status: string;
  category: string;
  source: string;
  endpoint: string;
  method: string;
  contentType: string;
  lastModified: string;
  createdBy: string;
  description: string;
}

// Mock service data
const mockServices: Service[] = [
  { 
    id: 1, 
    name: "User Data Service", 
    type: "Database Query", 
    status: "Active", 
    category: "Users", 
    source: "Main Database", 
    endpoint: "/api/users/user-data-service",
    method: "GET",
    contentType: "application/json",
    lastModified: "2024-03-15T10:30:00Z",
    createdBy: "John Doe",
    description: "Service to fetch user data from the main database"
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
    contentType: "application/json",
    lastModified: "2024-03-15T11:20:00Z",
    createdBy: "Jane Smith",
    description: "Service to manage product catalog using stored procedures"
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
    contentType: "application/json",
    lastModified: "2024-03-14T15:45:00Z",
    createdBy: "Mike Johnson",
    description: "Service to fetch analytics data from Google Analytics"
  },
];

const ServiceManagement = () => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Filter services based on search and filters
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = search === "" || 
        service.name.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase()) ||
        service.category.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || service.status === statusFilter;
      const matchesType = typeFilter === "all" || service.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [services, search, statusFilter, typeFilter]);

  const handleAddService = (serviceData: Partial<Service>) => {
    const newService = {
      id: services.length + 1,
      lastModified: new Date().toISOString(),
      createdBy: "Current User", // In a real app, this would be the logged-in user
      ...serviceData,
    } as Service;
    setServices([...services, newService]);
    setIsAddDialogOpen(false);
    toast({
      title: "Service created",
      description: `${serviceData.name} has been created successfully.`,
    });
  };

  const handleEditService = (serviceData: Partial<Service>) => {
    setServices(
      services.map((service) =>
        service.id === currentService?.id 
          ? { 
              ...service, 
              ...serviceData,
              lastModified: new Date().toISOString()
            } as Service 
          : service
      )
    );
    setIsEditDialogOpen(false);
    toast({
      title: "Service updated",
      description: `${serviceData.name} has been updated successfully.`,
    });
  };

  const openDeleteConfirmation = (service: Service) => {
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

  const openEditDialog = (service: Service) => {
    setCurrentService(service);
    setIsEditDialogOpen(true);
  };

  const navigateToServiceConfig = (serviceId: number) => {
    navigate(`/services/${serviceId}/configure`);
  };

  const navigateToConnections = () => {
    navigate("/connections");
  };

  const handleRefresh = () => {
    // In a real app, this would fetch fresh data from the server
    toast({
      title: "Refreshing data",
      description: "Service list has been refreshed.",
    });
  };

  // AG Grid column definitions
  const columnDefs = useMemo<ColDef<Service>[]>(() => [
    { 
      headerName: "Name", 
      field: "name", 
      sortable: true, 
      filter: true,
      flex: 1,
      cellRenderer: (params) => (
        <div className="flex flex-col">
          <span className="font-medium">{params.value}</span>
          <span className="text-sm text-muted-foreground">{params.data.description}</span>
        </div>
      )
    },
    { 
      headerName: "Category", 
      field: "category", 
      sortable: true, 
      filter: true,
      cellRenderer: (params) => (
        <Badge variant="outline">{params.value}</Badge>
      )
    },
    { 
      headerName: "Type", 
      field: "type", 
      sortable: true, 
      filter: true,
      cellRenderer: (params) => (
        <Badge variant="secondary">{params.value}</Badge>
      )
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
    { 
      headerName: "Source", 
      field: "source", 
      sortable: true, 
      filter: true 
    },
    { 
      headerName: "Method", 
      field: "method", 
      sortable: true, 
      filter: true,
      cellRenderer: (params) => (
        <Badge variant="outline" className={
          params.value === "GET" ? "bg-blue-100 text-blue-800" :
          params.value === "POST" ? "bg-green-100 text-green-800" :
          params.value === "PUT" ? "bg-yellow-100 text-yellow-800" :
          params.value === "DELETE" ? "bg-red-100 text-red-800" :
          "bg-gray-100 text-gray-800"
        }>
          {params.value}
        </Badge>
      )
    },
    { 
      headerName: "Last Modified", 
      field: "lastModified", 
      sortable: true, 
      filter: true,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleString();
      }
    },
    {
      headerName: "Actions",
      field: "id",
      width: 180,
      cellRenderer: (params) => {
        const service = services.find(s => s.id === params.value);
        if (!service) return null;
        
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
    <div className="mx-auto  space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Service Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage your database queries, stored procedures, and external API connections.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
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


          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Database Query">Database Query</SelectItem>
                <SelectItem value="Stored Procedure">Stored Procedure</SelectItem>
                <SelectItem value="External API">External API</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="ag-theme-alpine w-full h-[700px]">
            <AgGridReact
              rowData={filteredServices}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              animateRows={true}
              rowSelection="single"
              pagination={true}
              paginationPageSize={15}
            />
          </div>


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
