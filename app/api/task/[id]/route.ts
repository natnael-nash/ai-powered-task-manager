import { DB_PATH } from "@/lib/database";
import Database from "better-sqlite3";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    const { id } = await params;
    const db = new Database(DB_PATH);
    const body = await request.json();
    const {
      title,
      category,
      priority,
      description,
      dueDate,
      due_date,
      reminderTime,
      reminder_time,
      note,
      status,
    } = body;
    db.prepare(
      `UPDATE tasks SET title=?, category=?, priority=?, due_date=?, description=?, reminder_time=?, 
      note=?, status=?, updated=datetime('now') WHERE id = ? `
    ).run(
      title,
      category,
      priority,
      dueDate || due_date,
      description,
      reminderTime || reminder_time,
      note,
      status,
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
