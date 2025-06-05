import { Code2Icon } from "lucide-react";
import clsx from "clsx";

import { UserQuizDTO } from "@/models/dto/user-dto";

import Heading from "@/components/common/Heading";

type Props = {
  quiz: UserQuizDTO;
};

function QuizCard({ quiz }: Props) {
  const date = new Date(quiz.$createdAt || "");
  const scoreRatio = quiz.score / quiz.questionsCount;
  return (
    <>
      <div className="services-container w-full max-w-[420px] px-2 sm:px-3 py-2 sm:py-4 rounded-2xl flex flex-col gap-3 drop-shadow-2xl cursor-pointer hover:drop-shadow-lg hover:scale-95 transition-all duration-350 ease-in-out bg-bg/10 backdrop-blur-lg">
        {/* score */}

        <div className="flex gap-2">
          {/* score */}
          <Heading
            as="h3"
            size="title"
            className={clsx(
              scoreRatio >= 0.85
                ? "text-primary"
                : scoreRatio >= 0.5
                ? "text-accent"
                : "text-red-500",
              "font-bold"
            )}
          >
            {quiz.score}
          </Heading>
          {/* all questions */}
          <Heading as="h3" size="md" className="text-fg">
            / {quiz.questionsCount}
          </Heading>
        </div>

        <div className="w-full flex justify-between items-center">
          {/* language */}
          <Heading
            as="h4"
            size="sm"
            className="text-surface capitalize flex items-center gap-1"
          >
            <Code2Icon className="size-4 sm:size-6 text-accent/55" />
            {quiz.language}
          </Heading>
          {/* taken date */}
          <h4 className="sm:text-xl text-fg">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </h4>
        </div>
      </div>

      {/* quiz details */}
    </>
  );
}

export default QuizCard;
