import { DB_PATH } from "@/lib/database";
import Database from "better-sqlite3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = new Database(DB_PATH);
    const body = await request.json();
    const {
      title,
      category,
      priority,
      dueDate,
      description,
      reminderTime,
      note,
    } = body;
    db.prepare(
      `UPDATE tasks SET title=?, category=?, priority=?, due_date=?, description=?, reminder_time=?, 
      note=?, updated=datetime('now') WHERE id = ? `
    ).run(
      title,
      category,
      priority,
      dueDate,
      description,
      reminderTime,
      note,
      id
    );

    db.close();
    return NextResponse.json({ success: true, message: "" }, { status: 201 });
  } catch (error) {
    console.log("@here error", error);
    return NextResponse.json(
      { success: false, message: "Error upodating a task", error },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = new Database(DB_PATH);
    const { id } = await params;

    console.log("\n@here\n", id);
    const task = db.prepare(`SELECT * FROM tasks where id = ?`).get(id);

    db.close();
    return NextResponse.json(
      { success: true, message: "", data: task },
      { status: 201 }
    );
  } catch (error) {
    console.log("@here error", error);
    return NextResponse.json(
      { success: false, message: "Error getting a task", error },
      { status: 500 }
    );
  }
}
