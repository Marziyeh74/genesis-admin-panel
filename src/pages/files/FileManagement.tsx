
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload, FolderPlus } from "lucide-react";
import { FileUploadDialog } from "@/components/file-management/FileUploadDialog";
import { CreateFolderDialog } from "@/components/file-management/CreateFolderDialog";
import { FileScheduleDialog } from "@/components/file-management/FileScheduleDialog";
import { FileCard } from "@/components/file-management/FileCard";
import { FileToolbar } from "@/components/file-management/FileToolbar";
import { FileItem } from "@/types/file-management";

const FileManagement = () => {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Project Report.pdf',
      type: 'pdf',
      size: '2.4 MB',
      lastModified: new Date('2023-05-15'),
      isPublic: true,
      tags: ['report', 'project'],
      thumbnail: null
    },
    {
      id: '2',
      name: 'Company Logo.png',
      type: 'image',
      size: '540 KB',
      lastModified: new Date('2023-05-10'),
      isPublic: true,
      tags: ['logo', 'branding'],
      thumbnail: '/placeholder.svg'
    },
    // More sample files...
  ]);

  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // File operations
  const handleFileUpload = (newFiles: FileItem[]) => {
    setFiles([...files, ...newFiles]);
    setUploadDialogOpen(false);
  };

  const handleCreateFolder = (folderName: string) => {
    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: folderName,
      type: 'folder',
      size: '0 KB',
      lastModified: new Date(),
      isPublic: false,
      tags: [],
      thumbnail: null
    };
    
    setFiles([...files, newFolder]);
    setCreateFolderDialogOpen(false);
  };

  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'folder') {
      // Navigate into folder
      setCurrentPath([...currentPath, file.name]);
    } else {
      // Select file
      setSelectedFile(selectedFile?.id === file.id ? null : file);
    }
  };

  const handleNavigateBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter files based on current path and search query
  const filteredFiles = files.filter(file => {
    return file.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">File Management</h1>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setCreateFolderDialogOpen(true)} 
            variant="outline"
            className="flex items-center"
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button 
            onClick={() => setUploadDialogOpen(true)}
            className="flex items-center"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* File Toolbar with navigation and search */}
      <FileToolbar 
        currentPath={currentPath} 
        onNavigateBack={handleNavigateBack}
        onSearch={handleSearch}
      />

      {/* File Gallery */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <FileCard 
                  key={file.id} 
                  file={file}
                  isSelected={selectedFile?.id === file.id}
                  onClick={() => handleFileSelect(file)}
                  onSchedule={() => {
                    setSelectedFile(file);
                    setScheduleDialogOpen(true);
                  }}
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
        onUpload={handleFileUpload}
      />
      
      <CreateFolderDialog
        open={isCreateFolderDialogOpen}
        onOpenChange={setCreateFolderDialogOpen}
        onCreateFolder={handleCreateFolder}
      />
      
      <FileScheduleDialog
        open={isScheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        file={selectedFile}
      />
    </div>
  );
};

export default FileManagement;
