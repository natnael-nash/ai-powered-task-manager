"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./Button";
import { useState } from "react";
import { Modal } from "./Modal";

export default function LoginComponent() {
  const { data: session } = useSession();

  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const getUserInitial = (name: string | null | undefined) => {
    if (!name) return "";
    return name?.[0];
  };
  if (session) {
    return (
      <div
        className="h-full w-full flex justify-end relative  cursor-pointer min-w-15"
        onMouseEnter={() => setOpenMenu(true)}
        onMouseLeave={() => setOpenMenu(false)}
      >
        {openMenu && (
          <div className="absolute right-0 top-8 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1 shadow-lg">
            <button
              onClick={() => {
                setOpenMenu(false);
                setOpenProfile(true);
              }}
              className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              Profile
            </button>

            <button
              onClick={() => {
                setOpenMenu(false);
                signOut();
              }}
              className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50 hover:text-red-700"
            >
              Sign out
            </button>
          </div>
        )}
        <div className=" border-[#27272A] rounded-full h-10 w-10 flex justify-center items-center overflow-hidden">
          {session?.user?.image ? (
            <img src={session?.user?.image} />
          ) : (
            <span className="border-2 border-[#27272A] rounded-full h-10 w-10 flex justify-center items-center overflow-hidden">
              {getUserInitial(session?.user?.name)}
            </span>
          )}
        </div>

        {openProfile && (
          <Modal
            title="Profile"
            description=""
            onClose={() => setOpenProfile(false)}
            onOk={() => setOpenProfile(false)}
          >
            <div>
              <p>Name: {session?.user?.name}</p>
              <p>Email: {session?.user?.email}</p>
              <p>
                Profile:{" "}
                {session?.user?.image ? (
                  <img src={session?.user?.image} />
                ) : (
                  <span className="border-2 border-[#27272A] rounded-full h-10 w-10 flex justify-center items-center overflow-hidden">
                    {getUserInitial(session?.user?.name)}
                  </span>
                )}
              </p>
            </div>
          </Modal>
        )}
      </div>
    );
  }
  return (
    <Button
      type="button"
      label="Sign in"
      className="rounded-3xl!   bg-white text-black"
      handleClick={() => signIn()}
    />
  );
}
