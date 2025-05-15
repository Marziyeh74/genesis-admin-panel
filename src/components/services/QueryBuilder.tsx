
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Check } from "lucide-react";

// Mock columns data
const mockColumns = [
  { name: "id", type: "INT", primaryKey: true },
  { name: "username", type: "VARCHAR", primaryKey: false },
  { name: "email", type: "VARCHAR", primaryKey: false },
  { name: "created_at", type: "TIMESTAMP", primaryKey: false },
  { name: "updated_at", type: "TIMESTAMP", primaryKey: false },
  { name: "status", type: "VARCHAR", primaryKey: false },
  { name: "role_id", type: "INT", primaryKey: false },
];

interface QueryBuilderProps {
  tableName: string;
}

const QueryBuilder: React.FC<QueryBuilderProps> = ({ tableName }) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    mockColumns.map(col => col.name)
  );
  const [whereConditions, setWhereConditions] = useState<any[]>([]);
  const [orderBy, setOrderBy] = useState<{ column: string; direction: "ASC" | "DESC" } | null>(null);
  
  const [sqlQuery, setSqlQuery] = useState(
    `SELECT * FROM ${tableName};`
  );

  // Handle column selection/deselection
  const toggleColumn = (columnName: string) => {
    if (selectedColumns.includes(columnName)) {
      setSelectedColumns(selectedColumns.filter(col => col !== columnName));
    } else {
      setSelectedColumns([...selectedColumns, columnName]);
    }
  };

  // Add a new where condition
  const addWhereCondition = () => {
    setWhereConditions([
      ...whereConditions,
      { column: mockColumns[0].name, operator: "=", value: "" }
    ]);
  };

  // Update where condition
  const updateWhereCondition = (index: number, field: string, value: string) => {
    const updatedConditions = [...whereConditions];
    updatedConditions[index] = { ...updatedConditions[index], [field]: value };
    setWhereConditions(updatedConditions);
  };

  // Remove where condition
  const removeWhereCondition = (index: number) => {
    setWhereConditions(whereConditions.filter((_, i) => i !== index));
  };

  // Set order by
  const setColumnOrdering = (columnName: string) => {
    if (orderBy?.column === columnName) {
      if (orderBy.direction === "ASC") {
        setOrderBy({ column: columnName, direction: "DESC" });
      } else {
        setOrderBy(null);
      }
    } else {
      setOrderBy({ column: columnName, direction: "ASC" });
    }
  };

  // Generate SQL query
  const generateSqlQuery = () => {
    let query = "SELECT ";
    
    if (selectedColumns.length === 0) {
      query += "* ";
    } else {
      query += selectedColumns.join(", ");
    }
    
    query += ` FROM ${tableName}`;
    
    if (whereConditions.length > 0) {
      query += " WHERE ";
      query += whereConditions
        .map(condition => `${condition.column} ${condition.operator} '${condition.value}'`)
        .join(" AND ");
    }
    
    if (orderBy) {
      query += ` ORDER BY ${orderBy.column} ${orderBy.direction}`;
    }
    
    query += ";";
    
    setSqlQuery(query);
  };

  return (
    <Tabs defaultValue="visual" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="visual">Visual Builder</TabsTrigger>
        <TabsTrigger value="sql">SQL</TabsTrigger>
      </TabsList>
      
      <TabsContent value="visual">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Select Columns</h3>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Column Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Sort</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockColumns.map((column) => (
                    <TableRow key={column.name}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedColumns.includes(column.name)}
                          onChange={() => toggleColumn(column.name)}
                          className="h-4 w-4"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{column.name}</TableCell>
                      <TableCell>{column.type}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setColumnOrdering(column.name)}
                          className={orderBy?.column === column.name ? "text-primary" : "text-muted-foreground"}
                        >
                          {orderBy?.column === column.name
                            ? orderBy.direction === "ASC"
                              ? "↑"
                              : "↓"
                            : "⋮"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Where Conditions</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addWhereCondition}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Condition
              </Button>
            </div>
            
            {whereConditions.length === 0 ? (
              <div className="text-sm text-muted-foreground p-4 border rounded-md text-center">
                No conditions defined. Query will return all rows.
              </div>
            ) : (
              <div className="space-y-2">
                {whereConditions.map((condition, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <select
                      value={condition.column}
                      onChange={(e) => updateWhereCondition(index, "column", e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {mockColumns.map((col) => (
                        <option key={col.name} value={col.name}>
                          {col.name}
                        </option>
                      ))}
                    </select>
                    
                    <select
                      value={condition.operator}
                      onChange={(e) => updateWhereCondition(index, "operator", e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="=">=</option>
                      <option value="!=">!=</option>
                      <option value=">">&gt;</option>
                      <option value=">=">&gt;=</option>
                      <option value="<">&lt;</option>
                      <option value="<=">&lt;=</option>
                      <option value="LIKE">LIKE</option>
                      <option value="IN">IN</option>
                    </select>
                    
                    <Input
                      value={condition.value}
                      onChange={(e) => updateWhereCondition(index, "value", e.target.value)}
                      placeholder="Value"
                      className="text-sm"
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWhereCondition(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            className="w-full" 
            onClick={generateSqlQuery}
          >
            Generate SQL
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="sql">
        <div className="space-y-4">
          <div className="border rounded-md p-4 bg-muted">
            <pre className="text-sm font-mono whitespace-pre-wrap">{sqlQuery}</pre>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={generateSqlQuery}>
              Refresh SQL
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default QueryBuilder;
