import { useState } from "react";
import clsx from "clsx";
import Heading from "@/components/common/Heading";
import Button from "@/components/common/Button";

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
      <Heading as="h3" size="sm" className="w-full font-semibold">
        {question}
      </Heading>
      <div className="flex flex-wrap justify-between gap-2 my-5">
        {options.map((option) => (
          <div
            key={option}
            onClick={() => handleOptionClick(option)}
            className={clsx(
              "w-fit min-w-[180px] h-[40px] flex items-stretch  gap-5 rounded-lg cursor-pointer transition-all duration-200"
            )}
          >
            <div
              className={clsx(
                "size-7 min-h-7 min-w-7 rounded-full border-2 border-accent",
                selected.includes(option) ? "bg-accent" : "bg-fg"
              )}
            />
            <div className="w-full  flex-1 text-xl leading-4 font-body">
              {option}
            </div>
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
