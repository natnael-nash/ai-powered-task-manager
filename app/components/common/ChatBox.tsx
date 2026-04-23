// import { handleChat } from "@/lib/ai-agent";
import { Dot, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { playSuccess } from "simple-notification-sounds";
import { Task } from "../TaskList";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string | Task;
};

export default function ChatInterface({ id }: { id?: string }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // const [extracted, setExtracted] = useState<Task | null>(null);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    playSuccess();
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: trimmed },
      { id: `${prev.length + 1}`, role: "assistant", content: "" },
    ]);
    setLoading(true);
    setInput("");

    const res = await fetch(`/api/ai-agent/chat`, {
      method: "POST",
      body: JSON.stringify({ prompt: trimmed }),
    });
    if (res.ok) {
      const resData = await res.json();
      const data = resData.data as Task;

      console.log("@here update", messages);
      // setExtracted(data);
      setMessages((prev) => {
        // const prevMessages = prev;
        // prevMessages.pop();
        prev.pop();
        console.log("update", prev);
        return [
          ...prev,
          {
            id: `${prev.length - 1}`,
            role: "assistant",
            content: data,
          },
        ];
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: "Hi! I can create you a task by just chatting to me?",
        },
      ]);
    }, 200);
  }, []);

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-900">Chat</h2>
        <p className="text-sm text-slate-500">
          Send messages to manage your task.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {
              <div
                className={`max-w-[60%] rounded-xl  px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-slate-900 text-white rounded-br-none"
                    : "bg-slate-100 text-slate-900 rounded-bl-none"
                }`}
              >
                {message.role === "assistant" &&
                loading &&
                index === messages.length - 1 ? (
                  <div className="flex -mb-1! pt-1">
                    <Dot
                      className="text-blue-500 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <Dot
                      className="text-blue-500 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <Dot
                      className="text-blue-500 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                ) : !loading &&
                  index === messages.length - 1 &&
                  messages.length > 1 ? (
                  <div className="flex flex-col">
                    <h2 className="flex font-bold justify-between gap-2">
                      <span>
                        {loading ? (
                          <span>
                            Creating task
                            <Loader className="w-4 h-4 animate-spin mt-1" />
                          </span>
                        ) : (
                          <span>Created</span>
                        )}
                      </span>
                    </h2>
                    <div className="pt-2">
                      {Object.entries(message.content || {}).map(
                        ([key, value]) => (
                          <div key={key}>
                            <strong>{key}:</strong> {String(value)}
                          </div>
                        )
                      )}
                    </div>
                    {/* <Button type="ok" label="Ok"/> */}
                    {/* {message} */}
                  </div>
                ) : typeof message?.content == "string" ? (
                  message.content
                ) : (
                  <div className="pt-2">
                    {Object.entries(message.content || {}).map(
                      ([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {String(value)}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            }
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-27.5 w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 pr-24 pb-14 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <button
            type="button"
            disabled={loading}
            title={loading ? "Wating response" : ""}
            onClick={handleSend}
            className="absolute bottom-3 right-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium cursor-pointer
             text-white hover:bg-slate-800 disabled:bg-white disabled:text-slate-800 border disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
