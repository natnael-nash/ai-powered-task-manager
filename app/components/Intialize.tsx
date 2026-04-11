"use client";

import { CheckCircle, Link, Loader2, MoveRight } from "lucide-react";
import { Button } from "./common/Button";
import { useState } from "react";
import { useSession } from "next-auth/react";
import LoginComponent from "./common/LoginButton";
import { useRouter } from "next/navigation";

export function Intialiize() {
  const { data: session } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    message: "",
  });

  const handleClickInitialize = async () => {
    if (status.success && session) return router.push("/task/create");
    setStatus({
      loading: true,
      success: false,
      message: "",
    });
    const res = await fetch("/api/initialize", { method: "GET" });
    if (res.ok) {
      const { success, message, error } = await res.json();
      setStatus({
        loading: false,
        success: success,
        message: message,
      });
      return;
    }
    setStatus({
      loading: false,
      success: false,
      message: "Something went wrong!",
    });
  };

  return (
    <div className="flex gap-2">
      {!session && <LoginComponent />}
      <Button
        type="button"
        label={status.success && session ? "Continue" : "Start"}
        className="rounded-3xl! disabled:cursor-not-allowed!"
        variant="filled"
        suffixIcon={
          status.loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : status.success ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <MoveRight className="w-4 h-4" />
          )
        }
        handleClick={handleClickInitialize}
      />
    </div>
  );
}
