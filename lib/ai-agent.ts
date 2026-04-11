import { Task } from "@/app/components/TaskList";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

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
    },
    required: ["success", "data"],
    additionalProperties: false,
  } as const;
}
export async function handleChat(message: string) {
  const extractedData = (await extractAttributesFromContent(
    message,
    ["title", "category", "priority", "dueDate", "reminderTime", "status"],
    process.env.NEXT_PUBLIC_GEMINI_MODEL
  )) as any;
  const { title, ...taskData } = extractedData?.data;
  const create = await createTask({ ...taskData, title: title ?? message });
  return { data: { ...extractedData, title: title ?? message }, success: true };
}

export async function extractAttributesFromContent(
  content: string,
  attributes: string[],
  model = "gemini-3-flash-preview"
): Promise<ExtractResult> {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: content,
      config: {
        systemInstruction:
          "You extract structured data from user messages. " +
          "Return only the requested fields. " +
          "If a field is missing, return null for that field.",
        responseMimeType: "application/json",
        responseJsonSchema: buildSchema(attributes),
      },
    });

    const parsed = JSON.parse(response.text ?? "{}") as {
      success?: boolean;
      data?: Record<string, string | null>;
    };

    return {
      success: true,
      data: parsed.data ?? null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createTask(data: Task) {
  const taskCreat = fetch("/api/task", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return taskCreat;
}
