import { Code2Icon } from "lucide-react";
import clsx from "clsx";

import { UserQuizDTO } from "@/models/dto/user-dto";

import Heading from "@/components/common/Heading";
import { useState } from "react";
import QuizResult from "./QuizResult";

type Props = {
  quiz: UserQuizDTO;
};

function QuizCard({ quiz }: Props) {
  const [showResult, setShowResult] = useState(false);
  const date = new Date(quiz.$createdAt || "");
  const scoreRatio = quiz.score / quiz.questionsCount;
  return (
    <>
      <div
        className="services-container w-full max-w-[420px] min-h-[120px] px-2 sm:px-3 py-2 sm:py-4 rounded-2xl flex flex-col justify-center gap-3 drop-shadow-2xl cursor-pointer hover:drop-shadow-lg hover:scale-95 transition-all duration-350 ease-in-out bg-bg/10 backdrop-blur-lg"
        onClick={() => setShowResult(true)}
      >
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
            {date.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </h4>
        </div>
      </div>
      {/* quiz result */}
      <div
        className={clsx(
          "z-50 items-center justify-center backdrop-blur-md px-3",
          showResult
            ? "flex fixed w-screen h-screen inset-0 bg-bg/20"
            : "hidden"
        )}
      >
        <QuizResult close={() => setShowResult(false)} quiz={quiz} />
      </div>
    </>
  );
}

export default QuizCard;
