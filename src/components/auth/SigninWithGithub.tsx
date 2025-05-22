"use client";
import Image from "next/image";
import { useEffect } from "react";

import { signinWithGithub } from "@/utils/form-actions/oauthActions";

import { useAuth } from "@/context/AuthProvider";

function SigninWithGithub() {
  const { user } = useAuth();

  useEffect(() => {
    localStorage.removeItem("quizResult");
    if (!user || !user.preferredLanguage || !user.skillLevel) return;

    const quizResult = {
      language: user.preferredLanguage,
      level: user.skillLevel,
    };
    localStorage.setItem("quizResult", JSON.stringify(quizResult));
  }, [user]);
  return (
    <div className="flex items-center justify-center cursor-pointer hover:scale-95 transition-all duration-300 ease-in-out">
      <span className="sr-only">Signin with Github</span>
      <button
        onClick={signinWithGithub}
        className="flex items-center justify-center cursor-pointer"
      >
        <Image
          src="/icons/github-icon.png"
          alt="Github Logo"
          width={84}
          height={84}
          className="h-auto w-[48px] sm:w-[52px]"
        />
      </button>
    </div>
  );
}

export default SigninWithGithub;
