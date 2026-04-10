"use client";

import { HomeIcon, ListTodo, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./Toggle";
import LoginComponent from "../common/LoginButton";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const routeList = [
    {
      key: "logo",
      label: (
        <button className="cursor-pointer">
          <HomeIcon className="w-6 h-5" />
        </button>
      ),
      link: "/",
      openRoute: true,
    },
    {
      key: "createTask",
      label: "Create Task",
      link: "/task/create",
      prefixIcon: <Plus className="w-4 h-4" />,
    },

    {
      key: "listTask",
      label: "Tasks",
      link: "/task/list",
      prefixIcon: <ListTodo className="w-4 h-4" />,
    },
  ];
  return (
    <div className="w-full flex justify-between">
      <div className="flex gap-2">
        {routeList.map((route) => {
          const active =
            pathname === route.link || pathname.startsWith(route.link + "/");
          return (
            <div
              key={route.key}
              className={`
                cursor-pointer rounded-xl ${
                  active ? "bg-[#27272A] text-white" : "bg-[#E7E5E6] text-black"
                } `}
            >
              <Link
                href={route.openRoute || session ? route.link : "#"}
                className="w-fit py-2 px-3 h-full flex justify-center items-center gap-2"
                title={route.openRoute || session ? "" : "Signin first"}
              >
                {route.prefixIcon}
                {route.label}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="flex">
        <LoginComponent />
        <ThemeToggle />
      </div>
    </div>
  );
}
