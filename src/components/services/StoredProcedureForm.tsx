
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface StoredProcedureParameter {
  name: string;
  type: string;
  value?: string;
}

interface StoredProcedureFormProps {
  procedure: {
    name: string;
    parameters: StoredProcedureParameter[];
  } | undefined;
}

// Mock output parameters/columns
const mockOutputColumns = [
  { name: "user_id", type: "INT" },
  { name: "username", type: "VARCHAR" },
  { name: "email", type: "VARCHAR" },
  { name: "role_name", type: "VARCHAR" },
];

const StoredProcedureForm: React.FC<StoredProcedureFormProps> = ({ procedure }) => {
  const [parameters, setParameters] = React.useState<StoredProcedureParameter[]>(
    procedure?.parameters.map(param => ({ ...param, value: "" })) || []
  );
  
  const [result, setResult] = React.useState<any[] | null>(null);
  
  const updateParameterValue = (index: number, value: string) => {
    const updatedParameters = [...parameters];
    updatedParameters[index] = { ...updatedParameters[index], value };
    setParameters(updatedParameters);
  };
  
  const testProcedure = () => {
    // In a real app, this would call an API to test the procedure
    console.log("Testing procedure with parameters:", parameters);
    
    // Mock result data
    setResult([
      { user_id: 1, username: "admin", email: "admin@example.com", role_name: "Administrator" },
      { user_id: 2, username: "user1", email: "user1@example.com", role_name: "User" },
    ]);
  };
  
  if (!procedure) {
    return <div>No procedure selected</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Input Parameters</h3>
        
        {parameters.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            This stored procedure does not have any input parameters.
          </div>
        ) : (
          <div className="space-y-4">
            {parameters.map((param, index) => (
              <div key={param.name} className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`param-${index}`}>{param.name}</Label>
                  <div className="text-sm text-muted-foreground">{param.type}</div>
                </div>
                <Input
                  id={`param-${index}`}
                  value={param.value}
                  onChange={(e) => updateParameterValue(index, e.target.value)}
                  placeholder={`Enter ${param.name}`}
                />
              </div>
            ))}
          </div>
        )}
        
        <Button onClick={testProcedure} className="w-full">
          Test Procedure
        </Button>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Output Definition</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Column Name</TableHead>
              <TableHead>Data Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOutputColumns.map((column) => (
              <TableRow key={column.name}>
                <TableCell className="font-medium">{column.name}</TableCell>
                <TableCell>{column.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {result && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Test Result</h3>
          <div className="border rounded-md overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {mockOutputColumns.map((column) => (
                    <TableHead key={column.name}>{column.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.map((row, i) => (
                  <TableRow key={i}>
                    {mockOutputColumns.map((column) => (
                      <TableCell key={column.name}>{row[column.name]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoredProcedureForm;
