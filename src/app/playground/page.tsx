"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";

import { useAuth } from "@/context/AuthProvider";
import { useResize } from "@/hooks/useHandleResize";

import { CodingPatternSchema, UserProblemSchema } from "@/models/schemas";
import { Languages } from "@/models/types/indext";

import { CodeSnippets } from "@/constant/editor-constants";

import Button from "@/components/common/Button";
import Heading from "@/components/common/Heading";
import Loading from "@/components/common/Loading";
import Paragraph from "@/components/common/Paragraph";
import ResizeRuler from "@/components/common/ResizeRuler";
import CustomToast from "@/components/common/CustomToast";

import CodeEditor from "@/components/playground/CodeEditor";
import ProblemSection from "@/components/playground/ProblemSection";
import Submissions from "@/components/playground/Submissions";

import TestimonialProvider from "@/components/testimonials/TestmonialProvider";

function Playground() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const { boxRef, handleResize } = useResize({
    direction: "horizontal",
  });

  const problemId = searchParams.get("problem");
  const codingPatternId = searchParams.get("cp");

  const [problem, setProblem] = useState<UserProblemSchema | null>(null);
  const [codingPattern, setCodingPattern] =
    useState<CodingPatternSchema | null>(null);
  const [code, setCode] = useState<string | undefined>(undefined);
  const [language, setLanguage] = useState<Languages>("javascript");

  const [showSubmission, setShowSubmission] = useState(false);
  const [askForTestimonial, setAskForTestimonial] = useState(false);

  const backupCodeIntervalId = useRef<NodeJS.Timeout | null>(null);

  const getProblem = (problemId: string, codingPatternId: string | null) => {
    if (!user) {
      return null;
    }
    if (codingPatternId) {
      const problem = user.getCodingPatternProblem(codingPatternId, problemId);
      if (!problem) {
        router.replace("/dashboard");
        return null;
      }
      const codingPattern = user.getCodingTechnique(codingPatternId);
      setCodingPattern(codingPattern);
      return problem;
    } else {
      const problem = user.getAlgorithmProblem(problemId);
      if (!problem) {
        router.replace("/dashboard");
        return null;
      }
      setCodingPattern(null);
      return problem;
    }
  };

  useEffect(() => {
    if (!user || !user.id) {
      return;
    }

    if (!problemId) {
      // If no problemId is provided, fetch from localStorage
      const localStorageProblem = localStorage.getItem(`${user.id}-lpp`);
      if (localStorageProblem) {
        const {
          problemId: storedProblemId,
          codingPatternId: storedCodingPatternId,
          code: storedCode,
        } = JSON.parse(localStorageProblem);

        if (!storedProblemId) {
          toast.custom((t) => (
            <CustomToast t={t} type="error" message="No problemId found" />
          ));
          router.replace("/dashboard");
          return;
        }

        const problem = getProblem(storedProblemId, storedCodingPatternId);
        if (!problem) {
          return;
        }

        setProblem(problem);
        setIsLoading(false);
        const userLanguage = user.preferredLanguage || "javascript";
        setLanguage(userLanguage);
        setCode(storedCode || CodeSnippets[userLanguage].code);
        document.title = `Gritize | ${problem.problem.title}`;
        return;
      } else {
        toast.custom((t) => (
          <CustomToast t={t} type="error" message="No problemId found" />
        ));
        router.replace("/dashboard");
        return;
      }
    }

    // Handle URL-provided problemId
    const problem = getProblem(problemId, codingPatternId);
    setProblem(problem);
    if (!problem) {
      router.replace("/404");
      return;
    }

    // Set up user preferences
    const userLanguage = user.preferredLanguage || "javascript";
    setLanguage(userLanguage);
    setCode(CodeSnippets[userLanguage].code);
    setIsLoading(false);

    // Save to localStorage
    window.localStorage.setItem(
      `${user.id}-lpp`,
      JSON.stringify({
        problemId: problem.id,
        codingPatternId: codingPatternId,
        code: code || null,
      })
    );

    // Update window title
    document.title = `Gritize | ${problem.problem.title || "Playground"}`;
  }, [user, router, problemId, codingPatternId]);

  useEffect(() => {
    if (!user) return;
    if (user.hasReviewed) {
      setAskForTestimonial(false);
      return;
    }
    const lastAskedReview = user.lastAskedReview;
    const currentDate = new Date();
    const lastAskedDate = new Date(lastAskedReview || "");
    const diffTime = Math.abs(currentDate.getTime() - lastAskedDate.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    user.lastAskedReview = currentDate.toISOString();

    if (user.mustReview && diffHours >= 8) {
      setAskForTestimonial(true);
    }
  }, [user]);

  useEffect(() => {
    if (backupCodeIntervalId.current) {
      clearInterval(backupCodeIntervalId.current);
    }
    const saveToLocalStorage = () => {
      if (!user?.id || !problem?.id) return;

      const data = {
        problemId: problem.id,
        codingPatternId,
        code: code || null,
        test: true,
      };

      const key = `${user.id}-lpp`;
      window.localStorage.setItem(key, JSON.stringify(data));
    };

    backupCodeIntervalId.current = setInterval(saveToLocalStorage, 5000);
    return () => clearInterval(backupCodeIntervalId.current!);
  }, [user?.id, problem?.id, codingPatternId, code]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isSmallScreen ? (
    <NoticeCard />
  ) : (
    <>
      <div className="w-screen bg-bg/65 flex relative h-screen overflow-hidden">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {/* Problem */}
            <div
              ref={boxRef}
              className="relative max-w-[744px] min-w-[400px] w-full mr-1"
            >
              <ProblemSection
                editorCodeText={code}
                problem={problem}
                codingPattern={codingPattern}
                setShowSubmission={setShowSubmission}
              />
              {/* resize ruler */}
              <ResizeRuler
                onResize={handleResize}
                direction="vertical"
                className="top-0 -right-1 h-screen"
              />
            </div>
            {/* Code Section */}
            <div className="flex-1 min-w-[620px]">
              <CodeEditor
                onChange={setCode}
                value={code}
                defaultValue={CodeSnippets[language].code}
                language={language}
                problem={problem}
                setShowSubmission={setShowSubmission}
                setAskForTestimonial={setAskForTestimonial}
                codingPatternId={codingPatternId}
              />
            </div>

            {/* submissions/solution drawer */}
            <Submissions
              problemId={problem?.id || ""}
              problemTitle={problem?.problem.title || ""}
              showSubmissions={showSubmission}
              closeSubmissions={() => setShowSubmission(false)}
              setCode={setCode}
            />
          </>
        )}
      </div>
      <TestimonialProvider
        show={askForTestimonial}
        onClose={() => setAskForTestimonial(false)}
      />
    </>
  );
}

const NoticeCard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-dvh w-screen px-3">
      <div className="flex flex-col items-center gap-4 max-w-[420px] p-4 bg-fg/15 backdrop-blur-2xl shadow-2xl shadow-fg/25 rounded-xl">
        <Heading as="h1" className="text-2xl text-fg">
          Notice
        </Heading>
        <Paragraph className="text-fg text-center">
          This page is not available on small screens. Please switch to a larger
          screen to view the content.
        </Paragraph>
        <Button
          variant="accent"
          className="self-center"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Go Back Home
        </Button>
      </div>
    </div>
  );
};

function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Playground />
    </Suspense>
  );
}

export default Page;
