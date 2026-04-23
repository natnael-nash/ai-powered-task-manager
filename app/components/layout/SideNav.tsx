"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SideNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [quote, setQuote] = useState<
    { quote: string; author: string } | undefined
  >();

  const getGreeting = (date: Date = new Date()) => {
    const hour = date.getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const fetchQuote = async () => {
    const randInt = Math.floor(Math.random() * 100) + 1;
    const res = await fetch(`https://dummyjson.com/quotes/${randInt}`);

    if (res.ok) {
      const data = await res.json();
      setQuote(data);
    }
  };

  useEffect(() => {
    if (pathname !== "/") fetchQuote();
  }, []);
  if (pathname == "/") return null;
  return (
    <div className="lg:w-1/4 py-5 flex flex-col gap-4 pr-5">
      <h1 className="lg:max-w-xs text-3xl font-semibold leading-10 tracking-tight text-zinc-600">
        <span className="whitespace-nowrap">{getGreeting()},</span>{" "}
        <span className="text-black">{session?.user?.name}</span>
      </h1>
      {quote && (
        <p className="max-w-lg text-md leading-6 text-zinc-600 dark:text-zinc-400">
          {quote.quote} <span className="text-sm">- {quote.author}</span>
        </p>
      )}
    </div>
  );
}
