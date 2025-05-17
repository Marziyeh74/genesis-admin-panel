
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUploadDialog } from "./FileUploadDialog";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { Search, Filter, FolderPlus, Upload, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileToolbarProps {
  currentFolderId?: string;
  folderPath?: { id: string; name: string }[];
  onSearch: (query: string) => void;
  onFilter: (by: string, value: string) => void;
  onNavigateToFolder?: (folderId?: string) => void;
  onUploadComplete: () => void;
  onFolderCreated: () => void;
}

export function FileToolbar({
  currentFolderId,
  folderPath,
  onSearch,
  onFilter,
  onNavigateToFolder,
  onUploadComplete,
  onFolderCreated,
}: FileToolbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="mb-6 space-y-4">
      {folderPath && folderPath.length > 0 && (
        <nav className="flex items-center space-x-1 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateToFolder && onNavigateToFolder(undefined)}
            className="h-8 mr-1"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Root
          </Button>
          
          {folderPath.map((folder, idx) => (
            <div key={folder.id} className="flex items-center">
              <span className="mx-1 text-gray-500">/</span>
              {idx === folderPath.length - 1 ? (
                <span className="font-medium">{folder.name}</span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigateToFolder && onNavigateToFolder(folder.id)}
                  className="h-8"
                >
                  {folder.name}
                </Button>
              )}
            </div>
          ))}
        </nav>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} className="shrink-0">
            Search
          </Button>
        </div>

        <div className="flex space-x-2">
          <Select onValueChange={(value) => onFilter("type", value)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="File Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => onFilter("privacy", value)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Privacy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setCreateFolderDialogOpen(true)}
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>

          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <FileUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        currentFolderId={currentFolderId}
        onUploadComplete={onUploadComplete}
      />

      <CreateFolderDialog
        open={createFolderDialogOpen}
        onOpenChange={setCreateFolderDialogOpen}
        currentFolderId={currentFolderId}
        onFolderCreated={onFolderCreated}
      />
    </div>
  );
}
