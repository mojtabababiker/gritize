import { Check, X } from "lucide-react";
import clsx from "clsx";

import { RenderMarkdown } from "@/components/common/RenderMarkdown";

type BaseProps = {
  question: string;
  lastQuestion?: boolean;
};

type QuizModeProps = BaseProps & {
  mode?: "quiz";
  setAnswer: (answer: string) => void;
  answer?: never;
  userAnswer?: never;
};

type ResultModeProps = BaseProps & {
  mode: "result";
  answer: boolean;
  userAnswer: boolean;
  setAnswer?: never;
};

type Props = QuizModeProps | ResultModeProps;

const QuestionTrueFalse = ({
  question,
  mode = "quiz", // Default to quiz mode
  ...props
}: Props) => {
  const isQuizMode = mode === "quiz";
  const isResultMode = mode === "result";

  // For quiz mode
  const handleAnswerClick = (value: boolean) => {
    if (isQuizMode && props.setAnswer) {
      props.setAnswer(value.toString());
    }
  };

  // For result mode - determine button states
  const getButtonState = (buttonValue: boolean) => {
    if (isQuizMode) {
      return "interactive";
    }

    if (!isResultMode) return "disabled";

    const { answer, userAnswer } = props;
    const isCorrectAnswer = answer === buttonValue;
    const isUserChoice = userAnswer === buttonValue;

    if (isCorrectAnswer && isUserChoice) {
      return "correct-selected"; // User chose the right answer
    }
    if (isCorrectAnswer && !isUserChoice) {
      return "correct-not-selected"; // This was the right answer but user didn't choose it
    }
    if (!isCorrectAnswer && isUserChoice) {
      return "incorrect-selected"; // User chose the wrong answer
    }

    return "disabled"; // Not the answer and user didn't choose it
  };

  // Style mapping for different button states
  const getButtonStyles = (state: string) => {
    const baseStyles =
      "size-16 flex items-center justify-center rounded-full transition-all duration-200";

    const stateStyles = {
      interactive:
        "bg-fg text-primary cursor-pointer hover:bg-primary/25 hover:scale-105",
      "correct-selected":
        "bg-primary ring-2 ring-primary text-surface shadow-lg",
      "correct-not-selected":
        "ring-2 ring-primary bg-primary/10 text-primary animate-pulse",
      "incorrect-selected":
        "bg-red-500 ring-2 ring-red-500 text-surface/90 shadow-lg",
      disabled: "bg-fg/50 text-primary/30 opacity-50",
    };

    return clsx(baseStyles, stateStyles[state as keyof typeof stateStyles]);
  };

  const trueButtonState = getButtonState(true);
  const falseButtonState = getButtonState(false);

  return (
    <div className="w-full flex flex-col items-center justify-center text-bg/85 space-y-6">
      {/* Question */}
      <div className="w-full font-semibold text-bg/80 text-center">
        <RenderMarkdown markdownText={question} />
      </div>

      {/* Answer Options */}
      <div className="flex items-center justify-center gap-20">
        {/* True Button */}
        <button
          className={getButtonStyles(trueButtonState)}
          onClick={() => handleAnswerClick(true)}
          disabled={isResultMode}
          aria-label="True Button"
          type="button"
        >
          <Check className="size-12 stroke-2" />
        </button>

        {/* False Button */}
        <button
          className={getButtonStyles(falseButtonState)}
          onClick={() => handleAnswerClick(false)}
          disabled={isResultMode}
          aria-label="False Button"
          type="button"
        >
          <X className="size-12 stroke-2" />
        </button>
      </div>

      {/* Result Feedback (only in result mode) */}
      {isResultMode && (
        <div className="text-center mt-4">
          {props.answer === props.userAnswer ? (
            <p className="text-primary font-semibold flex items-center justify-center gap-2">
              <Check className="size-5" />
              Correct!
            </p>
          ) : (
            <div className="space-y-1">
              <p className="text-red-500 font-semibold flex items-center justify-center gap-2">
                <X className="size-5" />
                Incorrect
              </p>
              <p className="text-sm text-bg/60">
                The correct answer is:{" "}
                <span className="font-semibold">
                  {props.answer ? "True" : "False"}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionTrueFalse;
