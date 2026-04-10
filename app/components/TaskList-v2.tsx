"use client";

import { Edit2Icon, LoaderCircleIcon, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./common/Button";
import { Input } from "./form/Input";

interface Task {
  id: number;
  title: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  status: "Pending" | "In Progress" | "Completed";
}

function getPriorityClass(priority: Task["priority"]) {
  switch (priority?.toLowerCase()) {
    case "high":
      return "bg-red-100 ";
    case "medium":
      return "bg-yellow-100 ";
    case "low":
      return "bg-green-100 ";
  }
}

export default function TaskListv2() {
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

  const { editing, selected } = tasks;

  const getTasks = async () => {
    const res = await fetch("/api/task", {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      setTasks((prev) => ({ ...prev, data: data.data }));
    }
  };

  const editingField = (attribute: "title" | "category") => {
    setTasks((prev) => ({ ...prev, editing: attribute }));
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    setTasks((prev) => {
      if (!prev.selected) return prev;

      return {
        ...prev,
        selected: { ...prev.selected, [type]: e.target.value },
      };
    });
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">
      {tasks.loading && false ? (
        <div className="flex items-center gap-2">
          <LoaderCircleIcon className="w-4 h-4 animate-spin" /> Loading
        </div>
      ) : (
        <section className="w-full rounded-2xl bg-white p-6 flex flex-row">
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
                      {task.category} • Due {task.dueDate}
                    </p>
                  </div>

                  <div className="ml-4 flex shrink-0 flex-row items-end gap-2  h-full">
                    <span
                      className={`rounded-lg px-3 py-2 text-xs font-medium capitalize ${getPriorityClass(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
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
                        {editing == "title" ? (
                          <Input
                            type="text"
                            value={selected.title}
                            className="border rounded px-1"
                            handleChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => handleEditChange(e, "title")}
                          />
                        ) : (
                          selected?.title
                        )}
                      </h2>
                      <Button
                        type="button"
                        className="border-none p-1! px-2!"
                        suffixIcon={
                          editing ? (
                            <Save className="w-4 h-4" />
                          ) : (
                            <Edit2Icon className="w-4 h-4" />
                          )
                        }
                        handleClick={() => editingField("title")}
                      />
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
                  <div className="rounded-xl bg-zinc-50 p-4">
                    <div className="text-sm text-zinc-500">Category</div>
                    <div className="text-sm font-medium text-zinc-900 flex gap-1">
                      <p className="mt-1.5">
                        {editing == "category" ? (
                          <Input
                            type="text"
                            value={selected.category}
                            className="border rounded px-1"
                            handleChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => handleEditChange(e, "category")}
                          />
                        ) : (
                          selected.category
                        )}
                      </p>

                      <Button
                        type="button"
                        className="border-none p-1! mt-1"
                        suffixIcon={
                          editing ? (
                            <Save className="w-3 h-3" />
                          ) : (
                            <Edit2Icon className="w-3 h-3" />
                          )
                        }
                        handleClick={() => editingField("category")}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl bg-zinc-50 p-4">
                    <div className="text-sm text-zinc-500">Due date</div>
                    <div className="mt-1 text-sm font-medium text-zinc-900 flex gap-1">
                      <p className="mt-1.5">
                        {selected?.dueDate ? selected?.dueDate : "-/-"}
                      </p>
                      <Button
                        type="button"
                        className="border-none p-1! mt-1"
                        suffixIcon={<Edit2Icon className="w-3 h-3" />}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl bg-zinc-50 p-4">
                    <div className="text-sm text-zinc-500">Priority</div>
                    <div className="mt-2 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-900">
                      <p className="">{selected?.priority}</p>
                      <Button
                        type="button"
                        className="border-none px-2! py-1!"
                        suffixIcon={<Edit2Icon className="w-3 h-3" />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
