
import { useState } from "react";
import { FileItem, FolderItem } from "@/types/file-management";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FileScheduleDialog } from "./FileScheduleDialog";
import { 
  Calendar, 
  Clock, 
  Download, 
  Eye, 
  EyeOff, 
  File, 
  Folder, 
  Lock, 
  MoreHorizontal, 
  Pencil, 
  Trash, 
  Unlock 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

interface FileCardProps {
  item: FileItem | FolderItem;
  onClick?: (item: FileItem | FolderItem) => void;
  onDelete?: (item: FileItem | FolderItem) => void;
  onTogglePrivacy?: (item: FileItem) => void;
  onSchedule?: (item: FileItem) => void;
}

export function FileCard({ 
  item, 
  onClick, 
  onDelete,
  onTogglePrivacy,
  onSchedule
}: FileCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  
  const isFolder = item.type === "folder";
  const isFile = item.type === "file";
  
  const getFileIcon = () => {
    if (isFolder) return <Folder className="h-16 w-16 text-blue-500" />;
    
    // Add more file type icons based on extension if needed
    return <File className="h-16 w-16 text-gray-500" />;
  };
  
  const getScheduleStatusBadge = () => {
    if (!isFile || !item.scheduleStatus || item.scheduleStatus === "draft") return null;
    
    const badgeClasses = {
      scheduled: "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-800",
      expired: "bg-gray-100 text-gray-800"
    };
    
    return (
      <div className={cn(
        "absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium",
        badgeClasses[item.scheduleStatus]
      )}>
        {item.scheduleStatus}
      </div>
    );
  };
  
  const getPrivacyIcon = () => {
    if (!isFile) return null;
    return item.privacy === "private" ? (
      <Lock className="h-4 w-4 text-red-500" />
    ) : (
      <Unlock className="h-4 w-4 text-green-500" />
    );
  };
  
  const handleCardClick = () => {
    if (onClick) onClick(item);
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(item);
      toast.success(`${item.name} deleted successfully`);
    }
    setDeleteDialogOpen(false);
  };
  
  const handleTogglePrivacy = () => {
    if (isFile && onTogglePrivacy) {
      onTogglePrivacy(item as FileItem);
    }
  };
  
  const handleSchedule = () => {
    if (isFile && onSchedule) {
      setScheduleDialogOpen(true);
    }
  };

  return (
    <>
      <Card 
        className={cn(
          "relative overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group",
          isFolder && "bg-blue-50/30"
        )}
        onClick={handleCardClick}
      >
        {getScheduleStatusBadge()}
        
        <CardContent className="p-4 flex flex-col items-center">
          <div className="flex items-center justify-center h-24 w-full mb-2">
            {getFileIcon()}
          </div>
          
          <div className="w-full text-center">
            <h3 className="text-sm font-medium truncate w-full">{item.name}</h3>
            
            <div className="flex items-center justify-center mt-2 gap-2 text-xs text-gray-500">
              {isFile && (
                <>
                  <span className="inline-flex items-center">
                    {getPrivacyIcon()}
                  </span>
                  <span>{Math.round((item as FileItem).size / 1024)} KB</span>
                </>
              )}
              
              {isFolder && (
                <span>{(item as FolderItem).itemCount} items</span>
              )}
            </div>
            
            {isFile && (item as FileItem).scheduleStatus !== "draft" && (
              <div className="mt-2 text-xs text-gray-500">
                <div className="flex items-center justify-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {format(new Date((item as FileItem).scheduledStart || item.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {isFile && (
                  <>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleTogglePrivacy(); }}>
                      {(item as FileItem).privacy === "private" ? (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Make Public</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          <span>Make Private</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSchedule(); }}>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Schedule</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open("#", "_blank"); }}>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Download</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setDeleteDialogOpen(true); 
                  }}
                  className="text-red-500 focus:text-red-500"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {item.name}
              {isFolder && " and all its contents"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {isFile && (
        <FileScheduleDialog
          open={scheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
          file={item as FileItem}
          onScheduleComplete={() => {
            if (onSchedule) onSchedule(item as FileItem);
          }}
        />
      )}
    </>
  );
}
