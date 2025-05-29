import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { FileWarning } from "lucide-react";

import { useProgramGenerator } from "@/hooks/useProgramGenerator";
import { useAuth } from "@/context/AuthProvider";

import Button from "@/components/common/Button";
import Paragraph from "@/components/common/Paragraph";
import Heading from "@/components/common/Heading";

function EmptySidebarCPItem() {
  const { user, setUser } = useAuth();

  const [message, setErrorMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const onComplete = async () => {
    if (!user) {
      // console.error("User is not initialized");
      return;
    }
    user.isNewUser = false;
    await user.save();
    setUser(user);
    setErrorMessage("");
    setStatus("");
  };

  const { createProgram, error, isLoading } = useProgramGenerator({
    programType: "coding-patterns",
    onComplete,
    onError: setErrorMessage,
    onStatusChange: setStatus,
    user,
  });

  // we're not calling createProgram directly for future improvements
  const handleCreateProgram = () => {
    createProgram();
  };

  const reload = () => {
    setErrorMessage("");
    createProgram();
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-4 items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      {isLoading ? (
        <Loading message={status} />
      ) : error || message ? (
        <ErrorMessage error={error} message={message} reload={reload} />
      ) : (
        <>
          <Paragraph size="sm" className="text-fg/70 w-full text-center">
            No techniques created yet...
          </Paragraph>
          <Button
            isSimple
            variant="accent"
            size="sm"
            onClick={handleCreateProgram}
          >
            Create yours Now
          </Button>
        </>
      )}
    </div>
  );
}

const Loading = ({ message }: { message: string }) => {
  return (
    <div className="w-full flex flex-col gap-3 items-center justify-center">
      <Heading as="h3" size="sm" className="text-fg/90">
        This may take a few seconds
      </Heading>
      <Image
        src={"/icons/main-icon.png"}
        alt="loading"
        width={50}
        height={50}
        className="w-8 h-auto animate-spin"
      />
      <Paragraph size="sm" as="div" className="text-2xl text-fg">
        {message || "Loading.."}
      </Paragraph>
    </div>
  );
};

const ErrorMessage = ({
  error,
  message,
  reload,
}: {
  error?: Error;
  message: string;
  reload: () => void;
}) => {
  return (
    <>
      <FileWarning size={28} className="text-red-900 animate-pulse" />
      <div className="flex flex-col gap-4 items-center justify-center">
        <Heading size="sm" as="h3" className="text-fg/90">
          Oops! Something went wrong.
        </Heading>
        <Paragraph size="sm" className="w-full text-sm text-fg/90  text-center">
          {message.length > 0
            ? message
            : error?.message ||
              "An error occurred while generating your program."}
          <br />
          <Paragraph as="span" size="sm" className="text-fg/65">
            You can try to reload, if the error persists please contact{" "}
            <Link
              href="/#contact-us"
              className="italic underline text-accent/85 block"
            >
              support
            </Link>
            .
          </Paragraph>
        </Paragraph>
        <button
          type="button"
          className="px-6 py-3 rounded-xl text-bg/85 text-sm font-semibold font-heading text-center bg-accent cursor-pointer hover:bg-accent/80 transition-all duration-200 ease-in-out"
          onClick={reload}
        >
          Reload
        </button>
      </div>
    </>
  );
};

export default EmptySidebarCPItem;
