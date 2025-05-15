
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";
import { cn } from "@/lib/utils";

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed bottom-4 right-4 z-40 rounded-full shadow-lg"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold">Navigation</h2>
              </div>
              <SidebarNav isCollapsed={false} className="px-2 py-4" />
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <div
          className={cn(
            "hidden md:flex border-r h-[calc(100vh-64px)] flex-col justify-between fixed top-16 left-0 z-30 bg-background transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "w-16" : "w-64"
          )}
        >
          <div className="flex flex-col flex-1 p-4">
            <SidebarNav isCollapsed={sidebarCollapsed} className="mt-2" />
          </div>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <Menu className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
              <span className="sr-only">
                {sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              </span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "md:ml-16" : "md:ml-64"
          )}
        >
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
