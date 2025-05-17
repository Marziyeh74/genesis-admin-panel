
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { DirectionProvider } from "@/hooks/use-direction";
import { LanguageProvider } from "@/hooks/use-language";
import { MainLayout } from "@/components/layout/main-layout";

// Page imports
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import NotFound from "./pages/error/NotFound";
import ServerError from "./pages/error/ServerError";
import UserManagement from "./pages/users/UserManagement";
import RoleManagement from "./pages/roles/RoleManagement";
import ServiceManagement from "./pages/services/ServiceManagement";
import ServiceConfiguration from "./pages/services/ServiceConfiguration";
import ServiceTest from "./pages/services/ServiceTest";
import ConnectionManagement from "./pages/connections/ConnectionManagement";
import FileManagement from "./pages/files/FileManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <DirectionProvider defaultDirection="ltr">
        <LanguageProvider defaultLanguage="en">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Error Routes */}
                <Route path="/error/502" element={<ServerError />} />
                
                {/* Protected Routes */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Dashboard />} />
                  
                  {/* Implemented Routes */}
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="/roles" element={<RoleManagement />} />
                  <Route path="/services" element={<ServiceManagement />} />
                  <Route path="/services/:id/configure" element={<ServiceConfiguration />} />
                  <Route path="/services/:id/test" element={<ServiceTest />} />
                  <Route path="/connections" element={<ConnectionManagement />} />
                  <Route path="/files" element={<FileManagement />} />
                  
                  {/* These routes will be implemented later */}
                  <Route path="/logs" element={<div>Log Management (To be implemented)</div>} />
                  <Route path="/database-schema" element={<div>Database Schema Management (To be implemented)</div>} />
                </Route>
                
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </DirectionProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
