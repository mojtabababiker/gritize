"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { Code2, FileWarning } from "lucide-react";
import { experimental_useObject as useObject } from "@ai-sdk/react";

import { useAuth } from "@/context/AuthProvider";

import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import Link from "next/link";
import { ProgramDto } from "@/dto";
import ThinkingLoader from "@/components/playground/ThinkingLoader";

type Program = {
  program?: ProgramDto;
  error?: Error;
};

export default function Page() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [creationStatus, setCreationStatus] = useState<string>("");

  const creationMessageInterval = useRef<NodeJS.Timeout | null>(null);
  const creationCompletedTimeout = useRef<NodeJS.Timeout | null>(null);
  const initialRenderCompleted = useRef(false);

  const saveProgram = async (program: Program): Promise<void> => {
    if (!user) {
      console.error("User is not initialized");
      return;
    }
    if (creationCompletedTimeout.current) {
      clearTimeout(creationCompletedTimeout.current);
    }
    const { program: programData, error } = program;
    if (error || !programData) {
      setErrorMessage("Error generating program. Please try again later.");
      setIsLoading(false);
      setCreationStatus("");
      return;
    }

    setCreationStatus("Saving program");
    if (creationMessageInterval.current) {
      clearInterval(creationMessageInterval.current);
    }
    const { algorithms, codingPatterns } = programData;
    // console.log("programData", JSON.stringify(programData));
    // console.log("algorithms", JSON.stringify(algorithms));

    //user.algorithmProblems = program.algorithms;
    await user.setAlgorithmProblems(algorithms);
    // user.codingTechniques = program.codingPatterns;
    await user.setCodingTechniques(codingPatterns);
    user.isNewUser = false;
    await user.save();
    setUser(user);
    setIsLoading(false);
    router.replace("/dashboard");
  };
  const createProgram = () => {
    if (!user) {
      console.error("User is not initialized");
      return;
    }
    initialRenderCompleted.current = true;
    if (!isLoading && user.isNewUser) {
      setCreationStatus("Creating program");
      setErrorMessage("");
      setIsLoading(true);
      submit({
        prompt: prompt,
      });
      creationMessageInterval.current = setInterval(() => {
        setCreationStatus((prev) => {
          if (prev === "Creating program") {
            return "Analyzing your profile";
          } else if (prev === "Analyzing your profile") {
            return "Creating problems";
          } else if (prev === "Creating problems") {
            return "Finalizing your program";
          } else {
            return "Creating program";
          }
        });
      }, 6000);

      // if the program creation takes more than 45 seconds, show a message
      creationCompletedTimeout.current = setTimeout(() => {
        if (isLoading) {
          setErrorMessage(
            "Program creation is taking longer than expected. Please be patient."
          );
        }
      }, 45000);
    } else if (!user.isNewUser) {
      // router.replace("/dashboard");
    }
  };

  const handleError = (error: Error) => {
    const { message } = error;
    console.error("Error:", message);
    setErrorMessage(
      error.message ||
        "It seems all slots are occupied, please wait or try again later."
    );
  };

  const prompt = `Create a program for a ${user?.skillLevel} software engineer`;
  const { submit, error } = useObject({
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
  });

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
                This may take a moment, thank you for your patience.
                <br />
              </Paragraph>
              <div className="text-bg/65 flex items-center justify-center gap-1 w-full max-w-[420px] text-sm text-center">
                <Paragraph
                  size="sm"
                  className="text-bg/65 font-semibold w-full text-end"
                >
                  {creationStatus}
                </Paragraph>
                {/* {creationStatus} */}

                <div className="scale-80 w-full grayscale-50">
                  <ThinkingLoader />
                </div>
              </div>
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
