"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

import { FileWarning, XIcon } from "lucide-react";

import { useAuth } from "@/context/AuthProvider";
import Timer from "@/components/common/Timer";
import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import Button from "@/components/common/Button";

import { Languages, SkillLevel } from "@/models/types/indext";
import { Question, Quiz } from "@/utils/quiz-actions";

import QuestionTrueFalse from "./QuestionTrueFalse";
import QuestionSC from "./QuestionSC";
import QuestionMCs from "./QuestionMCs";

/**
 * A mapping of question types to their respective components.
 *
 * This object maps each question type to its corresponding React component,
 * allowing for dynamic rendering of different question formats in the quiz.
 */
type Q_COMPONENTS_Props = {
  question: string;
  options: string[];
  setAnswer: (answer: string | string[]) => void;
  lastQuestion?: boolean;
};

const Q_COMPONENTS: Record<Question["type"], React.FC<Q_COMPONENTS_Props>> = {
  TOF: QuestionTrueFalse,
  singleChoice: QuestionSC,
  multipleChoice: QuestionMCs,
} as const;

// popup container div tailwind classes for abstraction
const CONTAINER_CLS =
  "fixed z-50 inset-0 backdrop-blur-2xl flex items-center justify-center overflow-hidden px-3";
// popup div tailwind classes for abstraction
const CLASS_NAME =
  "quiz-popup relative w-full max-w-[640px] flex flex-col items-center justify-between px-3 py-5 rounded-xl animate-slide-up";

type QuizRunnerProps = {
  onFinish: () => void;
  closeQuiz: () => void;
};

