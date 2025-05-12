"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthProvider";
import { useResize } from "@/hooks/useHandleResize";

import { UserProblemSchema } from "@/models/schemas";
import { Languages } from "@/models/types/indext";

import { CodeSnippets } from "@/constant/editor-constants";

import Button from "@/components/common/Button";
import Heading from "@/components/common/Heading";
import Loading from "@/components/common/Loading";
import Paragraph from "@/components/common/Paragraph";
import ResizeRuler from "@/components/common/ResizeRuler";
import CodeEditor from "@/components/playground/CodeEditor";
import ProblemSection from "@/components/playground/ProblemSection";
import Submissions from "@/components/playground/Submissions";

function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const problemId = searchParams.get("problem");
  const codingPatternId = searchParams.get("cp");

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const { boxRef, handleResize } = useResize({
    direction: "horizontal",
  });

  const [problem, setProblem] = useState<UserProblemSchema | null>(null);
  const [code, setCode] = useState<string | undefined>(undefined);
  const [language, setLanguage] = useState<Languages>("javascript");

  const [showSubmission, setShowSubmission] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    if (!problemId) {
      // If no problemId is provided, redirect to the dashboard
      console.log("No problemId provided");
      router.replace("/dashboard");
      return;
    }
    let problem: UserProblemSchema | null = null;
    if (codingPatternId) {
      problem = user.getCodingPatternProblem(codingPatternId, problemId);
    } else {
      problem = user.getAlgorithmProblem(problemId);
    }
    setProblem(problem);
    if (!problem) {
      // If no problemId is found, redirect to the dashboard
      // You can also show a message or a loading state here
      // Redirect to dashboard if no problemId is found
      router.replace("/404");
    }
    // update language based on the user preference
    const userLanguage = user.preferredLanguage || "javascript";
    setLanguage(userLanguage);
    setCode(CodeSnippets[userLanguage].code);
    setIsLoading(user === null);
  }, [user, problemId, router, searchParams]);

  return isSmallScreen ? (
    <NoticeCard />
  ) : (
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

export default Page;
