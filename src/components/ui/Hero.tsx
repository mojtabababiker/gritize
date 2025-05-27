"use client";
import { useState } from "react";
import Image from "next/image";

import Button from "@/components/common/Button";
import Bounded from "@/components/common/Bounded";
import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import AuthDialog from "@/components/auth/AuthDialog";
import QuizRunner from "@/components/quiz/QuizRunner";

import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { Settings } from "@/constant/setting";
import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";

function Hero() {
  const [startQuiz, setStartQuiz] = useState(false);
  const [requireLogin, setRequireLogin] = useState(false);
  const { isLoggedIn } = useAuth();

  const router = useRouter();

  const onQuizFinish = () => {
    setStartQuiz(false);
    setRequireLogin(true);
  };

  return (
    // Hero section
    <>
      <Bounded className="bg-surface relative overflow-hidden pt-40 md:pt-32 pb-8 ">
        <div className="relative w-full h-[calc(100vh-10rem)] flex items-between justify-between gap-4 bg-fg/30 sm:bg-fg/0">
          {/* text */}
          <div className="relative z-20 flex flex-col w-fit gap-8">
            {/* title */}
            <Heading
              as="h1"
              size="title"
              className="text-bg w-full max-w-[14ch] "
            >
              Your Code Can Speak Louder Than Your Résumé.
            </Heading>

            {/* body */}
            <div className="flex flex-1 flex-col justify-between gap-7">
              <Paragraph
                as="p"
                size="lg"
                className="w-full max-w-[48ch] text-bg"
              >
                Gritize was born out of rejection—not because we didn’t know how
                to code, but because the world asked for experience we couldn’t
                get without someone giving us a chance.{" "}
                <span className="font-semibold"> So we built our own.</span>
              </Paragraph>
              {/* quote */}
              <Paragraph
                as="p"
                size="md"
                variant="quote"
                className="w-full max-w-[36ch] text-bg/75 font-heading font-semibold"
              >
                {`Whether you're breaking into tech or leveling up for your next
                role...`}
              </Paragraph>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap z-10 gap-4 flex-1 items-start content-baseline">
              <Button
                variant="accent"
                size="lg"
                onClick={() => {
                  if (isLoggedIn) {
                    // redirect to dashboard
                    router.push("/dashboard");
                  } else {
                    // otherwise, start the quiz
                    setStartQuiz(true);
                  }
                }}
              >
                Try Gritize
              </Button>
              <Link href={`${Settings.githubRepo}/issues`} target="_blank">
                <Button
                  variant="ghost"
                  size="lg"
                  className="bg-surface flex gap-2 items-center"
                  onClick={() => console.log("Learn More")}
                >
                  Contribute To Platform
                  <SquareArrowOutUpRight className="size-4 sm:size-6 stroke-2 text-bg" />
                </Button>
              </Link>
            </div>
          </div>
          {/* image */}
          <div className="absolute inset-0 w-full md:w-auto opacity-35 md:opacity-100 md:relative flex-1 flex items-center justify-center pointer-events-none">
            <Image
              src="/images/hero.png"
              alt="Gritize Image"
              className="w-auto max-w-[400] h-full"
              // layout="responsive"
              width={500}
              height={300}
            />
          </div>
          {/* floating icons */}
          <div className="float-icons-warper absolute opacity-70 sm:opacity-100 inset-0 pointer-events-none">
            {/* cpp icon */}
            <div className="absolute top-[30%] right-[36%] w-[96px] lg:w-[140px] h-auto flex items-center justify-center opacity-65">
              <Image
                src={"/images/cpp-image.png"}
                alt="C++ Icon"
                className="w-full h-auto"
                width={200}
                height={200}
              />
            </div>
            {/* python */}
            <div className="absolute bottom-[36%] right-[20%] w-[96px] lg:w-[140px] h-auto flex items-center justify-center opacity-65">
              <Image
                src={"/images/python-image.png"}
                alt="Python Icon"
                className="w-full h-auto"
                width={200}
                height={200}
              />
            </div>
            {/* ts icon */}
            <div className="absolute bottom-[10%] right-0 w-[96px] lg:w-[140px] h-auto flex items-center justify-center opacity-65">
              <Image
                src={"/images/typescript-image.png"}
                alt="TypeScript Icon"
                className="w-full h-auto"
                width={200}
                height={200}
              />
            </div>
            {/* js icon */}
            <div className="absolute top-10 right-0 w-[96px] lg:w-[140px] h-auto flex items-center justify-center opacity-65">
              <Image
                src={"/images/javascript-image.png"}
                alt="JavaScript Icon"
                className="w-full h-auto"
                width={200}
                height={200}
              />
            </div>

            {/* floating texts */}
            {/* word 1 */}
            <div className="absolute bottom-[15%] right-[40%] flex items-center justify-center opacity-65 -rotate-12">
              <p className="text-bg font-heading font-semibold text-xl opacity-70">
                Commitment
              </p>
            </div>
            {/* word2 */}
            <div className="absolute top-[43%] right-[32%] flex items-center justify-center opacity-65 -rotate-12">
              <p className="text-accent font-heading font-semibold text-xl opacity-70">
                Disciplined
              </p>
            </div>
            <div className="absolute bottom-[30%] right-[20%] flex items-center justify-center opacity-65">
              <p className="text-accent font-heading font-semibold text-xl opacity-70">
                No Weakness
              </p>
            </div>
          </div>
        </div>
        {/* background overlay */}
        <div className="absolute top-0 bottom-0 -left-4 -right-4 bg-surface/70 md:hidden pointer-events-none" />
      </Bounded>

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
    </>
  );
}

export default Hero;
