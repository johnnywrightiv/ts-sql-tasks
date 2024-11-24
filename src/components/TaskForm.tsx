"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types/Task";

interface TaskFormProps {
  onTaskAdded: () => void;
  onTaskUpdated: () => void;
  taskToEdit: Task | null;
}

export default function TaskForm({ onTaskAdded, onTaskUpdated, taskToEdit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("open");
  const { toast } = useToast();

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
    } else {
      // Reset form when taskToEdit is null
      resetForm();
    }
  }, [taskToEdit]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("open");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const taskData = { title, description, priority, status };

    try {
      const url = "/api/tasks";
      const method = taskToEdit ? "PUT" : "POST";
      const body = taskToEdit
        ? JSON.stringify({ ...taskData, id: taskToEdit.id })
        : JSON.stringify(taskData);

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      const data = await response.json();
      if (data.success) {
        toast({
          variant: "success",
          title: taskToEdit ? "Task updated" : "Task created",
          description: taskToEdit
            ? "Your task has been successfully updated."
            : "Your task has been successfully created.",
        });
        resetForm();
        if (taskToEdit) {
          onTaskUpdated();
        } else {
          onTaskAdded();
        }
      } else {
        throw new Error(data.error || `Failed to ${taskToEdit ? "update" : "create"} task`);
      }
    } catch (error) {
      console.error(`Error ${taskToEdit ? "updating" : "creating"} task:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${taskToEdit ? "update" : "create"} task. Please try again.`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{taskToEdit ? "Edit Task" : "Create a Task"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium">
              Priority
            </label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">{taskToEdit ? "Update Task" : "Add Task"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
