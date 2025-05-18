
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Settings, Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TableColumn {
  name: string;
  dataType: string;
  isPrimary: boolean;
  isNullable: boolean;
  defaultValue?: string;
  foreignKey?: {
    table: string;
    column: string;
  };
}

interface DatabaseTable {
  id: string;
  name: string;
  description: string;
  columns: TableColumn[];
}

const MOCK_TABLES: DatabaseTable[] = [
  {
    id: '1',
    name: 'users',
    description: 'User accounts and authentication',
    columns: [
      { name: 'id', dataType: 'uuid', isPrimary: true, isNullable: false, defaultValue: 'gen_random_uuid()' },
      { name: 'email', dataType: 'varchar(255)', isPrimary: false, isNullable: false },
      { name: 'password', dataType: 'varchar(255)', isPrimary: false, isNullable: false },
      { name: 'full_name', dataType: 'varchar(100)', isPrimary: false, isNullable: true },
      { name: 'created_at', dataType: 'timestamp', isPrimary: false, isNullable: false, defaultValue: 'now()' },
      { name: 'updated_at', dataType: 'timestamp', isPrimary: false, isNullable: false, defaultValue: 'now()' }
    ]
  },
  {
    id: '2',
    name: 'roles',
    description: 'User roles for access control',
    columns: [
      { name: 'id', dataType: 'uuid', isPrimary: true, isNullable: false, defaultValue: 'gen_random_uuid()' },
      { name: 'name', dataType: 'varchar(50)', isPrimary: false, isNullable: false },
      { name: 'description', dataType: 'text', isPrimary: false, isNullable: true },
      { name: 'created_at', dataType: 'timestamp', isPrimary: false, isNullable: false, defaultValue: 'now()' }
    ]
  },
  {
    id: '3',
    name: 'user_roles',
    description: 'Mapping between users and roles',
    columns: [
      { name: 'user_id', dataType: 'uuid', isPrimary: true, isNullable: false, foreignKey: { table: 'users', column: 'id' } },
      { name: 'role_id', dataType: 'uuid', isPrimary: true, isNullable: false, foreignKey: { table: 'roles', column: 'id' } },
      { name: 'granted_at', dataType: 'timestamp', isPrimary: false, isNullable: false, defaultValue: 'now()' }
    ]
  },
  {
    id: '4',
    name: 'files',
    description: 'Uploaded files metadata',
    columns: [
      { name: 'id', dataType: 'uuid', isPrimary: true, isNullable: false, defaultValue: 'gen_random_uuid()' },
      { name: 'name', dataType: 'varchar(255)', isPrimary: false, isNullable: false },
      { name: 'size', dataType: 'bigint', isPrimary: false, isNullable: false },
      { name: 'mime_type', dataType: 'varchar(100)', isPrimary: false, isNullable: false },
      { name: 'path', dataType: 'varchar(255)', isPrimary: false, isNullable: false },
      { name: 'user_id', dataType: 'uuid', isPrimary: false, isNullable: false, foreignKey: { table: 'users', column: 'id' } },
      { name: 'uploaded_at', dataType: 'timestamp', isPrimary: false, isNullable: false, defaultValue: 'now()' }
    ]
  }
];

const DatabaseSchema = () => {
  const [tables, setTables] = useState<DatabaseTable[]>(MOCK_TABLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>(MOCK_TABLES[0]?.id || '');
  
  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const activeTable = tables.find(table => table.id === activeTab);
  
  const handleRefresh = () => {
    // In a real app, this would fetch the latest schema from the database
    console.log('Refreshing schema...');
  };
  
  const handleExport = () => {
    // In a real app, this would export the schema as SQL or JSON
    console.log('Exporting schema...');
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Database Schema</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tables</CardTitle>
              <Button size="sm" variant="outline">
                <Plus className="mr-1 h-4 w-4" /> New Table
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search tables..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-1 mt-2">
              {filteredTables.map((table) => (
                <Button
                  key={table.id}
                  variant={activeTab === table.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setActiveTab(table.id)}
                >
                  {table.name}
                  <span className="ml-auto opacity-60 text-xs">{table.columns.length} cols</span>
                </Button>
              ))}
              
              {filteredTables.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No tables found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {activeTable ? (
                    <span>
                      {activeTable.name}
                    </span>
                  ) : "Select a table"}
                </CardTitle>
                {activeTable && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeTable.description}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleRefresh}>
                  <RefreshCw className="mr-1 h-4 w-4" /> Refresh
                </Button>
                <Button size="sm" variant="outline" onClick={handleExport}>
                  <Download className="mr-1 h-4 w-4" /> Export
                </Button>
                {activeTable && (
                  <Button size="sm" variant="outline">
                    <Settings className="mr-1 h-4 w-4" /> Edit
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeTable ? (
              <Tabs defaultValue="structure">
                <TabsList className="mb-4">
                  <TabsTrigger value="structure">Structure</TabsTrigger>
                  <TabsTrigger value="relations">Relations</TabsTrigger>
                  <TabsTrigger value="indexes">Indexes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="structure">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Column</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Nullable</TableHead>
                        <TableHead>Default</TableHead>
                        <TableHead>Key</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeTable.columns.map((column) => (
                        <TableRow key={column.name}>
                          <TableCell className="font-medium">{column.name}</TableCell>
                          <TableCell>{column.dataType}</TableCell>
                          <TableCell>{column.isNullable ? "Yes" : "No"}</TableCell>
                          <TableCell>{column.defaultValue || "-"}</TableCell>
                          <TableCell>
                            {column.isPrimary && (
                              <Badge className="bg-amber-500 hover:bg-amber-600 mr-1">PK</Badge>
                            )}
                            {column.foreignKey && (
                              <Badge className="bg-blue-500 hover:bg-blue-600">
                                FK: {column.foreignKey.table}.{column.foreignKey.column}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="relations">
                  <div className="p-4 text-center border rounded-md">
                    <h3 className="font-medium">Relationships</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {activeTable.columns.some(col => col.foreignKey) 
                        ? `This table has relationships with other tables`
                        : `This table does not have any defined relationships`}
                    </p>
                    
                    {activeTable.columns.some(col => col.foreignKey) && (
                      <div className="mt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Local Column</TableHead>
                              <TableHead>References</TableHead>
                              <TableHead>Type</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {activeTable.columns
                              .filter(col => col.foreignKey)
                              .map((column) => (
                                <TableRow key={column.name}>
                                  <TableCell>{column.name}</TableCell>
                                  <TableCell>
                                    {column.foreignKey?.table}.{column.foreignKey?.column}
                                  </TableCell>
                                  <TableCell>Many-to-One</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="indexes">
                  <div className="p-4 text-center border rounded-md">
                    <h3 className="font-medium">Indexes</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Indexes help improve query performance
                    </p>
                    
                    <div className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Columns</TableHead>
                            <TableHead>Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeTable.columns
                            .filter(col => col.isPrimary)
                            .map((column) => (
                              <TableRow key={`pk_${column.name}`}>
                                <TableCell>{`pk_${activeTable.name}`}</TableCell>
                                <TableCell>{column.name}</TableCell>
                                <TableCell>Primary</TableCell>
                              </TableRow>
                            ))}
                          {activeTable.columns
                            .filter(col => !col.isPrimary && col.name === 'email')
                            .map((column) => (
                              <TableRow key={`idx_${column.name}`}>
                                <TableCell>{`idx_${activeTable.name}_${column.name}`}</TableCell>
                                <TableCell>{column.name}</TableCell>
                                <TableCell>Unique</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">Select a table to view its schema</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseSchema;
