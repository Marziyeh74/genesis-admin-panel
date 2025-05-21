
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Shield,
  FileText,
  Server,
  Database,
  Settings,
  Activity,
  Folder,
  Scroll,
  Table,
  Columns,
} from "lucide-react";

interface SidebarNavProps {
  className?: string;
  isCollapsed: boolean;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "User Management",
    href: "/users",
    icon: Users,
  },
  {
    title: "Role Management",
    href: "/roles",
    icon: Shield,
  },
  {
    title: "Service Management",
    href: "/services",
    icon: Server,
  },
  {
    title: "File Management",
    href: "/files",
    icon: Folder,
  },
  {
    title: "Log Management",
    href: "/logs",
    icon: Scroll,
  },
  {
    title: "Database Schema",
    href: "/database-schema",
    icon: Database,
  },
  {
    title: "Connections",
    href: "/connections",
    icon: Settings,
  },
];

export function SidebarNav({ className, isCollapsed }: SidebarNavProps) {
  return (
    <nav className={cn("flex flex-col gap-2", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <item.icon className="h-5 w-5" />
          {!isCollapsed && <span>{item.title}</span>}
        </Link>
      ))}
    </nav>
  );
}
