import clsx from "clsx";

import { RenderMarkdown } from "@/components/common/RenderMarkdown";

type BaseProps = {
  question: string;
  options: string[];
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
  answer: string;
  userAnswer: string;
  setAnswer?: never;
};

type Props = QuizModeProps | ResultModeProps;

const QuestionSC = ({
  question,
  options,
  mode = "quiz", // Default to quiz mode
  ...props
}: Props) => {
  const isQuizMode = mode === "quiz";
  const isResultMode = mode === "result";

  // For quiz mode
  const handleAnswerClick = (option: string) => {
    if (isQuizMode && props.setAnswer) {
      props.setAnswer(option);
    }
  };

  // For result mode - determine button states
  const getButtonState = (option: string) => {
    if (isQuizMode) {
      return "interactive";
    }

    if (!isResultMode) return "disabled";

    const { answer, userAnswer } = props;
    const isCorrectAnswer = answer === option;
    const isUserChoice = userAnswer === option;

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
      "flex-1 min-w-fit min-h-[40px] py-4 px-4 flex items-center justify-center gap-5 rounded-lg drop-shadow-lg transition-all duration-200";

    const stateStyles = {
      interactive: "cursor-pointer bg-fg hover:scale-95 hover:bg-fg/80",
      "correct-selected":
        "ring-1 ring-primary bg-primary text-surface shadow-lg",
      "correct-not-selected":
        "ring-1 ring-primary bg-primary/10 text-primary animate-pulse",
      "incorrect-selected":
        "ring-1 ring-red-500 bg-red-500 text-surface/80 shadow-lg",
      disabled: "bg-fg opacity-50",
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
      <div className="flex flex-wrap gap-5 w-full">
        {options.map((option) => {
          const buttonState = getButtonState(option);

          return (
            <button
              key={option}
              onClick={() => handleAnswerClick(option)}
              className={getButtonStyles(buttonState)}
              disabled={isResultMode}
              type="button"
              aria-label={`Option: ${option}`}
            >
              <div className="text-lg leading-4 sm:text-xl font-body text-center">
                {option}
              </div>
            </button>
          );
        })}
      </div>

      {/* Result Feedback (only in result mode) */}
      {isResultMode && (
        <div className="text-center mt-4">
          {props.answer === props.userAnswer ? (
            <p className="text-primary font-semibold">✓ Correct!</p>
          ) : (
            <div className="space-y-1">
              <p className="text-red-500 font-semibold">✗ Incorrect</p>
              <p className="text-sm text-bg/60">
                The correct answer is:{" "}
                <span className="font-semibold text-primary">
                  {props.answer}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionSC;
