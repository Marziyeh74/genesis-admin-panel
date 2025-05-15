
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ApiConfigProps {
  initialConfig: {
    format: string;
    authentication: string;
    rateLimit: string;
    caching: string;
    endpoint?: string; // Adding optional endpoint property
  };
  onConfigChange: (config: any) => void;
}

const ApiConfigForm: React.FC<ApiConfigProps> = ({ initialConfig, onConfigChange }) => {
  const [config, setConfig] = React.useState(initialConfig);
  const [enableRoles, setEnableRoles] = React.useState(false);
  
  const handleChange = (field: string, value: string) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="format">API Format</Label>
          <Select 
            value={config.format} 
            onValueChange={(value) => handleChange("format", value)}
          >
            <SelectTrigger id="format">
              <SelectValue placeholder="Select API format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="REST">REST</SelectItem>
              <SelectItem value="GraphQL">GraphQL</SelectItem>
              <SelectItem value="gRPC">gRPC</SelectItem>
              <SelectItem value="WebSocket">WebSocket</SelectItem>
              <SelectItem value="MQTT">MQTT</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Select how this service will be exposed externally
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="auth">Authentication</Label>
          <Select 
            value={config.authentication} 
            onValueChange={(value) => handleChange("authentication", value)}
          >
            <SelectTrigger id="auth">
              <SelectValue placeholder="Select authentication" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              <SelectItem value="API Key">API Key</SelectItem>
              <SelectItem value="JWT">JWT</SelectItem>
              <SelectItem value="OAuth2">OAuth2</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Choose authentication method for this API
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rate-limit">Rate Limit (req/min)</Label>
          <Input
            id="rate-limit"
            type="number"
            value={config.rateLimit}
            onChange={(e) => handleChange("rateLimit", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Maximum requests per minute (0 for unlimited)
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="caching">Cache TTL (seconds)</Label>
          <Input
            id="caching"
            type="number"
            value={config.caching}
            onChange={(e) => handleChange("caching", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Time to live for cached responses (0 for no caching)
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="enable-roles" 
          checked={enableRoles}
          onCheckedChange={(checked) => setEnableRoles(!!checked)}
        />
        <Label htmlFor="enable-roles" className="font-medium">
          Enable Role-Based Field Access
        </Label>
      </div>
      
      {enableRoles && (
        <div className="border rounded-md p-4">
          <div className="text-sm mb-4">
            Configure which user roles can access specific fields in the API response.
          </div>
          
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="admin-role">
              <AccordionTrigger>Admin Role</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="admin-all" checked />
                    <Label htmlFor="admin-all">All fields</Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="user-role">
              <AccordionTrigger>User Role</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {["id", "username", "email", "created_at"].map((field) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox id={`user-${field}`} checked />
                      <Label htmlFor={`user-${field}`}>{field}</Label>
                    </div>
                  ))}
                  {["status", "role_id"].map((field) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox id={`user-${field}`} />
                      <Label htmlFor={`user-${field}`}>{field}</Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="guest-role">
              <AccordionTrigger>Guest Role</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {["id", "username"].map((field) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox id={`guest-${field}`} checked />
                      <Label htmlFor={`guest-${field}`}>{field}</Label>
                    </div>
                  ))}
                  {["email", "created_at", "status", "role_id"].map((field) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox id={`guest-${field}`} />
                      <Label htmlFor={`guest-${field}`}>{field}</Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
      
      <div className="pt-4">
        <div className="text-sm font-medium mb-2">API Endpoint Preview</div>
        <div className="bg-muted p-2 rounded-md font-mono text-sm">
          {config.format === "REST" && `/api/v1/${initialConfig.endpoint || "service"}`}
          {config.format === "GraphQL" && `/graphql`}
          {config.format === "gRPC" && `service.${initialConfig.endpoint || "service"}`}
          {config.format === "WebSocket" && `ws://api.example.com/${initialConfig.endpoint || "service"}`}
          {config.format === "MQTT" && `topic/${initialConfig.endpoint || "service"}`}
        </div>
      </div>
    </div>
  );
};

export default ApiConfigForm;
