"use client";

import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface TaskData {
  title: string;
  date: string;
}

export default function TaskList() {
  useEffect(() => {}, []);
  const [tasks, setTasks] = useState<{
    loading: boolean;
    data: TaskData[];
  }>({
    loading: true,
    data: [],
  });

  return (
    <div className="w-full h-full flex justify-center items-center">
      {tasks.loading ? (
        <div className="flex items-center gap-2">
          <LoaderCircleIcon className="w-4 h-4 animate-spin" /> Loading
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
