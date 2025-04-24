import { Quiz } from "@/utils/quiz-actions/types";

export async function getQuiz(language: string): Promise<Quiz> {
  return {
    id: Date.now(),
    questions: [
      {
        type: "multipleChoice",
        question: "Which of these are primitive types in JavaScript?",
        options: ["object", "null", "undefined", "number"],
      },
      {
        type: "TOF",
        question: "JavaScript is a compiled language.",
      },
      {
        type: "singleChoice",
        question: "What is the output of `console.log(typeof null)`?",
        options: ["object", "null", "undefined", "number"],
      },
      {
        type: "singleChoice",
        question: "What is the output of `console.log(...'hello')`?",
        options: ["h", "['hello']", "['h', 'e', 'l', 'l', 'o']", "SyntaxError"],
      },
      {
        type: "TOF",
        question: "`var` and `let` has the same scope rules.",
      },
      {
        type: "multipleChoice",
        question: "Which of these methods mutate the original array?",
        options: ["`slice()`", "`splice()`", "`sort()`", "`map()`"],
      },
      {
        type: "singleChoice",
        question: "What is the output of `console.log(0.1 + 0.2 === 0.3)`?",
        options: ["true", "false", "undefined", "NaN"],
      },
      {
        type: "TOF",
        question:
          "`this` keyword behaves differently in arrow functions compared to regular functions.",
      },
      {
        type: "TOF",
        question: "Is `null` a type of object in JavaScript?",
      },
      {
        type: "multipleChoice",
        question:
          "Which of the following are valid ways to create a private variable in JavaScript?",
        options: [
          "Using `var` in a closure",
          "Using `#` in a class",
          "Using `WeakMap`",
          "Using `Object.freeze()`",
        ],
      },
      {
        type: "TOF",
        question: "WeakMap keys can only be objects?",
      },
      {
        type: "singleChoice",
        question:
          "What is the primary reason to use `Symbol` in JavaScript object?",
        options: [
          "They are easier to read",
          "They are globally accessible",
          "They avoid name collisions",
          "They are faster",
        ],
      },
    ],
  };
}
