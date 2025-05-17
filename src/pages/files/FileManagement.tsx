
import { useState, useEffect } from "react";
import { FileCard } from "@/components/file-management/FileCard";
import { FileToolbar } from "@/components/file-management/FileToolbar";
import { FileItem, FolderItem, FileSystemItem } from "@/types/file-management";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

// Mock data for demonstration
const mockFiles: FileSystemItem[] = [
  {
    id: "folder-1",
    name: "Images",
    type: "folder",
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-15T10:30:00Z",
    itemCount: 5
  },
  {
    id: "folder-2",
    name: "Documents",
    type: "folder",
    createdAt: "2023-06-20T14:45:00Z",
    updatedAt: "2023-06-25T09:15:00Z",
    itemCount: 12
  },
  {
    id: "file-1",
    name: "profile-picture.jpg",
    type: "file",
    extension: "jpg",
    size: 1024 * 25, // 25KB
    privacy: "public",
    createdAt: "2023-07-10T08:20:00Z",
    updatedAt: "2023-07-10T08:20:00Z",
    scheduleStatus: "active",
    scheduledStart: "2023-07-10T00:00:00Z",
    url: "https://example.com/files/profile-picture.jpg",
    thumbnailUrl: "https://example.com/thumbnails/profile-picture.jpg"
  },
  {
    id: "file-2",
    name: "project-proposal.pdf",
    type: "file",
    extension: "pdf",
    size: 1024 * 512, // 512KB
    privacy: "private",
    createdAt: "2023-08-05T16:40:00Z",
    updatedAt: "2023-08-05T16:40:00Z",
    scheduleStatus: "draft",
    url: "https://example.com/files/project-proposal.pdf"
  },
  {
    id: "file-3",
    name: "presentation.pptx",
    type: "file",
    extension: "pptx",
    size: 1024 * 1536, // 1.5MB
    privacy: "public",
    createdAt: "2023-08-15T11:25:00Z",
    updatedAt: "2023-08-15T11:25:00Z",
    scheduleStatus: "scheduled",
    scheduledStart: "2023-09-01T00:00:00Z",
    scheduledEnd: "2023-12-31T23:59:59Z",
    url: "https://example.com/files/presentation.pptx"
  },
  {
    id: "file-4",
    name: "data-analysis.xlsx",
    type: "file",
    extension: "xlsx",
    size: 1024 * 780, // 780KB
    privacy: "private",
    createdAt: "2023-08-20T09:10:00Z",
    updatedAt: "2023-08-20T09:10:00Z",
    scheduleStatus: "expired",
    scheduledStart: "2023-08-21T00:00:00Z",
    scheduledEnd: "2023-08-25T23:59:59Z",
    url: "https://example.com/files/data-analysis.xlsx"
  }
];

// Create a mock folder structure
const folderStructure: Record<string, FileSystemItem[]> = {
  "root": [...mockFiles],
  "folder-1": [
    {
      id: "file-5",
      name: "sunset.jpg",
      type: "file",
      extension: "jpg",
      size: 1024 * 450, // 450KB
      privacy: "public",
      createdAt: "2023-07-15T16:30:00Z",
      updatedAt: "2023-07-15T16:30:00Z",
      scheduleStatus: "active",
      scheduledStart: "2023-07-16T00:00:00Z",
      url: "https://example.com/files/sunset.jpg",
      thumbnailUrl: "https://example.com/thumbnails/sunset.jpg",
      parentId: "folder-1"
    },
    {
      id: "file-6",
      name: "mountains.png",
      type: "file",
      extension: "png",
      size: 1024 * 800, // 800KB
      privacy: "public",
      createdAt: "2023-07-18T14:20:00Z",
      updatedAt: "2023-07-18T14:20:00Z",
      scheduleStatus: "active",
      scheduledStart: "2023-07-19T00:00:00Z",
      url: "https://example.com/files/mountains.png",
      thumbnailUrl: "https://example.com/thumbnails/mountains.png",
      parentId: "folder-1"
    }
  ],
  "folder-2": [
    {
      id: "file-7",
      name: "report.docx",
      type: "file",
      extension: "docx",
      size: 1024 * 350, // 350KB
      privacy: "private",
      createdAt: "2023-06-22T10:15:00Z",
      updatedAt: "2023-06-22T10:15:00Z",
      scheduleStatus: "draft",
      url: "https://example.com/files/report.docx",
      parentId: "folder-2"
    },
    {
      id: "folder-3",
      name: "Archived",
      type: "folder",
      createdAt: "2023-06-22T10:18:00Z",
      updatedAt: "2023-06-22T10:18:00Z",
      itemCount: 3,
      parentId: "folder-2"
    }
  ]
};

