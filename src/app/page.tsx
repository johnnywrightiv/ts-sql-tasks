"use client";

import { useEffect, useState } from "react";
import { Task } from "@/types/Task";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState("active");

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateTask = (task: Task) => {
    setTaskToEdit(task);
    setActiveTab("create");
  };

  const handleDeleteTask = async (id: number) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleTaskAdded = () => {
    fetchTasks();
    setActiveTab("active");
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    setTaskToEdit(null);
    setActiveTab("active");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value !== "create") {
      setTaskToEdit(null);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Task Manager</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Tasks</TabsTrigger>
            <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
            <TabsTrigger value="create">Create Task</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <TaskList
              tasks={tasks.filter((task) => task.status === "open")}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              status="open"
            />
          </TabsContent>
          <TabsContent value="completed">
            <TaskList
              tasks={tasks.filter((task) => task.status === "completed")}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              status="completed"
            />
          </TabsContent>
          <TabsContent value="create">
            <TaskForm
              onTaskAdded={handleTaskAdded}
              onTaskUpdated={handleTaskUpdated}
              taskToEdit={taskToEdit}
            />
          </TabsContent>
        </Tabs>
      )}
      <Toaster />
    </main>
  );
}
