"use client";
import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@/context/AuthProvider";
import { UserProblemSchema } from "@/models/schemas";
import Button from "../common/Button";
import Heading from "../common/Heading";
import { RenderMarkdown } from "../common/RenderMarkdown";
import Paragraph from "../common/Paragraph";
import { GitCompareIcon, MessageCircleWarningIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useChat } from "@ai-sdk/react";
import { Message, UIMessage } from "ai";
import toast from "react-hot-toast";
import CustomToast from "../common/CustomToast";

type Props = {
  problem: UserProblemSchema | null;
  editorCodeText?: string;
};

function ProblemSection({ problem, editorCodeText }: Props) {
  const { user } = useAuth();

  const hintsScrollRef = useRef<HTMLDivElement>(null);
  const reviewScrollRef = useRef<HTMLDivElement>(null);

  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintsLoaded, setHintsLoaded] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const DEFAULT_HINT_PROMPT =
    "can you give more hints or guidance to help me solve this problem?";
  const DEFAULT_REVIEW_PROMPT = `Here is my code:\n\`\`\`${user?.preferredLanguage}\n{{code}}\n\`\`\``;

  const handleHintError = (error: Error) => {
    console.error("Error fetching hints:", error.message);
    setError(error.message || "Failed to fetch hints. Please try again.");
    setHintInput(DEFAULT_HINT_PROMPT);
  };

  const handleReviewError = (error: Error) => {
    console.error("Error fetching review:", error.message);
    setError(error.message || "Failed to fetch review. Please try again.");
  };

  const handleHint = (message: Message) => {
    setHintsLoaded(true);
    setShowHint(true);
    console.log("Hint received:", message);
    setHintInput(DEFAULT_HINT_PROMPT);
    if (!hintsScrollRef.current) return;
    hintsScrollRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  const handleReview = (message: Message) => {
    console.log("Review received:", message);
    if (!reviewScrollRef.current) return;
    reviewScrollRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
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
    onError: handleHintError,
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
    onError: handleReviewError,
    onFinish: handleReview,
  });

  const getHints = async () => {
    if (!showHint) {
      setShowHint(true);
      return;
    }
    // get hint from the AI assistant
    console.log("Fetching hints...");
    handleHintSubmit();
    setHintInput("");
    if (!hintsScrollRef.current) return;
    hintsScrollRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  const getReview = async () => {
    // get review from the AI assistant
    console.log("Fetching review...");
    console.log({ reviewInput });
    handleReviewSubmit();
    console.log("Review submitted:", reviewInput);
    if (!reviewScrollRef.current) return;
    reviewScrollRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  useEffect(() => {
    if (!problem) return;

    setHintInput(DEFAULT_HINT_PROMPT);
    setReviewInput("");
  }, [problem]);

  useEffect(() => {
    if (!editorCodeText) {
      return;
    }
    const prompt = DEFAULT_REVIEW_PROMPT.replace("{{code}}", editorCodeText);
    setReviewInput(prompt);
  }, [editorCodeText]);

  useEffect(() => {
    if (error) {
      toast.custom((t) => <CustomToast t={t} message={error} type="error" />);
      setError(null);
    }
  }, [error]);

  return !problem ? null : (
    <article
      dir="rtl"
      className="problem-article relative flex flex-col w-full h-screen overflow-auto"
    >
      {/* header */}
      <section
        dir="lrt"
        className="w-full sticky top-0 z-30 flex items-center justify-between p-2 bg-primary"
      >
        {/* user avatar */}
        <Link
          href={"/dashboard"}
          className="flex-items-center justify-center rounded-full w-8 h-8 p-0 bg-surface"
        >
          {user?.avatar ? (
            <Image
              src={user.avatar}
              width={64}
              height={64}
              className="object-cover w-full h-full"
              alt={user.name}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-full font-heading font-bold text-xl sm:text-3xl text-bg/75 bg-accent/30">
              {user?.name?.at(0) || "?"}
            </div>
          )}
        </Link>

        {/* CTAs */}
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="primary"
            size="sm"
            isSimple
            className="capitalize hover:text-fg/85"
          >
            save
          </Button>
          <Button
            variant="accent"
            size="sm"
            isSimple
            className="capitalize hover:bg-accent/95"
          >
            next problem
          </Button>
        </div>
      </section>

      {/* title */}
      <Heading
        as="h3"
        size="lg"
        className="p-4 text-surface text-end w-full underline"
      >
        {problem.problem.title}
      </Heading>
      {/* context area (problem) */}
      <section
        dir="ltr"
        className="w-full flex flex-col items-center gap-4 p-4"
      >
        {/* description */}
        <div className="w-full flex flex-col gap-2">
          <Heading as="h4" size="sm" className="text-primary">
            Problem Description
          </Heading>
          <div className="w-full px-4 py-3 bg-primary/15 rounded-lg">
            <RenderMarkdown markdownText={problem.problem.description} />
          </div>
        </div>
      </section>

      {/* hints */}
      <section
        dir="ltr"
        className="w-full flex-1 flex flex-col items-center gap-4 p-4"
      >
        <div className="w-full flex flex-col gap-2">
          {/* hint & starting point */}
          <Heading as="h4" size="sm" className="text-primary">
            Hints and Approaches
          </Heading>
          <div className="w-full flex-1 flex flex-col">
            {/* show hint activator */}
            <button
              className={clsx(
                "group flex item-center gap-2 max-w-[230px] p-1 self-center text-fg capitalize border-b cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out",
                showHint && "hidden"
              )}
              onClick={() => setShowHint(!showHint)}
            >
              <MessageCircleWarningIcon className="size-4 animate-bounce group-hover:paused" />
              <span className="">show hints</span>
            </button>
            {showHint && (
              <div className="px-4 py-3 bg-primary/15 rounded-lg">
                {problem.problem.hint ? (
                  <RenderMarkdown markdownText={problem.problem.hint} />
                ) : (
                  <Paragraph
                    size="md"
                    className={clsx("text-fg", hintsLoaded && "hidden")}
                  >
                    Some guidance and starting tips that help approaching the
                    solution will appear here.
                    <Paragraph as="span" size="sm" className="text-surface/75">
                      If you need more help don’t hesitate to ask. If you got
                      stuck try the review button.
                    </Paragraph>
                  </Paragraph>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TODO: MOVE BOTH COMPLETION AND ACTION TO SEP COMP */}
      {/* completion */}
      <section
        dir="ltr"
        className="relative z-0 w-full flex flex-wrap gap-4 p-4"
      >
        <div className="relative z-0 flex-1 min-w-[220px] flex flex-col gap-2">
          {/* hint messages */}
          <h4 className="text-fg/45">Hints and Approaches</h4>
          {hintMessages.map((message) => (
            <RenderMessage key={message.id} message={message} />
          ))}
          <div ref={hintsScrollRef} />
        </div>
        <div className="relative flex-1 min-w-[220px] flex flex-col gap-2">
          {/* review messages */}
          <h4 className="text-fg/45">Code Review</h4>
          {reviewMessages.map((message) => (
            <RenderMessage key={message.id} message={message} />
          ))}
          <div ref={reviewScrollRef} />
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
            className="gap-2 text-fg hover:bg-primary/85 capitalize"
            onClick={getHints}
            disabled={
              hintStatus === "streaming" || reviewStatus === "streaming"
            }
            isLoading={hintStatus === "streaming"}
          >
            <MessageCircleWarningIcon className="w-4 h-4" />
            <span className="">get hints</span>
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
            <GitCompareIcon className="w-4 h-4 text-fg" />
            <span className="text-fg">get review</span>
          </Button>
        </form>
      </div>
    </article>
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

export default ProblemSection;
