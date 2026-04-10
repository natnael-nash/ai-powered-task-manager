import { DB_PATH } from "@/lib/database";
import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function registerUser(user: User) {
  const { name, email } = user;

  try {
    const db = new Database(DB_PATH);

    const userExists = db
      .prepare(`SELECT * FROM users WHERE email = ?`)
      .get(email);
    if (userExists) {
      return NextResponse.json(
        { success: true, message: "User already exists" },
        { status: 200 }
      );
    }

    const id = randomUUID();
    db.prepare(
      `INSERT INTO users (id, name, email, created, updated)
      VALUES (?, ?, ?,  datetime('now'), datetime('now'))`
    ).run(id, name, email);

    db.close();
    return NextResponse.json({ success: true, message: "" }, { status: 201 });
  } catch (error) {
    console.log("@here error", error);
    return NextResponse.json(
      { success: false, message: "Error registering user", error },
      { status: 500 }
    );
  }
}
