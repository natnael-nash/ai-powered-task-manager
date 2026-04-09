import { initializeDb } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const intializeDatabse = initializeDb();
    return NextResponse.json(
      { success: true, message: "Databse sucessfully intialized!" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "", error: err },
      { status: 501 }
    );
  }
}
