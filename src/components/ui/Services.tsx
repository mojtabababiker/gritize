"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/context/AuthProvider";

import Bounded from "@/components/common/Bounded";
import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import ServiceCard from "@/components/cards/ServiceCard";
import AuthDialog from "@/components/auth/AuthDialog";
import QuizRunner from "@/components/quiz/QuizRunner";

const SERVICES = [
  {
    title: "General Algorithms",
    description:
      "Practice general algorithm and familiarize yourself with them, from simple sort search algorithms, to solving real-world scenarios.",
    href: "/dashboard",
    hrefText: "Explore Patterns",
  },
  {
    title: "Coding Techniques",
    description:
      "Understand when (and why) to use sliding windows, binary search, dynamic programming, and more — one concept at a time.",
    href: "/dashboard",
    hrefText: "Start Practicing",
  },
];
function Services() {
  const router = useRouter();
  const [startQuiz, setStartQuiz] = useState(false);
  const [requireLogin, setRequireLogin] = useState(false);
  const { isLoggedIn } = useAuth();

  const onQuizFinish = () => {
    setStartQuiz(false);
    setRequireLogin(true);
  };
  return (
    <Bounded className="services-container">
      <div className="flex flex-col h-full pt-24 pb-8 gap-8">
        {/* title */}
        <Heading as="h2" size="lg" className="text-fg text-center">
          Here, We Gritize Your
          <span className="text-accent text-5xl md:text-6xl text-center font-bold block">
            {" "}
            Mindset
          </span>
        </Heading>

        {/* body */}
        <div className="w-full flex flex-col items-center gap-2">
          <Paragraph className="max-w-[82ch] text-center">
            {`Solving problems isn't about brute-forcing answers—it's about seeing
            the patterns. Gritize helps you internalize the “how” and “why” of
            algorithms, guiding you through:`}
          </Paragraph>
          <ul className="w-full list-disc flex flex-wrap pl-6 font-medium text-base md:text-sm font-heading justify-between items-center gap-6">
            <li>Pattern recognition over memorization</li>
            <li>Step-by-step solution breakdowns</li>
            <li>Real-world techniques used in tech interviews</li>
          </ul>
          <Paragraph
            size="sm"
            variant="quote"
            className="text-surface/60 text-center pt-4"
          >
            Whether you’re tackling general algorithms or mastering the art of
            coding techniques, Gritize is your dojo
          </Paragraph>
        </div>
        {/* cards */}
        <div className="flex flex-col gap-6 mt-4 h-full">
          <div className="flex flex-wrap justify-between gap-4">
            {/* Add services card components here */}
            {SERVICES.map((service, index) => (
              <div key={index} className="flex-1 min-w-full sm:min-w-[360px]">
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  onClick={() => {
                    if (isLoggedIn) {
                      router.push(service.href);
                    } else {
                      setStartQuiz(true);
                    }
                  }}
                  hrefText={service.hrefText}
                  className="self-stretch"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* login dialog */}
      {requireLogin && (
        <AuthDialog
          message="Excellent work! now please signup to save your progress"
          onClose={() => setRequireLogin(false)}
        />
      )}

      {startQuiz && (
        <QuizRunner
          closeQuiz={() => setStartQuiz(false)}
          onFinish={onQuizFinish}
        />
      )}
    </Bounded>
  );
}

export default Services;
