"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { TechnicalProblemSchema } from "@/models/schemas";

import { useAuth } from "@/context/AuthProvider";

import { FeaturedProblems } from "@/components/dashboard/FeaturedProblems";
import StatisticalCard from "@/components/cards/StatisticalCard";
import Bounded from "@/components/common/Bounded";
import Heading from "@/components/common/Heading";

function page() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [featuredProblems, setFeaturedProblems] = useState<
    TechnicalProblemSchema[]
  >([]);

  useEffect(() => {
    if (user.id && user.isNewUser) {
      // If the user is new and has no algorithm problems, redirect to create profile
      // This is a temporary solution until we have a better way to handle new users
      router.push("/dashboard/create-profile");
    }
    console.log("User data:", user);
  }, [user.id, user.isNewUser, router]);

  return (
    <Bounded className="profile-container relative z-20 min-h-screen pb-40">
      {/* bg */}
      <Image
        src={"/images/hero.png"}
        alt=""
        width={1440}
        height={860}
        className="fixed inset-0 -z-10 w-full h-auto origin-top object-top blur-md"
      />
      {/* body */}
      <article className="relative w-full flex flex-col justify-between overflow-hidden">
        {/* welcoming */}
        <div className="flex flex-col mt-14">
          <Heading as="h4" size="sm" className="text-surface">
            Welcome, {user.name}!
          </Heading>
          <Heading as="h3" size="lg" className="text-fg sm:-mt-10">
            Let's Keep The{" "}
            <Heading as="span" size="title" className="text-accent">
              Grit Up
            </Heading>
          </Heading>
        </div>

        {/* stats card */}
        <div className="flex flex-wrap items-center justify-center gap-4 my-6">
          {/* total problems card */}
          <StatisticalCard
            title="Total Problems"
            value={user.totalSolvedProblems || 0}
            className="flex-1"
          />
          {/* total algorithms card */}
          <StatisticalCard
            title="Mastered Algorithms"
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

        {/* featured problems table */}
        <div className="flex flex-col gap-6 overflow-auto">
          {/* title */}
          <Heading as="h2" size="md" className="text-fg">
            Want Extra Practicing
          </Heading>
          {/* table */}
          <div className="w-full flex flex-col gap-3 items-center justify-center">
            <FeaturedProblems />
          </div>
        </div>
      </article>
    </Bounded>
  );
}

export default page;
