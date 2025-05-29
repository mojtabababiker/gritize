"use client";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { useProgramGenerator } from "@/hooks/useProgramGenerator";
import { useAuth } from "@/context/AuthProvider";

import Button from "@/components/common/Button";
import CustomToast from "@/components/common/CustomToast";

import SidebarCPItems from "@/components/cards/SidebarCPItems";
import ThinkingLoader from "@/components/playground/ThinkingLoader";

import EmptySidebarCPItem from "./EmptySidebarCPItem";

function SidebarCPContainer() {
  const { user, setUser } = useAuth();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const toastMessage = (message: string, type: "success" | "error") => {
    toast.custom((t) => <CustomToast t={t} type={type} message={message} />);
  };
  const onComplete = async () => {
    if (!user) {
      // console.error("User is not initialized");
      return;
    }
    user.isNewUser = false;
    await user.save();
    setUser(user);
    toastMessage("Coding patterns generated successfully", "success");
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
    if (!user || isLoading) return;
    if (user.codingTechniques.length >= 3) {
      toastMessage("You can only have up to 3 coding patterns", "error");
      return;
    }
    if (error || errorMessage) {
      reload();
      return;
    }
    createProgram();
  };

  const reload = () => {
    setErrorMessage("");
    createProgram();
  };

  useEffect(() => {
    if (error) {
      toastMessage(
        error.message || "An error occurred while fetching coding patterns",
        "error"
      );
    } else if (errorMessage) {
      toastMessage(errorMessage, "error");
    }
  }, [error, errorMessage]);

  return (
    <>
      {user && user.codingTechniques.length > 0 ? (
        <>
          <SidebarCPItems codingPatterns={user.codingTechniques} />
          {/*generation status */}
          <div className="w-full min-h-4 flex items-center justify-center gap-1">
            {status && (
              <>
                <span className="font-semibold text-end text-base text-fg/70 inline-block">
                  {status}
                </span>
                <div className="scale-80 flex -mb-1">
                  <ThinkingLoader />
                </div>
              </>
            )}
          </div>
          {/* create new coding pattern */}
          <div className="w-full flex justify-center">
            <Button
              isSimple
              variant="accent"
              size="sm"
              onClick={handleCreateProgram}
              disabled={isLoading || user.codingTechniques.length >= 3}
              isLoading={isLoading}
              className="min-w-[120px] flex gap-1 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 "
            >
              {user.codingTechniques.length >= 3 ? "Limit Reached" : "Add more"}
            </Button>
          </div>
        </>
      ) : (
        <EmptySidebarCPItem />
      )}
    </>
  );
}

export default SidebarCPContainer;
