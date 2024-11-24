import { NextResponse } from "next/server";
import { initDb } from "@/database/db-connection";
import { Task } from "@/types/Task";
import { CreateTask } from "@/types/CreateTask";


export async function GET() {
  try {
    const db = await initDb();
    const tasks: Task[] = await db.all<Task[]>("SELECT * FROM tasks");
    return NextResponse.json({ success: true, data: tasks });

  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = await initDb();
    const body: CreateTask = await req.json();

    const { title, description, priority, status } = body;

    // Validation checks
    if (!title || title.trim() === "") {
      return NextResponse.json({ success: false, error: "Title cannot be empty" }, { status: 400 });
    }

    // Proceed to insert the task if validation passes
    await db.run("INSERT INTO tasks (title, description, priority, status) VALUES (?, ?, ?, ?)", [
      title,
      description,
      priority,
      status,
    ]);

    return NextResponse.json({ success: true, message: "Task added successfully" });
  } catch (error) {
    console.error("Error adding task:", error);
    return NextResponse.json({ success: false, error: "Failed to add task" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const db = await initDb();
    const body = await req.json();
    const { id, title, description, priority, status } = body;

    // Validation checks
    if (!id) {
      return NextResponse.json({ success: false, error: "Task ID is required" }, { status: 400 });
    }

    if (!title || title.trim() === "") {
      return NextResponse.json({ success: false, error: "Title cannot be empty" }, { status: 400 });
    }

    // Update the task
    await db.run(
      "UPDATE tasks SET title = ?, description = ?, priority = ?, status = ? WHERE id = ?",
      [title, description, priority, status, id]
    );

    return NextResponse.json({ success: true, message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ success: false, error: "Failed to update task" }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    const db = await initDb();
    const body = await req.json();
    const { id } = body;

    // Validation for missing id
    if (!id) {
      return NextResponse.json({ success: false, error: "Task ID is required" }, { status: 400 });
    }

    // Delete the task
    await db.run("DELETE FROM tasks WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ success: false, error: "Failed to delete task" }, { status: 500 });
  }
}
