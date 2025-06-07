import { useState } from "react";

import { ArrowLeft, ArrowRight, XIcon } from "lucide-react";

import { UserQuizDTO } from "@/models/dto/user-dto";

import QuestionTrueFalse from "@/components/quiz/QuestionTrueFalse";
import QuestionMCs from "@/components/quiz/QuestionMCs";
import QuestionSC from "@/components/quiz/QuestionSC";
import Heading from "@/components/common/Heading";

/**
 * Type-safe props for each question component in result mode
 */
type BaseResultProps = {
  mode: "result";
  question: string;
};

type TOFResultProps = BaseResultProps & {
  answer: boolean;
  userAnswer: boolean;
  options?: never;
};

type SingleChoiceResultProps = BaseResultProps & {
  options: string[];
  answer: string;
  userAnswer: string;
};

type MultipleChoiceResultProps = BaseResultProps & {
  options: string[];
  answer: string[];
  userAnswer: string[];
};

/**
 * A mapping of question types to their respective components with proper typing.
 */
const Q_COMPONENTS = {
  TOF: QuestionTrueFalse as React.FC<TOFResultProps>,
  singleChoice: QuestionSC as React.FC<SingleChoiceResultProps>,
  multipleChoice: QuestionMCs as React.FC<MultipleChoiceResultProps>,
} as const;

type Props = {
  quiz: UserQuizDTO;
  close: () => void;
};

function QuizResult({ quiz, close }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = quiz.questions[currentQuestionIndex];

  // Navigation handlers
  const goToPrevious = () => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentQuestionIndex((prev) =>
      Math.min(quiz.questions.length - 1, prev + 1)
    );
  };

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft" && currentQuestionIndex > 0) {
      goToPrevious();
    } else if (
      event.key === "ArrowRight" &&
      currentQuestionIndex < quiz.questions.length - 1
    ) {
      goToNext();
    } else if (event.key === "Escape") {
      close();
    }
  };

  // Calculate quiz statistics
  const calculateStats = () => {
    const total = quiz.questions.length;
    let correct = 0;

    quiz.questions.forEach((question) => {
      if (question.type === "TOF") {
        if (question.answer === question.userAnswer) correct++;
      } else if (question.type === "singleChoice") {
        if (question.answer === question.userAnswer) correct++;
      } else if (question.type === "multipleChoice") {
        const correctAnswers = question.answer as string[];
        const userAnswers = question.userAnswer as string[];

        // Check if arrays are equal (same length and same elements)
        if (
          correctAnswers.length === userAnswers.length &&
          correctAnswers.every((answer) => userAnswers.includes(answer))
        ) {
          correct++;
        }
      }
    });

    return {
      correct,
      total,
      percentage: Math.round((correct / total) * 100),
    };
  };

  const stats = calculateStats();

  // Render the appropriate question component based on type
  const renderQuestionComponent = () => {
    switch (currentQuestion.type) {
      case "TOF":
        const TOFComponent = Q_COMPONENTS.TOF;
        return (
          <TOFComponent
            mode="result"
            question={currentQuestion.question}
            answer={Boolean(currentQuestion.answer)}
            userAnswer={Boolean(currentQuestion.userAnswer)}
          />
        );

      case "singleChoice":
        const SCComponent = Q_COMPONENTS.singleChoice;
        return (
          <SCComponent
            mode="result"
            question={currentQuestion.question}
            options={currentQuestion.options || []}
            answer={currentQuestion.answer as string}
            userAnswer={currentQuestion.userAnswer as string}
          />
        );

      case "multipleChoice":
        const MCComponent = Q_COMPONENTS.multipleChoice;
        return (
          <MCComponent
            mode="result"
            question={currentQuestion.question}
            options={currentQuestion.options || []}
            answer={currentQuestion.answer as string[]}
            userAnswer={currentQuestion.userAnswer as string[]}
          />
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div
      className="quiz-popup relative w-full max-w-[640px] flex flex-col items-center justify-between px-3 py-5 rounded-xl animate-slide-up"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Close button */}
      <button
        className="absolute top-2 right-2 size-10 rounded-full ring-1 ring-bg/65 flex items-center justify-center cursor-pointer hover:bg-bg/20 transition-colors duration-200"
        aria-label="Close quiz results"
        onClick={close}
      >
        <XIcon className="size-6 sm:size-8 text-bg/65" />
      </button>

      {/* Header with stats */}
      <div className="text-center mb-6">
        <Heading as="h2" size="lg" className="text-bg mb-2">
          Quiz Results
        </Heading>
        <div className="flex justify-center items-baseline gap-4 text-sm text-bg/70">
          <span className="font-heading font-semibold text-bg/80">
            <span className="font-bold">Your Score: </span>
            <span className="text-primary font-bold">{stats.correct}</span>/
            {stats.total}
          </span>
          <span className="font-heading font-semibold italic text-xs">
            ({stats.percentage}%)
          </span>
        </div>
      </div>

      {/* Question counter */}
      {/* <div className="w-full text-center mb-4">
        <span className="text-sm text-bg/60">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </span>
      </div> */}

      {/* Current question */}
      <div className="w-full flex-1 mb-6">{renderQuestionComponent()}</div>

      {/* Navigation */}
      <div className="w-full flex justify-between items-center">
        <button
          className="flex items-center gap-2 text-surface bg-primary px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200"
          onClick={goToPrevious}
          disabled={currentQuestionIndex === 0}
          aria-label="Previous question"
        >
          <ArrowLeft className="size-4" />
          {/* <span className="hidden sm:inline">Previous</span> */}
        </button>

        {/* Progress indicator */}
        <div className="flex gap-1">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentQuestionIndex
                  ? "bg-primary"
                  : "bg-bg/30 hover:bg-bg/50"
              }`}
              onClick={() => setCurrentQuestionIndex(index)}
              aria-label={`Go to question ${index + 1}`}
            />
          ))}
        </div>

        <button
          className="flex items-center gap-2 text-surface bg-primary px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200"
          onClick={goToNext}
          disabled={currentQuestionIndex === quiz.questions.length - 1}
          aria-label="Next question"
        >
          {/* <span className="hidden sm:inline">Next</span> */}
          <ArrowRight className="size-4" />
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-4 text-xs text-bg/50 text-center">
        Use arrow keys to navigate • Press Esc to close
      </div>
    </div>
  );
}

export default QuizResult;
