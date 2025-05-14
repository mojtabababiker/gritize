import { CodingPatternSchema } from "@/models/schemas";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../base/Accordion";
import Image from "next/image";
import SidebarItem from "./SidebarItem";
import clsx from "clsx";

type Props = {
  codingPatterns: CodingPatternSchema[];
};

function SidebarCPItems({ codingPatterns }: Props) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {codingPatterns.map((cp) => (
        <AccordionItem key={cp.id} value={cp.id} className="w-full mb-2">
          <AccordionTrigger className="group flex items-center justify-between w-full px-4 py-2 rounded-2xl bg-primary/25 shadow shadow-fg/10 shadow-b cursor-pointer hover:no-underline">
            <div className="flex-1 flex gap-2 items-center">
              <Image
                src="/icons/list-icon.png"
                alt=""
                width={20}
                height={20}
                className="w-3 h-3 object-contain"
              />
              <span className="text-lg  capitalize text-surface group-hover:text-accent truncate">
                {cp.title}
              </span>
            </div>
            <div className="flex gap-0.5 ">
              <span
                className={clsx(
                  cp.solvedProblems ? "text-accent/85" : "text-fg/50"
                )}
              >
                {cp.solvedProblems}
              </span>
              /{cp.totalProblems}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 mt-2 pl-3 w-full">
              {cp.problems.map((problem) => (
                <SidebarItem
                  key={problem.id}
                  problem={problem}
                  href={`/playground?problem=${problem.id}&cp=${cp.id}`}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default SidebarCPItems;
