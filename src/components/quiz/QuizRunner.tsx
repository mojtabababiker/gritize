"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import Timer from "@/components/common/Timer";
import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import Button from "@/components/common/Button";

import { getQuiz } from "@/utils/quiz-actions";
import { Question, Quiz } from "@/utils/quiz-actions";
import QuestionTrueFalse from "./QuestionTrueFalse";
import QuestionSC from "./QuestionSC";
import QuestionMCs from "./QuestionMCs";
import { useAuth } from "@/context/AuthProvider";

/**
 * A mapping of question types to their respective components.
 *
 * This object maps each question type to its corresponding React component,
 * allowing for dynamic rendering of different question formats in the quiz.
 */
const Q_COMPONENTS: Record<Question["type"], React.FC<any>> = {
  TOF: QuestionTrueFalse,
  singleChoice: QuestionSC,
  multipleChoice: QuestionMCs,
} as const;

// popup container div tailwind classes for abstraction
const CONTAINER_CLS =
  "fixed z-50 inset-0 backdrop-blur-2xl flex items-center justify-center overflow-hidden";
// popup div tailwind classes for abstraction
const CLASS_NAME =
  "quiz-popup w-full max-w-[640px] flex flex-col items-center justify-between px-3 py-5 rounded-xl ";

export default function QuizRunner({ onFinish }: { onFinish: () => void }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentPage, setCurrentPage] = useState<
    "languageSelector" | "info" | "rule"
  >("info");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(null);
  const [quizLanguage, setQuizLanguage] = useState<
    "ts" | "js" | "py" | "cpp" | null
  >(null);

  const { user, setUser } = useAuth();

  useEffect(() => {
    if (!quizLanguage) return;
    const fetchQuiz = async () => {
      const quiz = await getQuiz(quizLanguage);
      if (quiz) {
        setQuiz(quiz);
      } else {
        console.error("Failed to fetch quiz");
      }
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
    question.answer = answer;

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
    // submitting the quiz to the AI assistant, determine the skill level
    // TODO: implement the AI assistant interface
    console.log("Submitting quiz:", { quiz });
    const level = "senior"; // TODO: get the level from the AI assistant

    // TODO: update the user instance with the quiz result, and set its level and toggle the new attribute to false
    user.skillLevel = level;
    user.isNewUser = false;
    user.onboarding = true;
    setUser(user);

    // Call the onFinish function to indicate the quiz is completed

    onFinish();
    setCurrentQuestionIndex(null);
    return;
  };

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
              <div className="text-xl font-heading font-semibold text-bg">
                <span className="text-primary">{currentQuestionIndex + 1}</span>
                /{quiz.questions.length}
              </div>
            </div>
            {/* timer */}
            <div className="flex-1 -mt-10">
              <Timer
                minutes={0}
                seconds={10}
                onTimeUp={() => handleAnswer("", true)}
              />
            </div>
          </div>
          {/* question */}
          <div className="w-full max-w-[625px] flex flex-col gap-5 mt-5">
            <QuestionComponent
              question={question.question}
              options={question.options}
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
    <div className={clsx(CONTAINER_CLS)}>
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
          <QuizInfo action={() => setCurrentPage("rule")} />
        )}
        {currentPage === "rule" && (
          <QuizRules action={() => setCurrentPage("languageSelector")} />
        )}
        {currentPage === "languageSelector" && (
          <div className="w-full flex-1 flex flex-col items-center justify-center my-10">
            <Paragraph size="md" className="text-center text-bg/85">
              Please select the language you want to be quizzed on:
            </Paragraph>
            <div className="flex gap-2 mt-5">
              {["ts", "js", "py", "cpp"].map((lang) => (
                <Image
                  key={lang}
                  src={`/images/${lang}-image.png`}
                  alt={`${lang} icon`}
                  className="w-[56px] sm:w-[64px] h-auto flex items-center justify-center opacity-85 cursor-pointer hover:opacity-100 hover:scale-105 transition-transform duration-200 active:scale-105"
                  onClick={() => {
                    setQuizLanguage(lang as "ts" | "js" | "py" | "cpp");
                    setCurrentQuestionIndex(0);
                  }}
                  width={200}
                  height={200}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
const QuizInfo = ({ action }: { action: () => void }) => {
  return (
    <>
      {/* description */}
      <div className="w-full flex-1 flex items-center justify-center my-10">
        <Paragraph size="md" className="text-center text-bg/85 px-4">
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
        <Button variant="ghost" onClick={action}>
          I understand
        </Button>
      </div>
    </>
  );
};

const QuizRules = ({ action }: { action: () => void }) => {
  return (
    <>
      <div className="w-full flex-1 flex flex-col items-center justify-center mt-10">
        <Paragraph size="md" className=" text-bg/85 max-w-[42ch]">
          This is a 2 minutes 10 questions quiz, which crafted to test your
          knowledge level, and it consists of the following:
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
        <Button variant="ghost" onClick={action}>
          Start
        </Button>
      </div>
    </>
  );
};
