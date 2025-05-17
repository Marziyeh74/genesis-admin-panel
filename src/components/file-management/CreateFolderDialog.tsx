
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFolderId?: string;
  onFolderCreated: () => void;
}

export function CreateFolderDialog({
  open,
  onOpenChange,
  currentFolderId,
  onFolderCreated,
}: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("");

  const handleCreateFolder = () => {
    if (!folderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }
    
    // In a real app, we would create the folder on the server
    // For now, we'll just simulate a successful creation
    toast.success(`Folder "${folderName}" created successfully`);
    setFolderName("");
    onFolderCreated();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Create a new folder to organize your files.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="folderName">Folder Name</Label>
            <Input
              id="folderName"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateFolder}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
