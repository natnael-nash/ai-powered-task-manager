import { Task } from "@/app/components/TaskList";
import { authOptions } from "@/lib/auth";
import { DB_PATH } from "@/lib/database";
import { GoogleGenAI } from "@google/genai";
import Database from "better-sqlite3";
import { randomUUID } from "crypto";

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ai_client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const chatIds: string[] = [];

type ExtractResult = {
  success: boolean;
  data: Record<string, string | null> | null;
  error?: string;
};

function buildSchema(attributes: string[]) {
  const properties = Object.fromEntries(
    attributes.map((attr) => [
      attr,
      {
        type: ["string", "null"],
        description: `Extract the ${attr} from the user's message. Use null if it is missing.`,
      },
    ])
  );

  return {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        description: "True when the extraction succeeded.",
      },
      data: {
        type: "object",
        properties,
        required: attributes,
        additionalProperties: false,
      },
      intent: {
        type: "string",
        enum: ["edit_previous", "new"],
        description: "new by default",
      },
    },
    required: ["success", "data", "intent"],
    additionalProperties: false,
  } as const;
}

export async function extractAttributesFromContent(
  content: string,
  attributes: string[],
  model = "gemini-3-flash-preview"
): Promise<ExtractResult> {
  try {
    // const response = await ai_client.models.generateContent({
    //   model,
    //   contents: content,
    //   config: {
    //     systemInstruction:
    //       "You extract structured data from user messages. " +
    //       "Return only the requested fields. " +
    //       "If a field is missing, return null for that field.",
    //     responseMimeType: "application/json",
    //     responseJsonSchema: buildSchema(attributes),
    //   },
    // });

    // const text= response.text;

    const response = await ai_client.interactions.create({
      model,
      input: [
        {
          role: "user",
          content,
        },
      ],
      previous_interaction_id: chatIds.pop(),
      system_instruction:
        "You extract structured data from user messages. " +
        "Return only the requested fields. " +
        "If a field is missing, return null for that field.",
      response_mime_type: "application/json",
      response_format: buildSchema(attributes),
    });

    console.log("\n\n@here response🤖", response, chatIds, "\n");
    const outputs = response.outputs;
    const lastOutput = outputs?.pop();
    const text = lastOutput?.type == "text" ? lastOutput.text : "";
    chatIds.push(response.id);

    // ??response
    //   ? response.outputs[response.outputs.length - 1].text
    //   : "";

    const parsed = JSON.parse(text ?? "{}") as {
      success?: boolean;
      data?: Record<string, string | null>;
      intent?: "new" | "edit_previous";
    };
    console.log("@here parsed", parsed);
    return {
      success: true,
      data: parsed.data ?? null,
    };
  } catch (error) {
    console.log("\n\n@here ai error\n", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

//create task tool
export async function createTaskTool(data: Task, user: { email: string }) {
  try {
    const db = new Database(DB_PATH);
    const body = data ?? {};
    const {
      title,
      category,
      priority,
      due_date: dueDate,
      reminder_time: reminderTime,
      description,
      note,
      status,
    } = body;
    const id = randomUUID();

    const currentUser = db
      .prepare(`SELECT id FROM users where email = ?`)
      .get(user.email) as { id: string };

    const task = await db
      .prepare(
        `INSERT INTO tasks (id, user_id, title, category, priority, due_date, description, reminder_time, note, status, created, updated)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now')) RETURNING *`
      )
      .get(
        id,
        currentUser.id,
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
    return task;
  } catch (error) {
    console.log("@here error", error);
    return null;
  }
}

//update task tool
export async function updateTaskTool(
  taskId: string,
  data: Task,
  user: { email: string }
) {
  console.log("\n\n ⬆️Updating⬆️\n", taskId);
  try {
    const db = new Database(DB_PATH);
    const body = data ?? {};
    const {
      title,
      category,
      priority,
      due_date: dueDate,
      reminder_time: reminderTime,
      description,
      note,
      status,
    } = body;

    const task = await db
      .prepare(
        `UPDATE tasks SET title=?, category=?, priority=?, due_date=?, description=?, reminder_time=?, 
        note=?, status=?, updated=datetime('now') WHERE id = ? RETURNING *`
      )
      .get(
        title,
        category,
        priority,
        dueDate,
        description,
        reminderTime,
        note,
        status,
        taskId
      );

    db.close();
    return task;
  } catch (error) {
    console.log("@here error", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

  const { prompt: message, taskId } = await request.json();
  const extractedData = (await extractAttributesFromContent(
    message,
    [
      "title",
      "category",
      "priority",
      "dueDate",
      "reminderTime",
      "status",
      "description",
    ],
    process.env.GEMINI_MODEL
  )) as any;
  const { title, ...taskData } = extractedData?.data;
  const task =
    extractedData.intent == "edit" && taskId
      ? await updateTaskTool(
          taskId,
          {
            ...taskData,
            title: title ?? message,
          },
          { email: session?.user?.email ?? "" }
        )
      : await createTaskTool(
          {
            ...taskData,
            title: title ?? message,
          },
          { email: session?.user?.email ?? "" }
        );
  return NextResponse.json(
    {
      data: {
        data: { ...extractedData.data, ...(task ?? {}) },
        title: title ?? message,
      },
      success: true,
    },
    { status: 201 }
  );
}
