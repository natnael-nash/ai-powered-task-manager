"use client";

import { CheckCircle, Link, Loader2, MoveRight } from "lucide-react";
import { Button } from "./common/Button";
import { useState } from "react";

export function Intialiize() {
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    message: "",
  });

  const handleClickInitialize = async () => {
    if (status.success) return;
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
    <div>
      {/* <Link href="/task/create"> */}
      <Button
        type="button"
        label="Start"
        className="rounded-3xl!"
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
      {/* </Link> */}
    </div>
  );
}
