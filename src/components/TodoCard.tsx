"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit2 } from "lucide-react";

interface TodoCardProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TodoCard({
  id,
  title,
  description,
  completed,
  onToggle,
  onDelete,
}: TodoCardProps) {
  return (
    <Card className="shadow-md" key={id}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Checkbox checked={completed} onCheckedChange={onToggle} />
          <CardTitle
            className={`text-lg ${completed ? "line-through text-gray-400" : ""}`}
          >
            {title}
          </CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </CardHeader>
      {description && (
        <CardContent>
          <p className="text-sm text-gray-600">{description}</p>
        </CardContent>
      )}
    </Card>
  );
}
