"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import clsx from "clsx";

import { useAuth } from "@/context/AuthProvider";

import StatisticalCard from "@/components/cards/StatisticalCard";
import { TableCell, TableRow } from "@/components/cards/TableRow";
import Bounded from "@/components/common/Bounded";
import Heading from "@/components/common/Heading";

function page() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user.id && user.isNewUser) {
      // If the user is new and has no algorithm problems, redirect to create profile
      // This is a temporary solution until we have a better way to handle new users
      router.push("/dashboard/create-profile");
    }
  }, [user.id, user.isNewUser, router]);
  const featuredProblems = [
    {
      title: "Two Sum",
      difficulty: "Easy",
      description:
        "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
      slug: "two-sum",
    },
    {
      title: "Reverse Integer",
      difficulty: "Medium",
      description:
        "Given a 32-bit signed integer, reverse digits of an integer.",
      slug: "reverse-integer",
    },
    {
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      description:
        "Given a string, find the length of the longest substring without repeating characters.",
      slug: "longest-substring-without-repeating-characters",
    },
    {
      title: "Median of Two Sorted Arrays",
      difficulty: "Advanced",
      description:
        "There are two sorted arrays nums1 and nums2 of size m and n respectively. Find the median of the two sorted arrays.",
      slug: "median-of-two-sorted-arrays",
    },
  ];

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
            {featuredProblems.map((problem, index) => (
              <Link
                className="w-full flex items-center ijustify-center"
                href={`/playground?problem=${problem.slug}`}
                key={index}
              >
                <TableRow
                  key={`table-${index}`}
                  className="w-full min-w-[640px] overflow-auto gap-6"
                >
                  {/* problem index */}
                  <TableCell className="text-fg w-10">{index + 1}</TableCell>
                  <TableCell className="text-fg text-center flex-1">
                    {problem.title}
                  </TableCell>
                  <TableCell
                    className={clsx(
                      "text-center w-20",
                      problem.difficulty.startsWith("E") && "text-[#2DDD4A]",
                      problem.difficulty.startsWith("M") && "text-accent",
                      problem.difficulty.startsWith("A") && "text-[#F85151]"
                    )}
                  >
                    {problem.difficulty}
                  </TableCell>
                  <TableCell className="text-fg flex-1/3">
                    {problem.description}
                  </TableCell>
                </TableRow>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </Bounded>
  );
}

export default page;
