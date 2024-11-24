export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "open" | "completed";
  created_at: string;
}
