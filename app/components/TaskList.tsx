"use client";

import { CheckCircle, EditIcon, LoaderCircleIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./common/Button";
import Link from "next/link";
import { toast } from "react-toastify";

export type Task = {
  id: number;
  title: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  due_date: string;
  reminder_time: string;
  status: "New" | "In Progress" | "Completed";
  description: string;
  note: string;
};

function getPriorityClass(priority: Task["priority"] | Task["status"]) {
  switch (priority?.toLowerCase()) {
    case "high":
    case "in progress":
      return "bg-red-100 ";
    case "medium":
    case "new":
      return "bg-yellow-100 ";
    case "low":
    case "completed":
      return "bg-green-100 ";
  }
}

export default function TaskList() {
  const [tasks, setTasks] = useState<{
    loading: boolean;
    data: Task[];
    selected: Task | null;
    editing: string;
  }>({
    loading: true,
    data: [],
    selected: null,
    editing: "",
  });
  const [markDone, setMarkDone] = useState<number | null>(null);

  const { selected } = tasks;

  const getTasks = async () => {
    const res = await fetch("/api/task", {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      const taskData = data.data;
      setTasks((prev) => ({ ...prev, data: taskData, loading: false }));
      if (selected) {
        const updateSelected = taskData.filter(
          (task: Task) => task.id == selected.id
        );
        setTasks((prev) => ({ ...prev, selected: updateSelected[0] }));
      }
    }
  };

  const handleMarkDone = async (task: Task) => {
    const { id, status, ...values } = task;
    setMarkDone(id);
    const url = `/api/task/${id}`;
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ status: "Completed", ...values }),
    });
    if (res.ok && res.status) {
      toast("Task marked done successfully!");
      getTasks();
      return;
    }
    toast.error("Something went wrong!");
  };

  const editingField = (attribute: "title") => {
    setTasks((prev) => ({ ...prev, editing: attribute }));
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="w-full h-full flex justify-center ">
      {tasks.loading ? (
        <div className="flex items-center gap-2">
          <LoaderCircleIcon className="w-4 h-4 animate-spin" /> Loading
        </div>
      ) : (
        <section className="w-full">
          {tasks.data.length ? (
            <div className="w-full rounded-2xl bg-white p-6 flex flex-row justify-start">
              <div className="flex flex-1">
                <div className="space-y-3 w-full delay-75">
                  {tasks.data.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start justify-between rounded-xl border border-zinc-200 p-4 
                      hover:bg-zinc-50 cursor-pointer"
                      onClick={() =>
                        setTasks((prev) => ({ ...prev, selected: task }))
                      }
                    >
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-zinc-900">
                          {task.title}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500">
                          {task.category} • Due {task.due_date}
                        </p>
                      </div>

                      <div className="flex">
                        {task.priority && (
                          <div className="ml-4 flex shrink-0 flex-row items-end gap-2  h-full">
                            <span
                              className={`rounded-lg px-3 py-2 text-xs font-medium capitalize ${getPriorityClass(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        )}

                        {task.status && (
                          <div className="ml-4 flex shrink-0 flex-row items-end gap-2  h-full">
                            <span
                              className={`flex items-center gap-2 rounded-lg px-3  text-xs font-medium capitalize ${getPriorityClass(
                                task.status
                              )}`}
                            >
                              <p className="py-2">{task.status} </p>
                              <span>
                                {task?.status.toLowerCase() == "completed" ? (
                                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                                ) : (
                                  <label
                                    className="flex items-center gap-3 cursor-pointer select-none"
                                    title="Mark as done"
                                  >
                                    <input
                                      type="checkbox"
                                      className="sr-only"
                                      checked={task.status == "Completed"}
                                      onChange={() => {
                                        handleMarkDone(task);
                                      }}
                                    />

                                    <span
                                      className={`flex h-6 w-6 items-center justify-center rounded-md border transition-all duration-200 ${
                                        task.status == "Completed"
                                          ? "border-zinc-900 bg-zinc-900 shadow-sm"
                                          : "border-zinc-300 bg-white shadow-sm"
                                      }`}
                                    >
                                      {task.id == markDone && (
                                        <LoaderCircleIcon className="w-4 h-4 animate-spin" />
                                      )}
                                    </span>
                                  </label>
                                )}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selected && (
                <div className="w-1/3 pl-5">
                  <div className="sticky top-6 h-[calc(80vh)] rounded-2xl border border-zinc-200 bg-white overflow-hidden">
                    <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                          Task details
                        </p>
                        <div className="flex gap-2">
                          <h2 className="mt-1 text-lg font-semibold text-zinc-900">
                            {selected?.title}
                          </h2>
                        </div>
                      </div>

                      <Button
                        type="button"
                        className="p-2! border-none"
                        handleClick={() =>
                          setTasks((prev) => ({ ...prev, selected: null }))
                        }
                        suffixIcon={<X className="w-5 h-5" />}
                      />
                    </div>

                    <div className="space-y-4 p-5">
                      <div className="rounded-xl bg-zinc-50 p-4 py-2">
                        <div className="text-sm text-zinc-500">Category</div>
                        <div className="text-sm font-medium text-zinc-900 flex gap-1">
                          <p className="mt-1.5">{selected?.category}</p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-zinc-50 p-4 py-2">
                        <div className="text-sm text-zinc-500">Due date</div>
                        <div className="mt-1 text-sm font-medium text-zinc-900 flex gap-1">
                          <p className="mt-1.5">
                            {selected?.due_date ? selected?.due_date : "-/-"}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-zinc-50 p-4 py-2">
                        <div className="text-sm text-zinc-500">Priority</div>
                        <div className="mt-2 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-900">
                          <p className="">{selected?.priority}</p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-zinc-50 p-4 py-2">
                        <div className="text-sm text-zinc-500">Status</div>
                        <div className="mt-2 inline-flex gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-900">
                          <p className="">{selected?.status}</p>
                          <span>
                            {selected?.status.toLowerCase() == "completed" ? (
                              <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                            ) : (
                              <label
                                className="flex items-center gap-3 cursor-pointer select-none"
                                title="Mark as done"
                              >
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={selected.status == "Completed"}
                                  onChange={() => {
                                    handleMarkDone(selected);
                                  }}
                                />

                                <span
                                  className={`flex h-6 w-6 items-center justify-center rounded-md border transition-all duration-200 ${
                                    selected.status == "Completed"
                                      ? "border-zinc-900 bg-zinc-900 shadow-sm"
                                      : "border-zinc-300 bg-white shadow-sm"
                                  }`}
                                >
                                  {selected.id == markDone && (
                                    <LoaderCircleIcon className="w-4 h-4 animate-spin" />
                                  )}
                                </span>
                              </label>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-zinc-50 p-4">
                        <div className="text-sm text-zinc-500">Description</div>
                        <div className="mt-2 inline-flex rounded-full  py-1 text-sm font-medium">
                          <p className="">{selected?.description}</p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-zinc-50 p-4">
                        <div className="text-sm text-zinc-500">Note</div>
                        <div className="mt-2 inline-flex rounded-full  py-1 text-sm font-medium">
                          <p className="">{selected?.note}</p>
                        </div>
                      </div>
                      <div className="w-full flex justify-end">
                        <Link href={`/task/edit/${selected.id}`}>
                          <Button
                            type="button"
                            variant="filled"
                            label="Edit"
                            prerfixIcon={<EditIcon className="w-4 h-4" />}
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              No Tasks yet!
            </div>
          )}
        </section>
      )}
    </div>
  );
}
