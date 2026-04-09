import { BotMessageSquareIcon } from "lucide-react";
import { Button } from "../common/Button";

export function TaskForm() {
  return (
    <div className="w-full">
      <form className="mx-auto w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-zinc-900">
            Create a Task
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Fill in the details for the task you want the agent to manage.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Task Title
            </label>
            <input
              type="text"
              placeholder="Finish project report"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Category
            </label>
            <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white">
              <option>Work</option>
              <option>Personal</option>
              <option>Study</option>
              <option>Errand</option>
              <option>Other</option>
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Priority
            </label>
            <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Due Date
            </label>
            <input
              type="date"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Reminder Time
            </label>
            <input
              type="time"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Task Description
            </label>
            <textarea
              rows={5}
              placeholder="Describe what needs to be done..."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Notes / Extra Instructions
            </label>
            <textarea
              rows={4}
              placeholder="Add any extra details, links, or instructions..."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
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
            Agent Mode
          </button> */}
          <Button
            type="button"
            label="Agent Mode"
            variant="default"
            prerfixIcon={<BotMessageSquareIcon className="w-4 h-4" />}
          />
          <Button type="submit" label="Create Task" variant="filled" />
        </div>
      </form>
    </div>
  );
}
