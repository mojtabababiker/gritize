"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import toast from "react-hot-toast";

import { useAuth } from "@/context/AuthProvider";

import StatisticalCard from "@/components/cards/StatisticalCard";
import DashboardActions from "@/components/dashboard/DashboardActions";
import CustomToast from "@/components/common/CustomToast";
import Bounded from "@/components/common/Bounded";
import Heading from "@/components/common/Heading";
import Loading from "@/components/common/Loading";

function Page() {
  const router = useRouter();
  const { user } = useAuth();

  console.log(user?.quizzes);
  useEffect(() => {
    if (!user) {
      return;
    }
    if (user.id && user.isNewUser) {
      // If the user is new and has no algorithm problems, redirect to create profile
      // This is a temporary solution until we have a better way to handle new users
      router.push("/dashboard/create-profile");
    }
    // console.log("User data:", user);
  }, [user, router]);

  // if user is logged in, check for quiz on local storage
  useEffect(() => {
    const checkQuiz = async () => {
      if (user && user.id) {
        const quiz = localStorage.getItem("userQuiz");
        if (quiz) {
          // remove quiz from local storage
          localStorage.removeItem("userQuiz");
          // save quiz to user data
          const parsedQuiz = JSON.parse(quiz);
          const { error } = await user.saveQuiz({
            ...parsedQuiz,
            userId: user.id,
          });
          if (error) {
            // console.error("Failed to save quiz:", error);
            toast.custom((t) => (
              <CustomToast t={t} type="error" message={error} />
            ));
          }
        }
      }
    };
    checkQuiz();
  }, [user]);
  if (!user || !user.id) {
    return <Loading />;
  }

  return (
    <Bounded className="profile-container relative z-20 min-h-screen pb-40">
      {/* bg */}
      <Image
        src={"/images/hero.png"}
        alt=""
        width={1440}
        height={860}
        className="fixed inset-0 -z-10 w-full h-auto origin-top object-top blur-md opacity-25"
      />
      {/* body */}
      <article className="w-full flex flex-col justify-between overflow-hidden">
        {/* welcoming */}
        <div className="flex flex-col mt-14">
          <Heading as="h4" size="sm" className="text-surface">
            Welcome, {user.name}!
          </Heading>
          <Heading as="h3" size="lg" className="text-fg  lg:-mt-4">
            {`Let's Keep The `}
            <Heading
              as="span"
              size="title"
              className="text-accent block sm:inline-block"
            >
              Grit Up
            </Heading>
          </Heading>
        </div>

        {/* stats card */}
        <div className="flex flex-wrap items-center justify-center gap-4 my-6">
          {/* total problems card */}
          <StatisticalCard
            title="Total Solved Problems"
            value={user.totalSolvedProblems || 0}
            className="flex-1"
          />
          {/* total algorithms card */}
          <StatisticalCard
            title="Solved Algorithms"
            value={
              user.algorithmProblems.filter((algo) => algo.solved).length || 0
            }
            className="flex-1"
          />
          {/* total technique card */}
          <StatisticalCard
            title="Learned Techniques"
            value={
              user.codingTechniques.filter(
                (tech) => tech.solvedProblems === tech.totalProblems
              ).length || 0
            }
            className="flex-1"
          />
        </div>
        <DashboardActions />
      </article>
    </Bounded>
  );
}

export default Page;
