
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
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FileItem } from "@/types/file-management";
import { toast } from "sonner";

interface FileScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file?: FileItem;
  onScheduleComplete: () => void;
}

export function FileScheduleDialog({
  open,
  onOpenChange,
  file,
  onScheduleComplete,
}: FileScheduleDialogProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    file?.scheduledStart ? new Date(file.scheduledStart) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    file?.scheduledEnd ? new Date(file.scheduledEnd) : undefined
  );

  const handleSaveSchedule = () => {
    if (!startDate) {
      toast.error("Please select a start date");
      return;
    }
    
    // In a real app, we would update the file's schedule on the server
    // For now, we'll just simulate a successful update
    toast.success("File schedule updated successfully");
    onScheduleComplete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule File Availability</DialogTitle>
          <DialogDescription>
            Set when the file will be publicly available.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {file && (
            <div className="text-sm">
              <span className="font-medium">File: </span>
              {file.name}
            </div>
          )}
          
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
                  {startDate ? format(startDate, "PPP") : "Select start date"}
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
                  {endDate ? format(endDate, "PPP") : "Select end date (optional)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => startDate ? date < startDate : false}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSchedule}>Save Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
