"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import toast from "react-hot-toast";
import { InfoIcon, MessageCircleWarningIcon } from "lucide-react";

import { useAuth } from "@/context/AuthProvider";
import { CodingPatternSchema, UserProblemSchema } from "@/models/schemas";

import Button from "@/components/common/Button";
import Heading from "@/components/common/Heading";
import { RenderMarkdown } from "@/components/common/RenderMarkdown";
import Paragraph from "@/components/common/Paragraph";
import CustomToast from "@/components/common/CustomToast";
import { UserImage } from "@/components/dashboard/UserImage";

import AIAssistant from "./AIAssistant";

type Props = {
  problem: UserProblemSchema | null;
  codingPattern: CodingPatternSchema | null;
  editorCodeText?: string;
  showSubmission?: boolean;
  setShowSubmission?: (show: boolean) => void;
};

function ProblemSection({
  problem,
  codingPattern,
  editorCodeText,
  setShowSubmission,
}: Props) {
  const router = useRouter();
  const { user } = useAuth();

  const [nextProblem, setNextProblem] = useState<UserProblemSchema | null>(
    null
  );

  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintsLoaded, setHintsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [problemLoadingError, setProblemLoadingError] =
    useState<boolean>(false);

  useEffect(() => {
    if (error) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          message={error}
          // icon={<MessageCircleWarningIcon className="size-4" />}
          type="error"
        />
      ));
    }
  }, [error]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      if (loading) {
        setProblemLoadingError(true);
        setError("Failed to load the problem. Please try again later.");
        setLoading(false);
        return;
      }
    }, 1500);
    if (!user || !problem) return;
    const nextProblem = user.getProblemAfter(problem.id, codingPattern?.id);
    setNextProblem(nextProblem);
    setLoading(false);

    // if we reached here, it means the problem is loaded
    if (problemLoadingError) {
      setProblemLoadingError(false);
      setError(null);
    }
    clearTimeout(timeout);
  }, [user, problem, codingPattern]);

  const goToNextProblem = () => {
    if (!nextProblem) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          message="No more problems available."
          type="warning"
        />
      ));
      return;
    }
    const nextProblemId = nextProblem.id;

    router.push(
      `/playground?problem=${nextProblemId}${
        codingPattern ? `&cp=${codingPattern.id}` : ""
      }`
    );
  };

  return !problem ? null : (
    <article
      dir="rtl"
      className="problem-article relative flex flex-col w-full h-screen overflow-auto"
    >
      {problemLoadingError ? (
        <div className="w-full h-full flex items-center justify-center">
          <Paragraph size="lg" className="text-fg/50">
            {error}
          </Paragraph>
          <div className="flex w-full justify-between items-center">
            <Button
              variant="primary"
              size="sm"
              isSimple
              className="capitalize hover:text-fg/85"
              onClick={() => router.refresh()}
            >
              Retry
            </Button>
            <Link
              href={"/dashboard"}
              className="flex items-center justify-center rounded-2xl px-3 py-2 bg-transparent border border-accent/20 text-accent/80 hover:bg-primary/10 hover:text-accent/100 transition-all duration-300 ease-in-out"
            >
              back home
            </Link>
          </div>
        </div>
      ) : (
        <>
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
              <UserImage
                size="xs"
                avatar={user?.avatar}
                username={user?.name || "?"}
                className="text-bg/75 bg-accent/30"
              />
            </Link>

            {/* CTAs */}
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="primary"
                size="sm"
                isSimple
                className="capitalize hover:text-fg/85"
                onClick={() => setShowSubmission?.(true)}
              >
                submissions
              </Button>
              <Button
                variant="accent"
                size="sm"
                isSimple
                className="capitalize hover:bg-accent/95"
                onClick={goToNextProblem}
              >
                <span className=" px-3"> next problem</span>
              </Button>
            </div>
          </section>

          {/* title */}
          <section dir="ltr" className="w-full flex flex-col items-center p-4">
            {codingPattern && (
              <div className="relative w-full -mb-2 flex items-center gap-2">
                <Heading as="h4" size="sm" className="text-fg peer">
                  {codingPattern.title}
                </Heading>
                <InfoIcon className="size-4 text-fg peer" />
                <div className="absolute -z-10 peer-hover:z-50 hover:z-50 top-full w-full px-4 py-3 bg-primary rounded-lg opacity-0 peer-hover:block hover:opacity-100 hover:block peer-hover:animate-fade-in transition-all duration-300 ease-in-out">
                  <RenderMarkdown markdownText={codingPattern.info} />
                </div>
              </div>
            )}
            <Heading
              as="h3"
              size="lg"
              className="text-surface  w-full underline"
            >
              {problem.problem.title}
            </Heading>
          </section>
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
                Hints and Reviews
              </Heading>
              <div className="w-full flex-1 flex flex-col">
                {/* show hint activator */}
                <button
                  className={clsx(
                    "group flex item-center gap-2 max-w-[230px] p-1 self-center text-fg capitalize border-b cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out",
                    showHint && "hidden"
                  )}
                  onClick={() => setShowHint(true)}
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
                        Some guidance and starting tips that help approaching
                        the solution will appear here.
                        <Paragraph
                          as="span"
                          size="sm"
                          className="text-surface/75"
                        >
                          If you need more help don’t hesitate to ask. If you
                          got stuck try the review button.
                        </Paragraph>
                      </Paragraph>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* completion */}
          <AIAssistant
            problem={problem}
            editorCodeText={editorCodeText}
            showHint={showHint}
            setShowHint={setShowHint}
            onHintsLoaded={setHintsLoaded}
            onError={setError}
          />
        </>
      )}
    </article>
  );
}

export default ProblemSection;
