
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SqlEditor: React.FC<SqlEditorProps> = ({ value, onChange, placeholder = "SELECT * FROM table" }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="sql-editor">SQL Query</Label>
      <Textarea
        id="sql-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="font-mono h-32 text-sm"
        spellCheck={false}
      />
    </div>
  );
};

export default SqlEditor;