export default function FileManagement() {
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [displayedItems, setDisplayedItems] = useState<FileSystemItem[]>([]);
  const [folderPath, setFolderPath] = useState<{ id: string; name: string }[]>([]);
  const [selectedItem, setSelectedItem] = useState<FileSystemItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Load files from the current folder
  useEffect(() => {
    const folderKey = currentFolderId || "root";
    const items = folderStructure[folderKey] || [];
    setDisplayedItems(items);
    
    // Update the folder path
    if (currentFolderId) {
      const folder = findFolder(currentFolderId);
      if (folder) {
        if (folder.parentId) {
          const parentPath = buildPathToFolder(folder.parentId);
          setFolderPath([...parentPath, { id: folder.id, name: folder.name }]);
        } else {
          setFolderPath([{ id: folder.id, name: folder.name }]);
        }
      }
    } else {
      setFolderPath([]);
    }
  }, [currentFolderId]);

  // Utility function to find a folder by ID recursively
  const findFolder = (folderId: string): FolderItem | undefined => {
    for (const key in folderStructure) {
      const items = folderStructure[key];
      const folder = items.find(
        item => item.id === folderId && item.type === "folder"
      ) as FolderItem | undefined;
      
      if (folder) {
        return folder;
      }
    }
    return undefined;
  };
  
  // Build the path to a folder
  const buildPathToFolder = (folderId: string): { id: string; name: string }[] => {
    const folder = findFolder(folderId);
    if (!folder) return [];
    
    if (folder.parentId) {
      const parentPath = buildPathToFolder(folder.parentId);
      return [...parentPath, { id: folder.id, name: folder.name }];
    }
    
    return [{ id: folder.id, name: folder.name }];
  };

  // Handle item click (navigate into folders)
  const handleItemClick = (item: FileSystemItem) => {
    if (item.type === "folder") {
      setCurrentFolderId(item.id);
    } else {
      setSelectedItem(item);
      setDetailsOpen(true);
    }
  };

  // Handle delete item
  const handleDeleteItem = (item: FileSystemItem) => {
    // In a real app, you would delete the item from the server
    // For demo, we'll just remove it from our state
    const folderKey = currentFolderId || "root";
    folderStructure[folderKey] = folderStructure[folderKey].filter(
      i => i.id !== item.id
    );
    setDisplayedItems(folderStructure[folderKey]);
  };

  // Handle toggle privacy
  const handleTogglePrivacy = (file: FileItem) => {
    // In a real app, you would update the file on the server
    file.privacy = file.privacy === "public" ? "private" : "public";
    setDisplayedItems([...displayedItems]);
    toast.success(`File privacy updated to ${file.privacy}`);
  };

  // Handle schedule file
  const handleScheduleFile = (file: FileItem) => {
    // This would be handled by the FileScheduleDialog component
    // We just need to refresh our display after it's done
    setDisplayedItems([...displayedItems]);
  };

  // Handle search
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      // Reset to current folder content if search is cleared
      const folderKey = currentFolderId || "root";
      setDisplayedItems(folderStructure[folderKey] || []);
      return;
    }
    
    // Perform search across all items
    const results: FileSystemItem[] = [];
    
    for (const key in folderStructure) {
      const items = folderStructure[key];
      const matches = items.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      results.push(...matches);
    }
    
    setDisplayedItems(results);
    toast.info(`Found ${results.length} item${results.length !== 1 ? 's' : ''}`);
  };

  // Handle filter
  const handleFilter = (by: string, value: string) => {
    const folderKey = currentFolderId || "root";
    let items = folderStructure[folderKey] || [];
    
    if (value !== "all") {
      if (by === "type") {
        // Filter by file type
        if (value === "image") {
          items = items.filter(item => 
            item.type === "file" && 
            ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes((item as FileItem).extension)
          );
        } else if (value === "document") {
          items = items.filter(item => 
            item.type === "file" && 
            ["pdf", "doc", "docx", "txt", "rtf"].includes((item as FileItem).extension)
          );
        } else if (value === "video") {
          items = items.filter(item => 
            item.type === "file" && 
            ["mp4", "webm", "avi", "mov"].includes((item as FileItem).extension)
          );
        } else if (value === "audio") {
          items = items.filter(item => 
            item.type === "file" && 
            ["mp3", "wav", "ogg"].includes((item as FileItem).extension)
          );
        }
      } else if (by === "privacy") {
        // Filter by privacy
        items = items.filter(item => 
          item.type === "file" && (item as FileItem).privacy === value
        );
      }
    }
    
    setDisplayedItems(items);
  };

  // Handle folder navigation
  const handleNavigateToFolder = (folderId?: string) => {
    setCurrentFolderId(folderId);
  };

  // Handle file upload completion
  const handleUploadComplete = () => {
    // In a real app, we would refresh data from server
    toast.success("Files uploaded successfully");
    // For demo purposes, we're already showing mock data
  };

  // Handle folder creation
  const handleFolderCreated = () => {
    // In a real app, we would refresh data from server
    toast.success("Folder created successfully");
    // For demo purposes, we're already showing mock data
  };

  // Pagination
  const totalPages = Math.ceil(displayedItems.length / itemsPerPage);
  const paginatedItems = displayedItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">File Management</h2>
        <p className="text-muted-foreground">
          Manage your files and folders with privacy controls and scheduling options.
        </p>
      </div>

      <FileToolbar
        currentFolderId={currentFolderId}
        folderPath={folderPath}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onNavigateToFolder={handleNavigateToFolder}
        onUploadComplete={handleUploadComplete}
        onFolderCreated={handleFolderCreated}
      />

      {paginatedItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No files or folders found</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setCreateFolderDialogOpen(true)}
                className="text-primary hover:underline"
              >
                Create a folder
              </button>
              <button
                onClick={() => setUploadDialogOpen(true)}
                className="text-primary hover:underline"
              >
                Upload files
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedItems.map((item) => (
              <FileCard
                key={item.id}
                item={item}
                onClick={handleItemClick}
                onDelete={handleDeleteItem}
                onTogglePrivacy={item.type === "file" ? handleTogglePrivacy : undefined}
                onSchedule={item.type === "file" ? handleScheduleFile : undefined}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(Math.max(page - 1, 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={page === pageNum}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(Math.min(page + 1, totalPages))}
                    className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      <Drawer open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>File Details</DrawerTitle>
            <DrawerDescription>
              View and edit file information
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            {selectedItem && selectedItem.type === "file" && (
              <div className="space-y-4">
                <div className="flex justify-center py-4">
                  {(selectedItem as FileItem).extension === "jpg" || 
                   (selectedItem as FileItem).extension === "png" ? (
                    <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                      <img 
                        src={(selectedItem as FileItem).thumbnailUrl || "https://via.placeholder.com/200"} 
                        alt={selectedItem.name}
                        className="max-w-full max-h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                      <File className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>File Name</Label>
                    <p className="mt-1">{selectedItem.name}</p>
                  </div>
                  <div>
                    <Label>Size</Label>
                    <p className="mt-1">{Math.round((selectedItem as FileItem).size / 1024)} KB</p>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <p className="mt-1">{(selectedItem as FileItem).extension.toUpperCase()}</p>
                  </div>
                  <div>
                    <Label>Privacy</Label>
                    <p className="mt-1 capitalize">{(selectedItem as FileItem).privacy}</p>
                  </div>
                  <div>
                    <Label>Created</Label>
                    <p className="mt-1">{new Date(selectedItem.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Schedule Status</Label>
                    <p className="mt-1 capitalize">{(selectedItem as FileItem).scheduleStatus || "None"}</p>
                  </div>
                  
                  {(selectedItem as FileItem).scheduleStatus !== "draft" && (
                    <>
                      <div>
                        <Label>Start Date</Label>
                        <p className="mt-1">
                          {new Date((selectedItem as FileItem).scheduledStart || "").toLocaleDateString()}
                        </p>
                      </div>
                      {(selectedItem as FileItem).scheduledEnd && (
                        <div>
                          <Label>End Date</Label>
                          <p className="mt-1">
                            {new Date((selectedItem as FileItem).scheduledEnd).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
