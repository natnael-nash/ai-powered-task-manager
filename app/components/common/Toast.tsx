import { toast } from "react-toastify";

export function Toast({ message }: { message: string }) {
  const notify = () => toast(message);

  return notify;
}
