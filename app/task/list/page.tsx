import TaskList from "@/app/components/TaskList";
import { Button } from "@/app/components/common/Button";
import { UserPlus2 } from "lucide-react";
import Link from "next/link";

export default function ListCanddiates() {
  return (
    <div className="w-full h-[90vh]">
      <div className="flex justify-end">
        <Link href="/candidate/create">
          <Button
            type="button"
            label="Create new"
            prerfixIcon={<UserPlus2 className="w-4 h-4" />}
          />
        </Link>
      </div>
      <TaskList />
    </div>
  );
}
