"use client";
import Image from "next/image";
import Button from "@/components/common/Button";

import Bounded from "@/components/common/Bounded";
import Heading from "../common/Heading";
import Paragraph from "../common/Paragraph";
import { useAuth } from "@/context/AuthProvider";
import { useEffect } from "react";

function Hero() {
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    console.log("User status checked:", isLoggedIn, user);
  }, [isLoggedIn, user]);

  return (
    // Hero section
    <Bounded className="bg-surface overflow-hidden pt-40 md:pt-32 pb-8 ">
      <div className="relative w-full md:min-h-[896px] flex items-between justify-between gap-4 bg-fg/30 sm:bg-fg/0">
        {/* text */}
        <div className="flex-1 flex flex-col justify-center w-full gap-8">
          {/* title */}
          <Heading
            as="h1"
            size="title"
            className="text-bg w-full max-w-[14ch] "
          >
            Your Code Can Speak Louder Than Your Résumé.
          </Heading>

          {/* body */}
          <div className="flex md:flex-1 flex-col justify-between gap-7">
            <Paragraph as="p" size="lg" className="w-full max-w-[48ch] text-bg">
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
              Whether you're breaking into tech or leveling up for your next
              role...
            </Paragraph>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap z-10 gap-4 md:h-[120px] items-center">
            <Button
              variant="accent"
              size="lg"
              onClick={() => console.log("Get Started")}
            >
              Try Gritize
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => console.log("Learn More")}
            >
              Contribute To The Platform
            </Button>
          </div>
        </div>
        {/* image */}
        <div className="absolute inset-0 md:w-auto opacity-45 md:opacity-100 md:relative w-full flex items-center justify-center pointer-events-none ">
          <Image
            src="/images/hero.png"
            alt="Gritize Image"
            className="w-full max-w-[400] h-auto"
            // layout="responsive"
            width={500}
            height={300}
          />
        </div>
        {/* floating icons */}
        <div className="float-icons-warper absolute opacity-70 sm:opacity-100 inset-0 pointer-events-none">
          {/* cpp icon */}
          <div className="absolute top-[30%] right-[36%] w-[96px] sm:w-[140px] h-auto flex items-center justify-center opacity-65">
            <Image
              src={"/images/cpp-image.png"}
              alt="C++ Icon"
              className="w-full h-auto"
              width={200}
              height={200}
            />
          </div>
          {/* python */}
          <div className="absolute bottom-[36%] right-[20%] w-[96px] sm:w-[140px] h-auto flex items-center justify-center opacity-65">
            <Image
              src={"/images/py-image.png"}
              alt="Python Icon"
              className="w-full h-auto"
              width={200}
              height={200}
            />
          </div>
          {/* ts icon */}
          <div className="absolute bottom-[10%] right-0 w-[96px] sm:w-[140px] h-auto flex items-center justify-center opacity-65">
            <Image
              src={"/images/ts-image.png"}
              alt="TypeScript Icon"
              className="w-full h-auto"
              width={200}
              height={200}
            />
          </div>
          {/* js icon */}
          <div className="absolute top-10 right-0 w-[96px] sm:w-[140px] h-auto flex items-center justify-center opacity-65">
            <Image
              src={"/images/js-image.png"}
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
    </Bounded>
  );
}

export default Hero;
