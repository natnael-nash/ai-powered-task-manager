import { FieldInputProps } from "react-final-form";

interface ButtonProps {
  type: "text" | "number" | "textarea" | "time" | "date" | undefined;
  disabled?: boolean;
  variant?: "default" | "filled" | "primary";
  placeholder?: string;
  className?: string;
  inputProps?: FieldInputProps;
  rows?: number;
}
export function Input({
  type = "text",
  disabled = false,
  className,
  placeholder,
  inputProps,
  rows,
  variant,
}: ButtonProps) {
  if (type === "textarea")
    return (
      <textarea
        rows={rows}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        className={className}
        {...inputProps}
      />
    );
  return (
    <input
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
      {...inputProps}
    />
  );
}
