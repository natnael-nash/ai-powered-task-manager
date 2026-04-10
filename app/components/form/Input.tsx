import { FieldInputProps } from "react-final-form";

type ButtonProps = {
  type: "text" | "number" | "textarea" | "time" | "date" | undefined;
  value?: string;
  disabled?: boolean;
  variant?: "default" | "filled" | "primary";
  placeholder?: string;
  className?: string;
  inputProps?: FieldInputProps;
  rows?: number;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  handleChangeTextarea?: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
};
export function Input({
  type = "text",
  disabled = false,
  className,
  placeholder,
  inputProps,
  rows,
  value,
  handleChange,
  handleChangeTextarea,
  variant,
}: ButtonProps) {
  if (type === "textarea")
    return (
      <textarea
        value={value}
        rows={rows}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        className={className}
        onChange={handleChangeTextarea}
        {...inputProps}
      />
    );
  return (
    <input
      value={value}
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
      onChange={handleChange}
      {...inputProps}
    />
  );
}
