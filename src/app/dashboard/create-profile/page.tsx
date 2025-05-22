"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Code2, FileWarning } from "lucide-react";

import { useProgramGenerator } from "@/hooks/useProgramGenerator";
import { useAuth } from "@/context/AuthProvider";

import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import ThinkingLoader from "@/components/playground/ThinkingLoader";

export default function Page() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [creationStatus, setCreationStatus] = useState<string>("");
  const initialRenderCompleted = useRef(false);

  const onComplete = async () => {
    if (!user) {
      console.error("User is not initialized");
      return;
    }
    user.isNewUser = false;
    await user.save();
    setUser(user);
    router.replace("/dashboard");
  };

  const { createProgram, error, isLoading } = useProgramGenerator({
    programType: "algorithms",
    user,
    onComplete,
    onError: setErrorMessage,
    onStatusChange: setCreationStatus,
  });

  useEffect(() => {
    if (!initialRenderCompleted.current) {
      console.log("initialRenderCompleted");
      initialRenderCompleted.current = true;
      createProgram();
    }
  });

  return isLoading ? (
    <div className="fixed z-50 inset-0 backdrop-blur-xl flex items-center justify-center overflow-hidden">
      <div className="quiz-popup min-w-[280px] min-h-[320px] flex flex-col items-center justify-center py-6 px-4 rounded-2xl">
        {!error && !errorMessage ? (
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
              <div className="text-bg/65 flex flex-col items-center justify-center gap-1 w-full max-w-[420px] text-sm text-center">
                <Paragraph
                  size="sm"
                  className="text-bg/80 font-semibold w-full text-center"
                >
                  {creationStatus}
                </Paragraph>

                <div className="scale-80 grayscale-50 flex items-center justify-center">
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
                  createProgram();
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