export default function QuizRunner({ onFinish, closeQuiz }: QuizRunnerProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentPage, setCurrentPage] = useState<
    "languageSelector" | "info" | "rule" | "submitting"
  >("info");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(null);
  const [quizLanguage, setQuizLanguage] = useState<Languages | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const { user, setUser } = useAuth();

  useEffect(() => {
    if (!quizLanguage) return;
    const fetchQuiz = async () => {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `/api/generate-quiz?language=${quizLanguage}`
      );
      const { data, error } = await response.json();
      if (error) {
        console.error("Error fetching quiz:", error);
        setError(error.message || "Failed to fetch quiz!!, please try again.");
        setIsLoading(false);
        return;
      }
      // console.log("Quiz data:", data);
      setQuiz(data);
    };

    fetchQuiz();
  }, [quizLanguage]);

  /**
   * Handles the submission of an answer for the current quiz question.
   * Updates the question's answer and manages quiz progression.
   *
   * @param answer - The user's answer(s) to the current question. Can be a single string or array of strings.
   * @returns Promise<void>
   *
   * @remarks
   * - If there's no current question index or quiz, the function returns early
   * - If this is the last question or time is up, submits the entire quiz and triggers finish handlers
   * - Otherwise, advances to the next question
   *
   * @throws {Error} Logs error to console if no more questions are available
   */
  const handleAnswer = async (answer: string | string[], timeUp?: boolean) => {
    if (currentQuestionIndex === null || !quiz) {
      return;
    }
    const question = quiz.questions[currentQuestionIndex];
    question.userAnswer = answer;

    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
    if (isLastQuestion || timeUp) {
      return await submitQuiz(quiz);
    }
    setCurrentQuestionIndex((prev) => (prev !== null ? prev + 1 : null));
  };

  /**
   * Submits the quiz to the AI assistant for evaluation.
   * Updates the user instance with the quiz result and sets the level.
   * @param quiz - The quiz object containing the questions and answers
   * @returns {Promise<void>} - A promise that resolves when the quiz is submitted
   * @throws {Error} - Logs error to console if the quiz submission fails
   */
  const submitQuiz = async (quiz: Quiz): Promise<void> => {
    if (!user) {
      console.error("User is not initialized");
      return;
    }
    setCurrentQuestionIndex(null);
    setCurrentPage("submitting");
    console.log("Submitting quiz:", { quiz });
    let result = 0; // quiz checking result

    for (const question of quiz.questions) {
      let isCorrect = false;
      if (typeof question.userAnswer === typeof question.answer) {
        if (Array.isArray(question.userAnswer)) {
          if (
            question.userAnswer.length === question.answer?.length &&
            question.userAnswer.every((ans) => question.answer?.includes(ans))
          ) {
            isCorrect = true;
          }
        } else {
          isCorrect = question.userAnswer === question.answer;
        }
      }
      if (isCorrect) {
        result++;
      }
    }

    let level: SkillLevel = "entry-level";

    if (result <= quiz.questions.length / 4) {
      // 25%
      level = "entry-level";
    } else if (result <= quiz.questions.length / 2) {
      // 50%
      level = "junior";
    } else if (result <= (quiz.questions.length * 2) / 3) {
      // 66%
      level = "mid-level";
    } else {
      level = "senior";
    }

    // TODO: update the user instance with the quiz result, and set its level and toggle the new attribute to false
    user.skillLevel = level;
    // user.isNewUser = false;
    user.onboarding = true;
    if (user.id) {
      await user.save();
    }

    console.log("Quiz result:", { result, level });
    setUser(user);
    // Call the onFinish function to indicate the quiz is completed
    // give the user time seeing submitting page before calling
    setTimeout(onFinish, 2500);
    return;
  };

  if (!user) return null;

  // when the user sees all the quiz information and rules, and the quiz language is selected.
  if (currentQuestionIndex !== null && quiz) {
    const lastQuestion = currentQuestionIndex === quiz.questions.length - 1;
    const question = quiz.questions[currentQuestionIndex];
    const QuestionComponent = Q_COMPONENTS[question.type];

    return (
      <div className={clsx(CONTAINER_CLS)}>
        <div className={clsx(CLASS_NAME)}>
          {/* header */}
          <div className="w-full flex items-center justify-between gap-4 text-bg/80">
            {/* progress bar */}
            <div className="w-full flex flex-col gap-2">
              {/* bar */}
              <div className="relative w-full max-w-[625px] h-[12px] rounded-2xl bg-fg">
                <div
                  className="h-[12px] bg-accent rounded-2xl transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / quiz.questions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
              {/* counter */}
              <div className="text-sm sm:text-xl font-heading font-semibold text-bg">
                <span className="text-primary">{currentQuestionIndex + 1}</span>
                /{quiz.questions.length}
              </div>
            </div>
            {/* timer */}
            <div className="flex-1 -mt-10">
              <Timer
                minutes={7}
                seconds={10}
                onTimeUp={() => handleAnswer("", true)}
              />
            </div>
          </div>
          {/* question */}
          <div className="w-full max-w-[625px] flex flex-col gap-5 mt-5">
            <QuestionComponent
              question={question.question}
              options={question.options || []}
              setAnswer={handleAnswer}
              lastQuestion={lastQuestion}
            />
          </div>
        </div>
      </div>
    );
  }

  // display the quiz introduction, rules, and language selector as the first pages
  return (
    <div className={clsx(CONTAINER_CLS)} ref={containerRef}>
      <div className={clsx(CLASS_NAME)}>
        {/* header */}

        <div className="w-full flex flex-col gap-2 items-center justify-center">
          {/* subheading */}
          <Heading as="h3" size="md" className="text-center text-bg/85">
            Level
          </Heading>

          {/* heading */}
          <Heading as="h2" size="lg" className="text-center text-bg">
            Quiz!
          </Heading>
        </div>
        {currentPage === "info" && (
          <QuizInfo
            closeQuiz={closeQuiz}
            action={() => setCurrentPage("rule")}
            parentRef={containerRef}
          />
        )}
        {currentPage === "rule" && (
          <QuizRules
            closeQuiz={closeQuiz}
            action={() => setCurrentPage("languageSelector")}
            parentRef={containerRef}
          />
        )}
        {currentPage === "languageSelector" && (
          <div className="w-full flex-1 flex flex-col items-center justify-center my-10">
            <Paragraph size="md" className="text-center text-bg/85">
              Please select the language you want to be quizzed on:
            </Paragraph>
            <div className="flex gap-2 mt-5">
              {["typescript", "javascript", "python", "c++"].map((lang) => (
                <Image
                  key={lang}
                  src={`/images/${lang.replace("++", "pp")}-image.png`}
                  alt={`${lang} icon`}
                  className="w-[56px] sm:w-[64px] h-auto flex items-center justify-center opacity-85 cursor-pointer hover:opacity-100 hover:scale-105 transition-transform duration-200 active:scale-105"
                  onClick={() => {
                    setQuizLanguage(lang as Languages);
                    user.preferredLanguage = lang as Languages;
                    setCurrentQuestionIndex(0);
                  }}
                  width={200}
                  height={200}
                />
              ))}
            </div>
          </div>
        )}
        {currentPage === "submitting" && (
          <div className="w-full flex-1 flex items-center justify-center my-10">
            <Paragraph size="md" className="text-center text-bg/85 px-4">
              Submitting your quiz...
              <br />
              <Paragraph as="span" size="sm" className="text-bg/85 w-full">
                Please wait while we process your results.
              </Paragraph>
            </Paragraph>
          </div>
        )}

        {/* loader */}
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-fg/20 backdrop-blur-lg rounded-2xl flex items-center justify-center gap-2">
            <Image
              src="/icons/main-icon.png"
              alt="Loading..."
              width={64}
              height={64}
              className="w-16 h-16 animate-spin"
            />
            <Paragraph size="md" className="text-center text-bg/85 px-4">
              Loading...
            </Paragraph>
          </div>
        )}

        {/* error */}
        {error && (
          <div className="absolute inset-0 z-20 bg-fg/20 backdrop-blur-lg rounded-2xl flex flex-col items-center justify-center gap-2">
            <FileWarning size={32} className="text-red-900 animate-pulse" />
            <div className="flex flex-col gap-4 items-center justify-center">
              <Heading as="h3" className="text-bg/90 text-center">
                Oops!
                <br />
                Something went wrong.
              </Heading>
              <Paragraph
                size="md"
                className="w-full max-w-[420px] text-sm text-bg/80  text-center"
              >
                {error}
                <br />
                <Paragraph
                  as="span"
                  size="sm"
                  className="text-bg/65 text-center"
                >
                  You can try to reload, if the error persists please contact{" "}
                  <Link
                    href="/#contact-us"
                    className="italic underline text-bg/85 block"
                  >
                    support
                  </Link>
                  .
                </Paragraph>
              </Paragraph>
              <button
                type="button"
                className="px-6 py-3 rounded-xl text-bg/85 text-sm font-semibold font-heading text-center bg-accent cursor-pointer hover:bg-accent/80 transition-all duration-200 ease-in-out"
                onClick={() => {
                  setError(null);
                  setCurrentPage("languageSelector");
                  setQuizLanguage(null);
                }}
              >
                Reload
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type QuizInfoProps = {
  action: () => void;
  closeQuiz: () => void;
  parentRef: React.RefObject<HTMLDivElement | null>;
};

/**
 * A component that displays quiz information and a confirmation button.
 *
 * @component
 * @param {Object} props - Component props
 * @param {() => void} props.action - Callback function triggered when user
 * clicks the confirmation button
 * @returns {JSX.Element} A fragment containing quiz description and confirmation button
 *
 * @example
 * ```tsx
 * <QuizInfo action={() => handleQuizStart()} />
 * ```
 */
const QuizInfo = ({ action, closeQuiz, parentRef }: QuizInfoProps) => {
  useEffect(() => {
    const parent = parentRef.current;
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeQuiz();
      }
    };
    const handleClick = (e: MouseEvent) => {
      if (parent && e.target === parent) {
        closeQuiz();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("click", handleClick);
    };
  }, [closeQuiz, parentRef]);
  return (
    <>
      <div className="absolute top-2 right-2 size-10 rounded-full ring-1 ring-bg/65 flex items-center justify-center">
        <XIcon className="size-6 sm:size-8 text-bg/65" onClick={closeQuiz} />
      </div>
      {/* description */}
      <div className="w-full flex-1 flex items-center justify-center my-4 sm:my-10">
        <Paragraph size="md" className="sm:text-center text-bg/85 px-4">
          in order To make the experience more effective and tailored for your
          skills, we need to run a quick quiz to determine your current level in
          the selected language.
          <br />
          <Paragraph as="span" size="sm" className="text-bg/85 w-full">
            Please remember your reason joining Gritize, and be sure cheating
            will only harm you
          </Paragraph>
          <br />
          <Heading as="span" size="sm" className="text-bg">
            You are here to learn!
          </Heading>
        </Paragraph>
      </div>

      {/* start button */}
      <div className="w-full flex items-center justify-center py-1">
        <Button
          variant="ghost"
          className="bg-surface min-w-[120px] justify-center"
          onClick={action}
        >
          I understand
        </Button>
      </div>
    </>
  );
};

type QuizRulesProps = {
  action: () => void;
  closeQuiz: () => void;
  parentRef: React.RefObject<HTMLDivElement | null>;
};

const QuizRules = ({ action, closeQuiz, parentRef }: QuizRulesProps) => {
  useEffect(() => {
    const parent = parentRef.current;
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeQuiz();
      }
    };
    const handleClick = (e: MouseEvent) => {
      if (parent && e.target === parent) {
        closeQuiz();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("click", handleClick);
    };
  }, [closeQuiz, parentRef]);
  return (
    <>
      <div className="absolute top-2 right-2 size-10 rounded-full ring-1 ring-bg/65 flex items-center justify-center">
        <XIcon className="size-6 sm:size-8 text-bg/65" onClick={closeQuiz} />
      </div>
      <div className="w-full flex-1 flex flex-col items-center justify-center mt-5 sm:mt-10">
        <Paragraph size="md" className=" text-bg/85 max-w-[42ch]">
          This is a{" "}
          <span className="font-semibold">
            2-3 minutes 10-15 questions quiz
          </span>
          , which crafted to test your knowledge level, and it consists of the
          following:
        </Paragraph>
        <ul className="w-full list-disc list-inside font-semibold text-bg/85 text-xl mt-5 pl-5">
          <li>True or False questions</li>
          <li>Single choice questions</li>
          <li>Multiple choice questions</li>
        </ul>
        <Paragraph
          as="span"
          size="sm"
          className="text-bg/85 text-center max-w-[64ch] my-5"
        >
          The result of the quiz will be shared with the approximate predicted
          level by Gritize with you at the end of it.
        </Paragraph>
      </div>

      {/* start button */}
      <div className="w-full flex items-center justify-center py-1">
        <Button
          variant="ghost"
          className="bg-surface min-w-[120px] justify-center"
          onClick={action}
        >
          Start
        </Button>
      </div>
    </>
  );
};
