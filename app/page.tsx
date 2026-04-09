import { MoveRight } from "lucide-react";
import { Button } from "./components/common/Button";
import Link from "next/link";
import { Intialiize } from "./components/Intialize";

export default function Home() {
  return (
    <div>
      {/* <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      Home
    </div> */}

      {/* <div className="w-full h-full min-h-screen flex flex-col bg-[#E7E5E6] rounded-2xl p-5 text-black"> */}
      <div>
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black">
            Wellcome.
          </h1>
          <p className="max-w-lg text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            A Task Manager powered by AI automation and integrations. You can
            interact with the interface or simply use the chat.
          </p>
          <Intialiize />
        </div>
      </div>
    </div>
  );
}
