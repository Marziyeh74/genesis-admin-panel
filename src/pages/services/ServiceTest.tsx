
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Play, Download, Copy, Check } from "lucide-react";

// Mock service data
const mockService = {
  id: 1,
  name: "User Data Service",
  type: "Database Query",
  status: "Active",
  source: "Main Database",
  endpoint: "/api/v1/users",
};

const mockResponseFormats = ["JSON", "XML", "CSV", "YAML"];

const ServiceTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [service] = useState(mockService);
  const [parameters, setParameters] = useState([
    { name: "limit", value: "10" },
    { name: "offset", value: "0" },
  ]);
  const [headers, setHeaders] = useState([
    { name: "Content-Type", value: "application/json" },
    { name: "Authorization", value: "Bearer token123" },
  ]);
  const [responseFormat, setResponseFormat] = useState("JSON");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const updateParameter = (index: number, field: string, value: string) => {
    const updatedParams = [...parameters];
    updatedParams[index] = { ...updatedParams[index], [field]: value };
    setParameters(updatedParams);
  };

  const updateHeader = (index: number, field: string, value: string) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index] = { ...updatedHeaders[index], [field]: value };
    setHeaders(updatedHeaders);
  };

  const addParameter = () => {
    setParameters([...parameters, { name: "", value: "" }]);
  };

  const addHeader = () => {
    setHeaders([...headers, { name: "", value: "" }]);
  };

  const removeParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const executeTest = () => {
    setIsLoading(true);
    setResponse(null);
    
    // Simulate API call
    setTimeout(() => {
      const mockResponse = {
        data: [
          { id: 1, username: "admin", email: "admin@example.com", role: "Administrator" },
          { id: 2, username: "user1", email: "user1@example.com", role: "User" },
          { id: 3, username: "user2", email: "user2@example.com", role: "User" },
        ],
        meta: {
          total: 25,
          limit: parseInt(parameters.find(p => p.name === "limit")?.value || "10"),
          offset: parseInt(parameters.find(p => p.name === "offset")?.value || "0"),
        },
        executionTime: "120ms",
      };
      
      setResponse(mockResponse);
      setIsLoading(false);
      
      toast({
        title: "Test executed",
        description: "The service test was executed successfully.",
      });
    }, 1500);
  };

  const copyToClipboard = () => {
    if (!response) return;
    
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The response has been copied to your clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResponse = () => {
    if (!response) return;
    
    const blob = new Blob([JSON.stringify(response, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${service.name.toLowerCase().replace(/\s+/g, "-")}-response.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Response downloaded",
      description: "The response has been downloaded as a JSON file.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/services/${id}/configure`)}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Configuration
          </Button>
          <h1 className="text-3xl font-bold">{service.name} - Test</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request Configuration</CardTitle>
            <CardDescription>
              Configure parameters and headers for your test request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="parameters" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="parameters" className="space-y-4 pt-4">
                {parameters.map((param, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 items-center">
                    <Input
                      className="col-span-2"
                      placeholder="Parameter name"
                      value={param.name}
                      onChange={(e) => updateParameter(index, "name", e.target.value)}
                    />
                    <Input
                      className="col-span-2"
                      placeholder="Value"
                      value={param.value}
                      onChange={(e) => updateParameter(index, "value", e.target.value)}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeParameter(index)}
                      className="ml-auto"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={addParameter}
                  className="w-full"
                >
                  Add Parameter
                </Button>
              </TabsContent>
              
              <TabsContent value="headers" className="space-y-4 pt-4">
                {headers.map((header, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 items-center">
                    <Input
                      className="col-span-2"
                      placeholder="Header name"
                      value={header.name}
                      onChange={(e) => updateHeader(index, "name", e.target.value)}
                    />
                    <Input
                      className="col-span-2"
                      placeholder="Value"
                      value={header.value}
                      onChange={(e) => updateHeader(index, "value", e.target.value)}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeHeader(index)}
                      className="ml-auto"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={addHeader}
                  className="w-full"
                >
                  Add Header
                </Button>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="response-format">Response Format</Label>
                <Select 
                  value={responseFormat} 
                  onValueChange={setResponseFormat}
                >
                  <SelectTrigger id="response-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockResponseFormats.map((format) => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-2">
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Service Endpoint:
                </Label>
                <div className="bg-muted p-2 rounded-md font-mono text-sm">
                  {service.endpoint}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button 
              onClick={executeTest} 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Executing...
                </span>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Execute Test
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>
              The response from your service test will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : response ? (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md max-h-[400px] overflow-auto">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Execution time: {response.executionTime}</span>
                  <span>Status: 200 OK</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground p-12">
                <p>No response data yet. Execute a test to see results.</p>
              </div>
            )}
          </CardContent>
          {response && (
            <CardFooter className="flex justify-end space-x-2 border-t pt-4">
              <Button variant="outline" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy
              </Button>
              <Button variant="outline" onClick={downloadResponse}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ServiceTest;
