export interface CreateTask {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "completed";
}
