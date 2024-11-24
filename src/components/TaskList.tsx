import { Task } from "@/types/Task";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
  status: "open" | "completed";
}

export default function TaskList({ tasks, onUpdateTask, onDeleteTask, status }: TaskListProps) {
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const handleDeleteConfirm = () => {
    if (taskToDelete !== null) {
      onDeleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{status === "open" ? "Active" : "Completed"} Tasks</h2>
      {tasks.length === 0 ? (
        <p>No {status === "open" ? "active" : "completed"} tasks found.</p>
      ) : (
        tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <CardTitle>{task.title}</CardTitle>
              <CardDescription>{task.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge
                  variant={
                    task.priority === "high"
                      ? "destructive"
                      : task.priority === "medium"
                      ? "default"
                      : "secondary"
                  }
                >
                  {task.priority}
                </Badge>
                <Badge variant={task.status === "completed" ? "success" : "outline"}>
                  {task.status}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Created: {new Date(task.created_at).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => onUpdateTask(task)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setTaskToDelete(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete the task.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTaskToDelete(null)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteConfirm}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
