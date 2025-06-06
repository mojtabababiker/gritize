import { useState, useEffect } from "react";

import clsx from "clsx";

import Button from "@/components/common/Button";
import { RenderMarkdown } from "@/components/common/RenderMarkdown";

type BaseProps = {
  question: string;
  options: string[];
  lastQuestion?: boolean;
};

type QuizModeProps = BaseProps & {
  mode?: "quiz"; // Optional with default
  setAnswer: (answer: string[]) => void;
  answer?: never;
  userAnswer?: never;
};

type ResultModeProps = BaseProps & {
  mode: "result";
  answer: string[];
  userAnswer: string[];
  setAnswer?: never;
};

type Props = QuizModeProps | ResultModeProps;

const QuestionMCs = ({
  question,
  options,
  lastQuestion = false,
  ...props
}: Props) => {
  const mode = props.mode || "quiz"; // Default to 'quiz'
  const isQuizMode = mode === "quiz";
  const isResultMode = mode === "result";

  const [selected, setSelected] = useState<string[]>([]);

  // Reset selected options when component mounts or question changes
  useEffect(() => {
    if (isQuizMode) {
      setSelected([]);
    }
  }, [question, isQuizMode]);

  const handleOptionClick = (option: string) => {
    if (!isQuizMode) return; // Prevent interaction in result mode

    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  const handleSubmit = () => {
    if (isQuizMode && props.setAnswer) {
      props.setAnswer(selected);
    }
  };

  // For result mode - determine option states
  const getOptionState = (option: string) => {
    if (isQuizMode) {
      return selected.includes(option) ? "selected" : "unselected";
    }

    if (!isResultMode) return "disabled";

    const { answer, userAnswer } = props;
    const isCorrectAnswer = answer?.includes(option);
    const isUserChoice = userAnswer?.includes(option);

    if (isCorrectAnswer && isUserChoice) {
      return "correct-selected"; // User chose a correct answer
    }
    if (isCorrectAnswer && !isUserChoice) {
      return "correct-not-selected"; // This was a correct answer but user didn't choose it
    }
    if (!isCorrectAnswer && isUserChoice) {
      return "incorrect-selected"; // User chose an incorrect answer
    }

    return "disabled"; // Not selected and not correct
  };

  // Style mapping for different option states
  const getOptionStyles = (state: string) => {
    const baseStyles =
      "sm:min-w-[180px] sm:h-[40px] flex items-center gap-3 sm:gap-5 rounded-lg transition-all duration-200";

    const stateStyles = {
      selected: "cursor-pointer",
      unselected: "cursor-pointer hover:bg-fg/20",
      "correct-selected": "bg-primary/10",
      "correct-not-selected": "bg-primary/5 animate-pulse",
      "incorrect-selected": "bg-red-500/10",
      disabled: "opacity-50",
    };

    return clsx(baseStyles, stateStyles[state as keyof typeof stateStyles]);
  };

  // Checkbox styles for different states
  const getCheckboxStyles = (state: string) => {
    const baseStyles =
      "h-6 w-6 sm:min-h-7 sm:min-w-7 rounded-full border-2 transition-all duration-200";

    const stateStyles = {
      selected: "bg-accent border-accent",
      unselected: "bg-fg border-accent",
      "correct-selected": "bg-primary border-primary",
      "correct-not-selected": "bg-primary/20 border-primary animate-pulse",
      "incorrect-selected": "bg-red-500 border-red-500",
      disabled: "bg-fg/50 border-accent/50",
    };

    return clsx(baseStyles, stateStyles[state as keyof typeof stateStyles]);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-bg/85 space-y-5">
      {/* Question */}
      <div className="w-full font-semibold text-bg/80">
        <RenderMarkdown markdownText={question} />
      </div>

      {/* Answer Options */}
      <div className="flex flex-wrap justify-between gap-2 w-full">
        {options.map((option) => {
          const optionState = getOptionState(option);

          return (
            <div
              key={option}
              onClick={() => handleOptionClick(option)}
              className={getOptionStyles(optionState)}
              role="checkbox"
              aria-checked={
                isQuizMode
                  ? selected.includes(option)
                  : isResultMode
                  ? props.userAnswer?.includes(option) || false
                  : false
              }
              tabIndex={isQuizMode ? 0 : -1}
            >
              <div className={getCheckboxStyles(optionState)} />
              <div className="flex-1 text-lg sm:text-xl font-body">
                {option}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button (only in quiz mode) */}
      {isQuizMode && (
        <Button
          variant="accent"
          onClick={handleSubmit}
          disabled={selected.length === 0}
        >
          {lastQuestion ? "Submit" : "Next"}
        </Button>
      )}

      {/* Result Feedback (only in result mode) */}
      {isResultMode && (
        <div className="text-center mt-4">
          {(() => {
            const correctAnswers = props.answer;
            const userAnswers = props.userAnswer;
            const correctCount = userAnswers?.filter((answer) =>
              correctAnswers?.includes(answer)
            ).length;
            const incorrectCount = userAnswers?.filter(
              (answer) => !correctAnswers?.includes(answer)
            ).length;
            const missedCount = correctAnswers?.filter(
              (answer) => !userAnswers?.includes(answer)
            ).length;

            const isFullyCorrect =
              correctCount === correctAnswers?.length && incorrectCount === 0;

            if (isFullyCorrect) {
              return (
                <p className="text-primary font-semibold">
                  ✓ Perfect! All correct answers selected.
                </p>
              );
            } else {
              const missedAll = incorrectCount === props.answer?.length;
              return (
                <div className="space-y-1">
                  <p
                    className={clsx(
                      "font-semibold",
                      missedAll ? "text-red-500" : "text-accent"
                    )}
                  >
                    {missedAll ? "✗ Missed All Answers" : "Partially Correct"}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-bg/60">
                    <p>✓ Correct: {correctCount}</p>
                    {incorrectCount! > 0 && (
                      <p>✗ Incorrect: {incorrectCount}</p>
                    )}
                    {missedCount! > 0 && <p>⚬ Missed: {missedCount}</p>}
                  </div>
                </div>
              );
            }
          })()}
        </div>
      )}
    </div>
  );
};

export default QuestionMCs;
