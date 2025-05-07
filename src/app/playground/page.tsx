"use client";

import Button from "@/components/common/Button";
import Heading from "@/components/common/Heading";
import Loading from "@/components/common/Loading";
import Paragraph from "@/components/common/Paragraph";
import CodeEditor from "@/components/playground/CodeEditor";
import ProblemSection from "@/components/playground/ProblemSection";
import { CodeSnippets } from "@/constant/codeSnippets";
import { useAuth } from "@/context/AuthProvider";
import { UserProblemSchema } from "@/models/schemas";
import { Languages } from "@/models/types/indext";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isSmallScreen, setIsSmallScreen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [problem, setProblem] = useState<UserProblemSchema | null>(null);
  const [code, setCode] = useState<string | undefined>(undefined);
  const [language, setLanguage] = useState<Languages>("javascript");
  const problemId = searchParams.get("problem");

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
    const problem = user.getAlgorithmProblem(problemId || ""); // need
    setProblem(problem);
    if (!problem) {
      // If no problemId is found, redirect to the dashboard
      // You can also show a message or a loading state here
      // Redirect to dashboard if no problemId is found
      // router.replace("/404");
    }
    // update language based on the user preference
    const userLanguage = user.preferredLanguage || "javascript";
    setLanguage(userLanguage);
    setIsLoading(user === null);
    console.log("Is loading:", user === null);
    console.log("User data:", user);
    console.log("Problem data:", problem);
  }, [user, problemId, router]);

  return isSmallScreen ? (
    <NoticeCard />
  ) : (
    <div className="w-screen bg-bg/65 flex relative h-screen overflow-hidden">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* Problem */}
          <div className="max-w-[740px] min-w-[400px] w-full">
            <ProblemSection problem={problem} />
          </div>
          {/* Code Section */}
          <div className="flex-1 min-w-[620px]">
            <CodeEditor
              onChange={setCode}
              value={code}
              defaultValue={CodeSnippets[language].code}
              language={language}
            />
          </div>
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
