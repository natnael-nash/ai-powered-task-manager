"use client";

import { BotMessageSquareIcon } from "lucide-react";
import { Button } from "../common/Button";
import { Field, Form } from "react-final-form";
import { Input } from "./Input";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Task } from "../TaskList";

export function TaskForm({ id }: { id?: string }) {
  const isEdit = !!id;
  const [task, setTask] = useState<Task | null>(null);

  const onSubmit = async (values: any) => {
    const url = isEdit ? `/api/task/${id}` : "/api/task";
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(values),
    });
    if (res.ok && res.status) return toast("Task created successfully!");
    toast.error("Something went wrong!");
  };

  const getTask = async () => {
    const res = await fetch(`/api/task/${id}`, {
      method: "GET",
    });
    if (res.ok && res.status) {
      const data = await res.json();
      const {
        due_date: dueDate,
        reminder_time: reminderTime,
        ...values
      } = data.data;

      setTask({ dueDate, reminderTime, ...values });
      return;
    }
    toast.error("Filed to get task!");
  };

  useEffect(() => {
    if (id) getTask();
  }, [id]);

  return (
    <div className="w-full">
      <Form
        onSubmit={onSubmit}
        initialValues={{ category: "work", priority: "medium", ...task }}
        // validate={}
        render={({ handleSubmit }) => (
          <form className="" onSubmit={handleSubmit}>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-zinc-900">
                {isEdit ? "Edit" : "Create"} a Task
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Fill in the details of the task.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field
                  name="title"
                  validate={(value) => (value ? undefined : "Required")}
                  render={({ input, meta }) => (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700">
                        Task Title
                      </label>
                      <span className="text-sm text-red-600">
                        {meta.touched && meta.error && (
                          <span>{meta.error}</span>
                        )}
                      </span>
                      <Input
                        type="text"
                        placeholder="Finish project report"
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                        inputProps={input}
                      />
                    </div>
                  )}
                />
              </div>

              <div className="sm:col-span-1">
                <Field
                  name="category"
                  render={({ input, meta }) => (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700">
                        Category
                      </label>

                      <select
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                        {...input}
                      >
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                        <option value="study">Study</option>
                        <option value="errand">Errand</option>
                        <option value="other">Other</option>
                      </select>

                      {meta.touched && meta.error && <span>{meta.error}</span>}
                    </div>
                  )}
                />
              </div>

              <div className="sm:col-span-1">
                <Field
                  name="priority"
                  render={({ input, meta }) => (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700">
                        Priority
                      </label>

                      <select
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                        {...input}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>

                      {meta.touched && meta.error && <span>{meta.error}</span>}
                    </div>
                  )}
                />
              </div>

              {/* <div className="sm:col-span-2">
                <div className="grid gap-4 sm:grid-cols-3"> */}
              <div className="sm:col-span-1">
                <Field
                  name="dueDate"
                  render={({ input, meta }) => (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700">
                        Due Date
                      </label>
                      <Input
                        type="date"
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                        inputProps={input}
                      />
                    </div>
                  )}
                />
              </div>

              <div className="sm:col-span-1">
                <Field
                  name="reminderTime"
                  render={({ input, meta }) => (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700">
                        Reminder Time
                      </label>
                      <Input
                        type="time"
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                        inputProps={input}
                      />
                    </div>
                  )}
                />
              </div>

              <div className="sm:col-span-1">
                <Field
                  name="status"
                  render={({ input, meta }) => (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700">
                        Task Status
                      </label>

                      <select
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                        {...input}
                      >
                        <option value="New">New</option>

                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>

                      {meta.touched && meta.error && <span>{meta.error}</span>}
                    </div>
                  )}
                />
              </div>
              {/* </div>
              </div> */}
              <div className="sm:col-span-2">
                <Field
                  name="description"
                  render={({ input, meta }) => (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700">
                        Task Description
                      </label>

                      <Input
                        type="textarea"
                        rows={5}
                        placeholder="Describe what needs to be done..."
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                        inputProps={input}
                      />
                    </div>
                  )}
                />
              </div>

              <div className="sm:col-span-2">
                <Field
                  name="note"
                  render={({ input, meta }) => (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700">
                        Notes / Extra Instructions
                      </label>

                      <Input
                        type="textarea"
                        rows={5}
                        placeholder="Add any extra details, links, or instructions..."
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                        inputProps={input}
                      />
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              {/* <button
            disabled
            type="button"
            className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Save Draft
          </button> */}
              {/* <button
            disabled
            type="button"
            className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 
            flex gap-2 items-center justify-center"
          >
            <BotMessageSquareIcon className="w-4 h-4" />
            Agentic Mode
          </button> */}
              <Button
                type="button"
                label="Agentic Mode"
                variant="default"
                prerfixIcon={<BotMessageSquareIcon className="w-4 h-4" />}
              />
              <Button
                type="submit"
                label={`${isEdit ? "Save" : "Create"} Task`}
                variant="filled"
              />
            </div>
          </form>
        )}
      />
    </div>
  );
}
