
export type FilePrivacy = "public" | "private";

export type FileScheduleStatus = "scheduled" | "active" | "expired" | "draft";

export interface FileItem {
  id: string;
  name: string;
  type: "file";
  extension: string;
  size: number;
  privacy: FilePrivacy;
  createdAt: string;
  updatedAt: string;
  scheduleStatus: FileScheduleStatus;
  scheduledStart?: string;
  scheduledEnd?: string;
  url: string;
  thumbnailUrl?: string;
  parentId?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  type: "folder";
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  parentId?: string;
}

export type FileSystemItem = FileItem | FolderItem;
