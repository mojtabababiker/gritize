import { GitCompareIcon, MessageCircleWarningIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";
import Button from "../common/Button";
import { UIMessage } from "ai";
import { RenderMarkdown } from "../common/RenderMarkdown";
import { useAuth } from "@/context/AuthProvider";
import { UserProblemSchema } from "@/models/schemas";
import { useChat } from "@ai-sdk/react";
import clsx from "clsx";
import ThinkingLoader from "./ThinkingLoader";

type Props = {
  problem: UserProblemSchema | null;
  editorCodeText?: string;
  showHint?: boolean;
  setShowHint: (show: boolean) => void;
  onHintsLoaded: (loaded: boolean) => void;
  onError: (error: string) => void;
};

function AIAssistant({
  problem,
  editorCodeText,
  showHint,
  setShowHint,
  onHintsLoaded,
  onError,
}: Props) {
  const { user } = useAuth();

  // refs for scrolling
  const hintsScrollRef = useRef<HTMLDivElement>(null);
  const reviewScrollRef = useRef<HTMLDivElement>(null);

  const DEFAULT_HINT_PROMPT =
    "can you give more hints or guidance to help me solve this problem?";
  const DEFAULT_REVIEW_PROMPT = `Here is my code:\n\`\`\`${user?.preferredLanguage}\n{{code}}\n\`\`\``;

  const scrollToBottom = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  };

  const handleError = (error: Error, type: "hint" | "review") => {
    // console.error(`Error fetching ${type}:`, error.message);
    onError(error.message || `Failed to fetch ${type}. Please try again.`);
  };

  const handleHint = () => {
    onHintsLoaded(true);
    setShowHint(true);
    // console.log("Hint received:", message);
    setHintInput(DEFAULT_HINT_PROMPT);
    scrollToBottom(hintsScrollRef);
  };

  const handleReview = () => {
    // console.log("Review received:", message);
    scrollToBottom(reviewScrollRef);
  };

  const getHints = () => {
    if (!showHint) {
      setShowHint(true);
      return;
    }
    handleHintSubmit();
    scrollToBottom(hintsScrollRef);
  };

  const getReview = () => {
    if (!editorCodeText) {
      onError("Please provide code to review.");
      return;
    }
    const reviewPrompt = DEFAULT_REVIEW_PROMPT.replace(
      "{{code}}",
      editorCodeText
    );
    setReviewInput(reviewPrompt);
    handleReviewSubmit();
    scrollToBottom(reviewScrollRef);
  };
  // AI assistant to get hints
  const {
    messages: hintMessages,
    handleSubmit: handleHintSubmit,
    setInput: setHintInput,
    input: hintInput,
    status: hintStatus,
  } = useChat({
    id: `${problem?.id}-problem-hint`,
    api: "/api/get-problem-hint",
    initialMessages: [
      {
        id: "user-prompt-message",
        role: "user",
        content: `I need help with the following problem:\n${problem?.problem.title}.\n${problem?.problem.description}`,
      },
      {
        id: "assistant-prompt-message",
        role: "assistant",
        content: `Here are some hints and approaches to solve the problem: ${problem?.problem.hint}`,
      },
    ],
    onError: (error: Error) => handleError(error, "hint"),
    onFinish: handleHint,
  });

  // AI assistant to get a code review
  const {
    messages: reviewMessages,
    handleSubmit: handleReviewSubmit,
    setInput: setReviewInput,
    input: reviewInput,
    status: reviewStatus,
  } = useChat({
    id: `${problem?.id}-code-review`,
    api: "/api/get-code-review",
    initialMessages: [
      {
        id: "user-prompt-message",
        role: "user",
        content: `Here the problem: ${problem?.problem.title}.\n${problem?.problem.description}\n\n`,
      },
      {
        id: "assistant-prompt-message",
        role: "assistant",
        content: `Waiting for the your code to review it...`,
      },
    ],
    onError: (error: Error) => handleError(error, "review"),
    onFinish: handleReview,
  });

  useEffect(() => {
    setReviewInput(editorCodeText || "");
  }, [editorCodeText, setReviewInput]);
  useEffect(() => {
    setHintInput(DEFAULT_HINT_PROMPT);
  }, [problem, setHintInput]);

  return (
    <>
      <section
        dir="ltr"
        className="relative z-0 w-full flex flex-wrap gap-4 p-4"
      >
        <div
          className={clsx(
            "relative z-0 flex-1 min-w-[220px] flex flex-col gap-2",
            hintMessages.length === 2 && "hidden"
          )}
        >
          {/* hint messages */}
          <h4 className="text-fg/45">Hints and Approaches</h4>
          {hintMessages.map((message) => (
            <RenderMessage key={message.id} message={message} />
          ))}
          {hintStatus === "submitted" && <ThinkingLoader />}
          <div ref={hintsScrollRef} className="mt-4" />
        </div>
        <div
          className={clsx(
            "relative flex-1 min-w-[220px] flex flex-col gap-2",
            reviewMessages.length === 2 && "hidden"
          )}
        >
          {/* review messages */}
          <h4 className="text-fg/45">Code Review</h4>
          {reviewMessages.map((message) => (
            <RenderMessage key={message.id} message={message} />
          ))}
          {reviewStatus === "submitted" && <ThinkingLoader />}
          <div ref={reviewScrollRef} className="mt-4" />
        </div>
      </section>

      {/* actions */}
      <div
        dir="ltr"
        className="sticky z-20 px-4 pb-5 pt-2 -bottom-1 w-full flex items-center justify-end gap-3 bg-[#161415]"
      >
        <form onSubmit={handleHintSubmit}>
          <input name="prompt" type="text" value={hintInput} readOnly hidden />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            isSimple
            className="text-fg hover:bg-bg hover:text-surface hover:ring-surface capitalize px-3"
            onClick={getHints}
            disabled={
              hintStatus === "streaming" || reviewStatus === "streaming"
            }
            isLoading={hintStatus === "streaming"}
          >
            <div className="flex gap-2 px-3 items-center  justify-center">
              <MessageCircleWarningIcon className="w-4 h-4" />
              <span className="">get hints</span>
            </div>
          </Button>
        </form>

        <form onSubmit={handleReviewSubmit}>
          <input
            name="prompt"
            type="text"
            value={reviewInput}
            readOnly
            hidden
          />
          <Button
            type="button"
            variant="primary"
            size="sm"
            isSimple
            className="gap-2 hover:bg-primary/75 capitalize"
            onClick={getReview}
            disabled={
              reviewStatus === "streaming" ||
              hintStatus === "streaming" ||
              !editorCodeText
            }
            isLoading={reviewStatus === "streaming"}
          >
            <div className="flex gap-2 items-center justify-center px-3">
              <GitCompareIcon className="w-4 h-4 text-fg" />
              <span className="text-fg">get review</span>
            </div>
          </Button>
        </form>
      </div>
    </>
  );
}

function RenderMessage({ message }: { message: UIMessage }) {
  if (message.id.endsWith("prompt-message") || message.role === "user") {
    return null;
  }
  return (
    <div className="px-4 py-3 rounded-lg bg-primary/15 text-fg">
      <RenderMarkdown markdownText={message.content} />
    </div>
  );
}

export default AIAssistant;
