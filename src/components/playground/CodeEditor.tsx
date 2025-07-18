"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Editor, { EditorProps } from "@monaco-editor/react";

import { useResize } from "@/hooks/useHandleResize";

import { Languages } from "@/models/types/indext";
import { UserProblemSchema } from "@/models/schemas";

import {
  sandBoxURL,
  supportedLanguagesData,
} from "@/constant/editor-constants";

import Button from "@/components/common/Button";
import Timer from "@/components/common/Timer";
import { useAuth } from "@/context/AuthProvider";

const SIGNAL_MSGS: Record<string, string> = {
  SIGKILL:
    "Oops! It looks like your code caused a stack overflow. This usually happens when there's too much recursion or an infinite loop. Try checking your code for functions that call themselves without a proper exit condition. Need help? We're here to assist!",

  default: "Unexpected error occurred. Please check your code and try again.",
};

type Props = EditorProps & {
  language?: Languages;
  defaultValue: string;
  onChange: (value: string) => void;
  problem: UserProblemSchema | null;
  setShowSubmission?: (show: boolean) => void;
  setAskForTestimonial: (show: boolean) => void;
  codingPatternId: string | null;
};

function CodeEditor({
  language = "javascript",
  onChange,
  value = "",
  options = {},
  problem,
  setShowSubmission,
  setAskForTestimonial,
  codingPatternId,
  ...props
}: Props) {
  const { user, setUser } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timerTime, setTimerTimer] = useState(0); // in minutes

  const { boxRef } = useResize({ direction: "vertical" });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMount = (editor: any) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    const fetchSolution = async () => {
      if (!problem || !user) return;
      const solution = await user.getLastSolution(problem.id);
      if (solution) {
        onChange(solution.solution);
        setTimerTimer(solution.time);
      }
    };
    fetchSolution();
  }, [problem, user, onChange]);

  /**
   * Executes the code in the editor by sending it to a sandbox environment.
   *
   * @async
   * @returns {Promise<void>}
   *
   * @remarks
   * This function:
   * 1. Gets the current code from the editor
   * 2. Prepares the request payload with language settings
   * 3. Sends the code to a sandbox server for execution
   * 4. Handles the response including compilation and runtime errors
   *
   * @throws {Error} When there's a network error or server responds with an error
   *
   * @example
   * await runCode();
   *
   * @side-effects
   * - Sets isRunning state
   * - Sets error state
   * - Sets result state
   */
  const runCode = async () => {
    if (!editorRef.current) return;
    setIsRunning(true);
    const code = editorRef.current.getValue();
    const { version, extension: ext } = supportedLanguagesData[language];

    const data = {
      language,
      version,
      files: [
        {
          name: `main.${ext}`,
          content: code,
        },
      ],
    };

    // console.log("Running code with data:", data);

    try {
      const response = await fetch(`${sandBoxURL}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      const { run, compile } = result;
      if (compile?.stderr) {
        setError(compile.stderr);
        setResult(null);
        return;
      }
      if (compile?.signal) {
        setError(SIGNAL_MSGS[compile.signal] || SIGNAL_MSGS["default"]);
        return;
      }
      if (run.stderr) {
        setError(run.stderr);
        return;
      }
      if (run.signal) {
        setError(SIGNAL_MSGS[run.signal] || SIGNAL_MSGS["default"]);
        return;
      }
      setResult(run.stdout);
      setError(null);
    } catch (error) {
      // Handle error (e.g., show error message in the output area)
      setError(
        // @ts-expect-error to expensive to type it
        `An error occurred while running the code. ${error.message || ""}`
      );
    } finally {
      setIsRunning(false);
    }
  };

  /**
   * Saves the user's solution to a programming problem and updates the problem status.
   *
   * @param score - The score achieved by the user for this solution as a string
   * @returns Promise<void>
   *
   * @remarks
   * This function performs two main operations:
   * 1. Updates the problem status (score and solved state)
   * 2. Submits the solution to the backend
   *
   * @throws Will set error state if either the problem update or solution submission fails
   *
   * @requires
   * - problem object must exist and contain problem property
   * - user object must exist
   * - editorRef must be initialized
   *
   * @sideEffects
   * - Updates problem score and solved status
   * - Sets result state
   * - Sets error state
   */
  const saveSolution = async (score: string) => {
    if (!problem?.problem || !user) return;
    setResult("Saving solution...");
    setError(null); // Reset error state

    const isFirstSubmission = problem.solved === false;
    problem.score = parseInt(score, 10);
    problem.solved = true;
    const { error: problemUpdateError } = await user.updateProblem(
      problem.id,
      {
        score: problem.score,
        solved: problem.solved,
      },
      codingPatternId,
      isFirstSubmission
    );
    if (problemUpdateError) {
      // @ts-expect-error to expensive to type it
      setError(`Failed to save solution: ${problemUpdateError.message}`);
      return;
    }

    const solution = {
      problemId: problem.id,
      solution: editorRef.current.getValue(),
      score: problem.score,
      language: language,
      time: timerTime,
    };

    const { error } = await user.submitSolution(solution);
    if (error) {
      setError(`Failed to submit solution: ${error || ""}`);
      return;
    }
    setResult("Solution submitted successfully!");
    setShowSubmission?.(true);
    setError(null);
    setUser(user);

    // ask for review if the user has not reviewed yet
    if (!user.hasReviewed) {
      // Update the user to indicate that they need to review
      user.mustReview = true;
      setUser(user);

      // Ask for a testimonial/review after 3 seconds from successful submission
      setTimeout(() => {
        setAskForTestimonial(true);
      }, 3000);
    }
  };

  /**
   * Submits the code from the editor for evaluation and scoring.
   *
   * This async function performs the following:
   * 1. Gets the current code from the editor reference
   * 2. Validates that code is not empty
   * 3. Constructs a prompt with problem details and code
   * 4. Submits to API endpoint for evaluation
   * 5. Handles the response and updates the UI accordingly
   *
   * @async
   * @returns {Promise<void>}
   * @throws Will set error state if API request fails
   *
   * @remarks
   * - Requires valid editorRef.current and problem object
   * - Updates multiple state variables: result, error, and isSubmitting
   * - Calls saveSolution() on successful submission
   *
   * @example
   * await submitCode();
   */
  const submitCode = async () => {
    if (!editorRef.current || !problem?.problem) return;
    setResult("Submitting code...");
    setError(null); // Reset error state
    const { problem: problemData } = problem;
    const code = editorRef.current.getValue();
    if (!code) {
      setError("Code is empty");
      return;
    }
    setIsSubmitting(true);
    const prompt = `Problem: ${problemData.title}\n\n${problemData.description}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\``;

    try {
      const response = await fetch("/api/submit-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError("Failed to submit code");
        return;
      }
      const { message: score } = result;
      if (!score || score <= 6) {
        setError(
          `Code submission failed. Please try again.\n\nYour code was not able to solve the problem or it was not efficient enough. Please check your code and try again.\n\nIf you need help, try the hints or ask for review.\n\nHere are some tips:\n- Check for syntax errors.\n- Ensure all variables are defined.\n- Make sure your logic is correct.\n- Test with different inputs.\n\nIf you have any questions, feel free to ask!\n\n
          Score: ${score}
          `
        );
        setResult(null);
        return;
      }
      setResult(`Code submitted successfully! \nScore: ${score}`);
      setError(null);
      await saveSolution(score);
      setError(null);
    } catch (error) {
      // console.error("Error submitting code:", error);
      setError(
        // @ts-expect-error to expensive to type it
        `An error occurred while submitting the code. ${error.message || ""}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex w-full h-screen flex-col">
      {/* editor */}
      <div className="min-h-[60vh] w-full bg-[#1E1E1E] -mb-2.5">
        <Editor
          language={language.replace("++", "pp")} // monaco editor understands c++ as cpp
          onChange={onChange}
          value={value}
          theme="vs-dark"
          className="pt-10 pb-3 text-2xl"
          options={{
            fontSize: 16,
            minimap: {
              scale: 1.6,
            },
            bracketPairColorization: {
              enabled: true,
              independentColorPoolPerBracketType: true,
            },
            inlineSuggest: {
              enabled: false,
            },
            inlayHints: {
              enabled: "off",
            },
            codeLens: false,
            ...options,
          }}
          onMount={onMount}
          {...props}
        />
      </div>

      {/* terminal & actions */}
      <div
        ref={boxRef}
        className="relative flex-1 w-full min-h-[28vh] max-h-[43vh] pb-5 px-5 flex flex-col gap-3 border-t-4 rounded-t-2xl border-bg bg-[#212121]"
      >
        {/* actions */}
        <div className="w-full flex items-center gap-2 mt-6">
          <Button
            variant="accent"
            size="sm"
            isSimple
            className="gap-2 hover:bg-accent/85 capitalize"
            disabled={isRunning}
            onClick={submitCode}
            isLoading={isSubmitting}
          >
            {/* <MessageCircleWarningIcon className="w-4 h-4" /> */}
            <span className="px-3">submit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            isSimple
            className="gap-2 hover:bg-primary/75 capitalize text-fg"
            onClick={runCode}
            disabled={isRunning}
            isLoading={isRunning}
          >
            {/* <GitCompareIcon className="w-4 h-4 text-fg" /> */}
            <span className="text-fg px-4">run test</span>
          </Button>
        </div>

        {/* output */}
        <div
          className={clsx(
            "terminal w-full flex-1 rounded-lg bg-[#2a2a2a] pl-3 pr-4 py-4 overflow-auto",
            error && "border border-red-600 scroll-error",
            result && "border border-primary"
          )}
        >
          {/* output content */}
          <Terminal result={result} error={error} />
        </div>

        {/* resize ruler */}
        {/* <ResizeRuler
          direction="horizontal"
          onResize={handleResize}
          className="-top-1 z-50 left-0 w-full"
        /> */}
      </div>

      {/* timer */}
      <div className="absolute z-50 top-0 right-0 py-2 pr-4 flex gap-2 opacity-85 text-primary">
        <Timer
          minutes={timerTime}
          seconds={0}
          onTimeUp={() => {}}
          onChange={setTimerTimer}
          upTimer
        />
      </div>
    </div>
  );
}

function Terminal({
  result,
  error,
}: {
  result: string | null;
  error: string | null;
}) {
  if (!result && !error) {
    return <span className="text-fg">Output will appear here</span>;
  }
  return (
    <pre
      className={clsx(
        "text-sm  font-mono whitespace-pre-wrap",
        error ? "text-red-500 italic" : "text-green-300"
      )}
    >
      {error || result}
    </pre>
  );
}

export default CodeEditor;
