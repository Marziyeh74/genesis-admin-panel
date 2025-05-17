
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FilePrivacy } from "@/types/file-management";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFolderId?: string;
  onUploadComplete: () => void;
}

export function FileUploadDialog({
  open,
  onOpenChange,
  currentFolderId,
  onUploadComplete,
}: FileUploadDialogProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [privacy, setPrivacy] = useState<FilePrivacy>("public");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
  };

  const handleUpload = () => {
    if (!files || files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }
    
    // In a real app, we would upload the files to the server
    // For now, we'll just simulate a successful upload
    toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully`);
    onUploadComplete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Upload files to your file management system.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="files">Select Files</Label>
            <Input
              id="files"
              type="file"
              multiple
              onChange={handleFilesSelected}
            />
          </div>

          <div className="grid gap-2">
            <Label>Privacy</Label>
            <RadioGroup
              value={privacy}
              onValueChange={(value) => setPrivacy(value as FilePrivacy)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">Public</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">Private</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                id="schedule"
                className="w-4 h-4"
                checked={scheduleEnabled}
                onChange={(e) => setScheduleEnabled(e.target.checked)}
              />
              <Label htmlFor="schedule">Schedule availability</Label>
            </div>

            {scheduleEnabled && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) =>
                          startDate ? date < startDate : false
                        }
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
