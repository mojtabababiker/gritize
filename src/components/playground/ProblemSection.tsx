"use client";
import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@/context/AuthProvider";
import { UserProblemSchema } from "@/models/schemas";
import Button from "../common/Button";
import Heading from "../common/Heading";
import { RenderMarkdown } from "../common/RenderMarkdown";
import Paragraph from "../common/Paragraph";
import { GitCompareIcon, MessageCircleWarningIcon } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

type Props = {
  problem: UserProblemSchema | null;
};

function ProblemSection({ problem }: Props) {
  const { user } = useAuth();
  const [showHint, setShowHint] = useState<boolean>(false);

  const getHints = async () => {
    if (!showHint) {
      setShowHint(true);
      return;
    }
    // get hint from the AI assistant
  };

  return !problem ? null : (
    <article
      dir="rtl"
      className="problem-article relative flex flex-col w-full h-screen overflow-auto"
    >
      {/* header */}
      <section
        dir="lrt"
        className="w-full sticky top-0 flex items-center justify-between p-2 bg-primary"
      >
        {/* user avatar */}
        <Link
          href={"/dashboard"}
          className="flex-items-center justify-center rounded-full w-8 h-8 p-0 bg-surface"
        >
          {user?.avatar ? (
            <Image
              src={user.avatar}
              width={64}
              height={64}
              className="object-cover w-full h-full"
              alt={user.name}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-full font-heading font-bold text-xl sm:text-3xl text-bg/75 bg-accent/30">
              {user?.name?.at(0) || "?"}
            </div>
          )}
        </Link>

        {/* CTAs */}
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="primary"
            size="sm"
            isSimple
            className="capitalize hover:text-fg/85"
          >
            save
          </Button>
          <Button
            variant="accent"
            size="sm"
            isSimple
            className="capitalize hover:bg-accent/95"
          >
            next problem
          </Button>
        </div>
      </section>

      {/* title */}
      <Heading
        as="h3"
        size="lg"
        className="p-4 text-surface text-end w-full underline"
      >
        {problem.problem.title}
      </Heading>
      {/* context area (problem) */}
      <section
        dir="ltr"
        className="w-full flex flex-col items-center gap-4 p-4"
      >
        {/* description */}
        <div className="w-full flex flex-col gap-2">
          <Heading as="h4" size="sm" className="text-primary">
            Problem Description
          </Heading>
          <div className="w-full px-4 py-3 bg-primary/15 rounded-lg">
            <RenderMarkdown markdownText={problem.problem.description} />
          </div>
        </div>
      </section>

      {/* AI Assistant & hints */}
      <section
        dir="ltr"
        className="w-full flex-1 flex flex-col items-center gap-4 p-4"
      >
        <div className="w-full flex flex-col gap-2 pb-40">
          {/* hint & starting point */}
          <Heading as="h4" size="sm" className="text-primary">
            Hints and Approaches
          </Heading>
          <div className="w-full flex-1 flex flex-col">
            {/* show hint activator */}
            <button
              className={clsx(
                "group flex item-center gap-2 max-w-[230px] p-1 self-center text-fg capitalize border-b cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out",
                showHint && "hidden"
              )}
              onClick={() => setShowHint(!showHint)}
            >
              <MessageCircleWarningIcon className="size-4 animate-bounce group-hover:paused" />
              <span className="">show hints</span>
            </button>
            {showHint && (
              <div className="px-4 py-3 bg-primary/15 rounded-lg">
                {problem.problem.hint ? (
                  <RenderMarkdown markdownText={problem.problem.hint} />
                ) : (
                  <Paragraph size="md" className="text-fg">
                    Some guidance and starting tips that help approaching the
                    solution will appear here.
                    <Paragraph as="span" size="sm" className="text-surface/75">
                      If you need more help don’t hesitate to ask. If you got
                      stuck try the review button.
                    </Paragraph>
                  </Paragraph>
                )}
              </div>
            )}
            {/* AI Assistant */}
            <div className="relative w-full flex-1 flex flex-col gap-2">
              {/* messages */}
            </div>
          </div>
        </div>
      </section>
      {/* actions */}
      <div
        dir="ltr"
        className="sticky z-20 px-4 pb-5 pt-2 -bottom-1 w-full flex items-center justify-end gap-3 bg-[#161415]"
      >
        <Button
          variant="ghost"
          size="sm"
          isSimple
          className="gap-2 text-fg hover:bg-primary/85 capitalize"
          onClick={getHints}
        >
          <MessageCircleWarningIcon className="w-4 h-4" />
          <span className="">get hints</span>
        </Button>
        <Button
          variant="primary"
          size="sm"
          isSimple
          className="gap-2 hover:bg-primary/75 capitalize"
        >
          <GitCompareIcon className="w-4 h-4 text-fg" />
          <span className="text-fg">get review</span>
        </Button>
      </div>
    </article>
  );
}

export default ProblemSection;
