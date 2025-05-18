
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload, FolderPlus } from "lucide-react";
import { FileUploadDialog } from "@/components/file-management/FileUploadDialog";
import { CreateFolderDialog } from "@/components/file-management/CreateFolderDialog";
import { FileScheduleDialog } from "@/components/file-management/FileScheduleDialog";
import { FileCard } from "@/components/file-management/FileCard";
import { FileToolbar } from "@/components/file-management/FileToolbar";
import { FileSystemItem, FileItem, FolderItem } from "@/types/file-management";

const FileManagement = () => {
  const [files, setFiles] = useState<FileSystemItem[]>([
    {
      id: '1',
      name: 'Project Report.pdf',
      type: 'file',
      extension: 'pdf',
      size: 2457600, // 2.4 MB in bytes
      privacy: 'public',
      createdAt: '2023-05-15T10:30:00Z',
      updatedAt: '2023-05-15T10:30:00Z',
      scheduleStatus: 'active',
      url: '/files/project-report.pdf',
      thumbnailUrl: null,
      parentId: undefined
    },
    {
      id: '2',
      name: 'Company Logo.png',
      type: 'file',
      extension: 'png',
      size: 552960, // 540 KB in bytes
      privacy: 'public',
      createdAt: '2023-05-10T14:20:00Z',
      updatedAt: '2023-05-10T14:20:00Z',
      scheduleStatus: 'active',
      url: '/files/company-logo.png',
      thumbnailUrl: '/placeholder.svg',
      parentId: undefined
    },
    {
      id: '3',
      name: 'Documents',
      type: 'folder',
      createdAt: '2023-05-01T09:00:00Z',
      updatedAt: '2023-05-01T09:00:00Z',
      itemCount: 5,
      parentId: undefined
    }
  ]);

  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<FileSystemItem | null>(null);
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);

  // File operations
  const handleFileUpload = () => {
    setUploadDialogOpen(false);
    // In a real application, this would be updated after the actual upload
    // Refresh files list
    handleRefreshFiles();
  };

  const handleCreateFolder = () => {
    setCreateFolderDialogOpen(false);
    // In a real application, this would be updated after folder creation
    // Refresh files list
    handleRefreshFiles();
  };

  const handleRefreshFiles = () => {
    // In a real application, this would fetch the latest files from the backend
    // For now, we'll just refresh the UI
  };

  const handleFileSelect = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      // Navigate into folder
      setCurrentPath([...currentPath, item.name]);
      setCurrentFolderId(item.id);
    } else {
      // Select file
      setSelectedItem(selectedItem?.id === item.id ? null : item);
    }
  };

  const handleNavigateBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
      // Would need to get parent folder ID from backend in a real app
      setCurrentFolderId(undefined);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (by: string, value: string) => {
    // Implement filtering logic here
    console.log(`Filter by ${by}: ${value}`);
  };

  // Current folder path for breadcrumbs
  const folderPath = currentPath.map((name, index) => {
    // In a real app, we'd have the actual folder IDs
    return { id: `folder-${index}`, name };
  });

  // Filter files based on current path and search query
  const filteredFiles = files.filter(file => {
    // Filter by parent folder
    const inCurrentFolder = currentFolderId 
      ? file.parentId === currentFolderId
      : file.parentId === undefined;
    
    // Filter by search query
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return inCurrentFolder && matchesSearch;
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">File Management</h1>
      </div>

      {/* File Toolbar with navigation and search */}
      <FileToolbar 
        folderPath={folderPath}
        onNavigateToFolder={setCurrentFolderId}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onUploadComplete={handleRefreshFiles}
        onFolderCreated={handleRefreshFiles}
        currentFolderId={currentFolderId}
      />

      {/* File Gallery */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((item) => (
                <FileCard 
                  key={item.id} 
                  item={item}
                  onClick={handleFileSelect}
                  onDelete={(item) => {
                    // Delete implementation would go here
                    console.log(`Delete ${item.name}`);
                    handleRefreshFiles();
                  }}
                  onTogglePrivacy={item.type === 'file' ? (fileItem) => {
                    // Toggle privacy implementation would go here
                    console.log(`Toggle privacy for ${fileItem.name}`);
                    handleRefreshFiles();
                  } : undefined}
                  onSchedule={item.type === 'file' ? (fileItem) => {
                    setSelectedItem(fileItem);
                    setScheduleDialogOpen(true);
                  } : undefined}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">No files found in this location.</p>
                <Button 
                  variant="outline" 
                  onClick={() => setUploadDialogOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Files
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <FileUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        currentFolderId={currentFolderId}
        onUploadComplete={handleRefreshFiles}
      />
      
      <CreateFolderDialog
        open={isCreateFolderDialogOpen}
        onOpenChange={setCreateFolderDialogOpen}
        currentFolderId={currentFolderId}
        onFolderCreated={handleCreateFolder}
      />
      
      {selectedItem?.type === 'file' && (
        <FileScheduleDialog
          open={isScheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
          file={selectedItem as FileItem}
          onScheduleComplete={handleRefreshFiles}
        />
      )}
    </div>
  );
};

export default FileManagement;
