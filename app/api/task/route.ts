import { DB_PATH } from "@/lib/database";
import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

  try {
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
    const id = randomUUID();

    const user = db
      .prepare(`SELECT id FROM users where email = ?`)
      .get(session?.user?.email) as { id: string };

    db.prepare(
      `INSERT INTO tasks (id, user_id, title, category, priority, due_date, description, reminder_time, note, status, created, updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
    ).run(
      id,
      user.id,
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
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

  try {
    const db = new Database(DB_PATH);
    const user = db
      .prepare(`SELECT id FROM users where email = ?`)
      .get(session?.user?.email) as { id: string };
    console.log("session?.user?.email", user.id);
    const tasks = db
      .prepare(`SELECT * FROM tasks where user_id = ?`)
      .all(user.id);

    db.close();
    return NextResponse.json(
      { success: true, message: "", data: tasks },
      { status: 200 }
    );
  } catch (error) {
    console.log("@here error", error);
    return NextResponse.json(
      { success: false, message: "Error getting a task", error },
      { status: 500 }
    );
  }
}
