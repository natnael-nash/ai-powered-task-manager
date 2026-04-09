import { ReactElement } from "react";

interface ButtonProps {
  type: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  variant?: "default" | "filled" | "primary";
  className?: string;
  label?: string;
  prerfixIcon?: ReactElement;
  suffixIcon?: ReactElement;
  handleClick?: () => void;
}
export function Button({
  type = "button",
  disabled = false,
  variant,
  className,
  label,
  prerfixIcon,
  suffixIcon,
  handleClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`rounded-xl  px-5 py-3 text-sm font-medium  transition 
        flex items-center gap-2 cursor-pointer ${
          variant == "filled"
            ? " text-white bg-zinc-900 hover:bg-zinc-800"
            : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100 "
        } ${className}`}
      onClick={handleClick}
    >
      {prerfixIcon}
      {label}
      {suffixIcon}
    </button>
  );
}
