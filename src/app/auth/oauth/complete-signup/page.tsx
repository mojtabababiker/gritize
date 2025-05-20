"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { Languages, SkillLevel } from "@/models/types/indext";

import { useAuth } from "@/context/AuthProvider";

import CustomToast from "@/components/common/CustomToast";
import Loading from "@/components/common/Loading";
import QuizRunner from "@/components/quiz/QuizRunner";

function Page() {
  const router = useRouter();
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useAuth();

  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const messageToaster = (
    msg: string,
    type: "error" | "success" | "info" = "success"
  ) => {
    toast.custom((t) => <CustomToast t={t} message={msg} type={type} />);
  };

  const completeSignup = () => {
    setShowQuiz(false);
    setLoading(true);
    setIsLoggedIn(true);
    messageToaster("Account Created Successfully");
    localStorage.removeItem("quizResult");
    router.replace("/dashboard");
    setLoading(false);
  };

  useEffect(() => {
    const completeLogin = async () => {
      if (!user) return;

      setLoading(true);

      // check if the user took the quiz, by checking the `quiz result` from the local storage
      const quizResultJson = localStorage.getItem("quizResult");
      const quizResult: { language: Languages; level: SkillLevel } =
        quizResultJson ? JSON.parse(quizResultJson) : null;

      // if the user took the quiz, they will be redirected to the dashboard
      // other-wise the quiz popup will be shown to the user
      if (quizResult) {
        // update the user with the quiz result
        user.onboarding = true;
        user.preferredLanguage = quizResult.language;
        user.skillLevel = quizResult.level;
        await user.save();
        setUser(user);
        setIsLoggedIn(true);
        localStorage.removeItem("quizResult");
        messageToaster("Account Created Successfully");
        router.replace("/dashboard");
        setLoading(false);
        return;
      } else {
        setLoading(false);
        setShowQuiz(true);
      }
    };

    completeLogin();
  }, [user, isLoggedIn]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
      {loading && <Loading />}
      {showQuiz && <QuizRunner onFinish={completeSignup} />}
    </div>
  );
}

export default Page;
