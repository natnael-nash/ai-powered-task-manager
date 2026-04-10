import { DB_PATH } from "@/lib/database";
import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const db = new Database(DB_PATH);
  const body = await request.json();
  const {
    title,
    category,
    priority,
    description,
    dueDate,
    reminderTime,
    note,
    status,
  } = body;

  try {
    const id = randomUUID();
    db.prepare(
      `INSERT INTO tasks (id, title, category, priority, due_date, description, reminder_time, note, status, created, updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
    ).run(
      id,
      title,
      category,
      priority,
      dueDate,
      description,
      reminderTime,
      note,
      status
    );

    db.close();
    return NextResponse.json({ success: true, message: "" }, { status: 201 });
  } catch (error) {
    console.log("@here error", error);
    return NextResponse.json(
      { success: false, message: "Error creating a task", error },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  const db = new Database(DB_PATH);

  try {
    const tasks = db.prepare(`SELECT * FROM tasks`).all();

    db.close();
    return NextResponse.json(
      { success: true, message: "", data: tasks },
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
