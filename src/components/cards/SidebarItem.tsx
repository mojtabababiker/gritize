import Image from "next/image";
import Link from "next/link";
import { UserProblemSchema } from "@/models/schemas";

type Props = {
  problem: UserProblemSchema;
  href: string;
};

function SidebarItem({ problem, href }: Props) {
  return (
    <div
      key={problem.problem.title}
      className="flex items-center justify-between w-full px-4 py-2 rounded-2xl bg-primary/25 shadow shadow-fg/10 shadow-b"
    >
      <div className="flex gap-2 items-center">
        <Image
          src={"/icons/list-icon.png"}
          alt=""
          width={20}
          height={20}
          className="w-3 h-3 object-contain"
        />
        <Link
          href={href}
          className="text-lg  capitalize text-surface hover:text-accent"
        >
          {problem.problem.title}
        </Link>
      </div>
      <span className="text-fg/50">{problem.score}/10</span>
    </div>
  );
}

export default SidebarItem;
