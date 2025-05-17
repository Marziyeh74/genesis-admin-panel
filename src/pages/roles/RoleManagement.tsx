
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { RoleForm } from "@/components/roles/RoleForm";
import { toast } from "@/components/ui/use-toast";
import { PlusCircle, Pencil, ShieldX } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Define role type
type Role = {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
};

// Mock permissions data
const availablePermissions = [
  "view:users",
  "create:users",
  "update:users",
  "delete:users",
  "view:roles",
  "create:roles",
  "update:roles",
  "delete:roles",
  "view:services",
  "create:services",
  "update:services",
  "delete:services",
  "view:files",
  "upload:files",
  "delete:files",
  "view:logs",
  "view:database",
  "update:database",
  "view:connections",
  "create:connections",
  "update:connections",
  "delete:connections",
];

// Mock role data
const mockRoles = [
  {
    id: 1,
    name: "Admin",
    description: "Full system access",
    permissions: ["view:users", "create:users", "update:users", "delete:users", "view:roles", "create:roles", "update:roles", "delete:roles"],
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Editor",
    description: "Can edit content but cannot delete",
    permissions: ["view:users", "update:users", "view:roles"],
    createdAt: "2025-02-20T14:30:00Z",
  },
  {
    id: 3,
    name: "Viewer",
    description: "Read-only access",
    permissions: ["view:users", "view:roles"],
    createdAt: "2025-03-10T09:15:00Z",
  },
];

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      role.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddRole = (data: Omit<Role, "id" | "createdAt">) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newRole: Role = {
        id: roles.length > 0 ? Math.max(...roles.map(role => role.id)) + 1 : 1,
        createdAt: new Date().toISOString(),
        ...data,
      };
      
      setRoles([...roles, newRole]);
      setIsAddModalOpen(false);
      setIsSubmitting(false);
      
      toast({
        title: "Role added",
        description: "The new role has been added successfully.",
      });
    }, 1000);
  };

  const handleUpdateRole = (data: Omit<Role, "id" | "createdAt">) => {
    if (!selectedRole) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedRoles = roles.map(role => 
        role.id === selectedRole.id ? { ...role, ...data } : role
      );
      
      setRoles(updatedRoles);
      setIsEditModalOpen(false);
      setSelectedRole(null);
      setIsSubmitting(false);
      
      toast({
        title: "Role updated",
        description: "The role has been updated successfully.",
      });
    }, 1000);
  };

  const handleDeleteRole = () => {
    if (!selectedRole) return;
    
    // Simulate API call
    const updatedRoles = roles.filter(role => role.id !== selectedRole.id);
    setRoles(updatedRoles);
    setIsDeleteDialogOpen(false);
    setSelectedRole(null);
    
    toast({
      title: "Role deleted",
      description: "The role has been deleted successfully.",
      variant: "destructive",
    });
  };

  const openEditModal = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // AG Grid column definitions
  const columnDefs = useMemo<ColDef<Role>[]>(() => [
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { headerName: "Description", field: "description", sortable: true, filter: true },
    { 
      headerName: "Permissions", 
      field: "permissions", 
      sortable: false, 
      filter: false,
      cellRenderer: (params: any) => {
        const permissions = params.value;
        if (!permissions || !permissions.length) return "No permissions";
        
        return (
          <div className="flex flex-wrap gap-1">
            {permissions.length > 3 ? (
              <>
                {permissions.slice(0, 2).map((permission: string) => (
                  <span
                    key={permission}
                    className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                  >
                    {permission}
                  </span>
                ))}
                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
                  +{permissions.length - 2} more
                </span>
              </>
            ) : (
              permissions.map((permission: string) => (
                <span
                  key={permission}
                  className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                >
                  {permission}
                </span>
              ))
            )}
          </div>
        );
      }
    },
    { 
      headerName: "Created At", 
      field: "createdAt", 
      sortable: true, 
      filter: true,
      cellRenderer: (params: any) => formatDate(params.value)
    },
    {
      headerName: "Actions",
      field: "id",
      sortable: false,
      filter: false,
      width: 180,
      cellRenderer: (params: any) => {
        const role = roles.find(r => r.id === params.value);
        if (!role) return null;
        
        return (
          <div className="flex items-center justify-end space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => openEditModal(role)}
              className="flex items-center"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 flex items-center"
              onClick={() => openDeleteDialog(role)}
            >
              <ShieldX className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        );
      }
    }
  ], [roles]);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    resizable: true,
  }), []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Role Management</h2>
          <p className="text-muted-foreground">
            Create and manage roles with different permissions.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Role
        </Button>
      </div>

      <div className="flex items-center mt-4">
        <Input
          placeholder="Search roles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="ag-theme-alpine w-full h-[500px]">
        <AgGridReact
          rowData={filteredRoles}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          rowSelection="single"
          pagination={true}
          paginationPageSize={10}
        />
      </div>

      {/* Add Role Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Create a new role with specific permissions.
            </DialogDescription>
          </DialogHeader>
          <RoleForm 
            onSubmit={handleAddRole} 
            isSubmitting={isSubmitting} 
            availablePermissions={availablePermissions}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Role Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update the role details and permissions.
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <RoleForm 
              defaultValues={{
                name: selectedRole.name,
                description: selectedRole.description,
                permissions: selectedRole.permissions,
              }}
              onSubmit={handleUpdateRole}
              isSubmitting={isSubmitting}
              availablePermissions={availablePermissions}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role
              {selectedRole && ` "${selectedRole.name}"`} and may affect users with this role.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRole} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
