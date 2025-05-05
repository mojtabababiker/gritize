"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { Code2, FileWarning } from "lucide-react";
import { experimental_useObject as useObject } from "@ai-sdk/react";

import { TechnicalProblemSchema } from "@/models/schemas";
import { useAuth } from "@/context/AuthProvider";

import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import Link from "next/link";
import { ProgramDto } from "@/dto";

type Program = {
  program?: ProgramDto;
  error?: Error;
};

export default function Page() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const initialRenderCompleted = useRef(false);

  const saveProgram = async (program: Program): Promise<void> => {
    const { program: programData, error } = program;
    if (error || !programData) return;

    const { algorithms, codingPatterns } = programData;
    // console.log("programData", JSON.stringify(programData));
    // console.log("algorithms", JSON.stringify(algorithms));

    setIsLoading(false);

    //user.algorithmProblems = program.algorithms;
    await user.setAlgorithmProblems(algorithms);
    // user.codingTechniques = program.codingPatterns;
    await user.setCodingTechniques(codingPatterns);
    user.isNewUser = false;
    await user.save();
    setUser(user);
    router.replace("/dashboard");
  };
  const createProgram = () => {
    initialRenderCompleted.current = true;
    if (!isLoading && user.isNewUser) {
      setIsLoading(true);
      submit({
        prompt: prompt,
      });
    } else if (!user.isNewUser) {
      router.replace("/dashboard");
    }
  };

  const handleError = (error: Error) => {
    const { message, cause } = error;
    console.error("Error:", message);
    setErrorMessage("All slots are full, please wait or try again later.");
    console.error("Cause:", cause);
  };

  const prompt = `Create a program for a ${user.skillLevel} software engineer`;
  const { object, submit, error } = useObject({
    api: "/api/generate_program",
    schema: z.object({
      algorithms: z.array(z.string()),
      codingPatterns: z.array(
        z.object({
          title: z.string(),
          totalProblems: z.number(),
          info: z.string(),
          problems: z.array(z.string()),
        })
      ),
    }),
    onFinish: ({ object, error }) => saveProgram({ program: object, error }),
    onError: handleError,
  });

  useEffect(() => {
    if (!initialRenderCompleted.current) {
      console.log("initialRenderCompleted");
      createProgram();
    }
  }, []);

  return isLoading ? (
    // loading message shows up when the program is being created
    <div className="fixed z-50 inset-0 backdrop-blur-xl flex items-center justify-center overflow-hidden">
      <div className="quiz-popup min-w-[280px] min-h-[320px] flex flex-col items-center justify-center py-6 px-4 rounded-2xl">
        {!error ? (
          <>
            <Code2 size={32} className="text-accent animate-bounce" />
            <div className="flex flex-col gap-4 items-center justify-center">
              <Heading as="h3" className="text-bg/90">
                Preparing your program...
              </Heading>

              <Paragraph
                size="md"
                className="w-full max-w-[420px] text-sm text-bg/80  text-center"
              >
                Please wait while we generate your program.
                <br />
                <Paragraph as="span" size="sm" className="text-bg/65">
                  This may take a moment, thank you for your patience.
                </Paragraph>
              </Paragraph>
            </div>
          </>
        ) : (
          <>
            <FileWarning size={32} className="text-red-900 animate-pulse" />
            <div className="flex flex-col gap-4 items-center justify-center">
              <Heading as="h3" className="text-bg/90">
                Oops! Something went wrong.
              </Heading>
              <Paragraph
                size="md"
                className="w-full max-w-[420px] text-sm text-bg/80  text-center"
              >
                {errorMessage.length > 0
                  ? errorMessage
                  : "An error occurred while generating your program."}
                <br />
                <Paragraph as="span" size="sm" className="text-bg/65">
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
                  setErrorMessage("");
                  submit({
                    prompt: prompt,
                  });
                }}
              >
                Reload
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  ) : null;
}
