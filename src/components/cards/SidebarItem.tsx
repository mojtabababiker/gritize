import Image from "next/image";
import Link from "next/link";
import { UserProblemSchema } from "@/models/schemas";
import clsx from "clsx";
import Tooltip from "../common/Tooltip";

type Props = {
  problem: UserProblemSchema;
  href: string;
};

function SidebarItem({ problem, href }: Props) {
  if (!problem || !problem.problem) return null;
  return (
    <Link
      key={problem.problem.title}
      href={href}
      className={clsx(
        "flex items-center justify-between w-full px-4 py-2 rounded-2xl bg-primary/25 shadow shadow-b cursor-pointer group",
        problem.solved ? "shadow-accent/15" : "shadow-fg/10"
      )}
    >
      <div className="relative flex-1 pr-1">
        <div className="overflow-hidden flex gap-2 items-center peer">
          <Image
            src={"/icons/list-icon.png"}
            alt=""
            width={20}
            height={20}
            className="w-2 sm:w-3 h-2 sm:h-3 object-contain"
          />
          <span className="text-base sm:text-lg w-[clamp(22ch,60vw,28ch)] capitalize text-surface group-hover:text-accent truncate">
            {problem.problem.title}
          </span>
        </div>
        <Tooltip>{problem.problem.title}</Tooltip>
      </div>
      <div className="flex gap-0.5 ">
        <span
          className={clsx(problem.solved ? "text-accent/85" : "text-fg/50")}
        >
          {problem.score}
        </span>
        /10
      </div>
    </Link>
  );
}

export default SidebarItem;
