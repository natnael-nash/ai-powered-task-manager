"use client";

import { usePathname } from "next/navigation";

export default function SideNav() {
  const pathname = usePathname();

  if (pathname == "/") return;

  const getGreeting = (date: Date = new Date()) => {
    const hour = date.getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="lg:w-1/4 py-5 flex flex-col gap-4 pr-5">
      <h1 className="lg:max-w-xs text-3xl font-semibold leading-10 tracking-tight text-zinc-600">
        <span className="whitespace-nowrap">{getGreeting()},</span>{" "}
        <span className="text-black">Jhon!</span>
      </h1>
      <p className="max-w-lg text-lg leading-6 text-zinc-600 dark:text-zinc-400">
        Quote of the day
      </p>
    </div>
  );
}
