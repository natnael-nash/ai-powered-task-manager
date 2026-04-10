import { initializeDb } from "@/lib/database";
import { runMigrations } from "@/lib/migrations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const intializeDatabse = initializeDb();
    const migrateDb = runMigrations();
    return NextResponse.json(
      {
        success: true,
        message: "Databse sucessfully intialized and migrated!",
      },
      { status: 201 }
    );
  } catch (err) {
    console.log("@here initialization error", err);
    return NextResponse.json(
      { success: false, message: "", error: err },
      { status: 501 }
    );
  }
}
