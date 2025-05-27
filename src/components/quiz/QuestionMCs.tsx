import { useState } from "react";

import clsx from "clsx";

import Button from "@/components/common/Button";
import { RenderMarkdown } from "@/components/common/RenderMarkdown";

type Props = {
  question: string;
  options: string[];
  setAnswer: (answer: string[]) => void;
  lastQuestion?: boolean;
};

const QuestionMCs = ({
  question,
  options,
  setAnswer,
  lastQuestion = false,
}: Props) => {
  const [selected, setSelected] = useState<string[]>([]);
  const handleOptionClick = (option: string) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };
  return (
    <div className="w-full flex flex-col items-center justify-center text-bg/85">
      <div className="w-full font-semibold text-bg/80">
        <RenderMarkdown markdownText={question} />
      </div>
      <div className="flex flex-wrap justify-between gap-2 my-5">
        {options.map((option) => (
          <div
            key={option}
            onClick={() => handleOptionClick(option)}
            className={clsx(
              "sm:min-w-[180px] sm:h-[40px] flex items-center gap-3 sm:gap-5 rounded-lg cursor-pointer transition-all duration-200"
            )}
          >
            <div
              className={clsx(
                "h-6 w-6 sm:min-h-7 sm:min-w-7 rounded-full border-2 border-accent",
                selected.includes(option) ? "bg-accent" : "bg-fg"
              )}
            />
            <div className="flex-1 text-lg sm:text-xl font-body">{option}</div>
          </div>
        ))}
      </div>

      <Button variant="accent" onClick={() => setAnswer(selected)}>
        {lastQuestion ? "Submit" : "Next"}
      </Button>
    </div>
  );
};

export default QuestionMCs;
