"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import clsx from "clsx";

import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import { StarCircle } from "@/components/icons/Star";
import { UserImage } from "@/components/dashboard/UserImage";

type Props = {
  userImageUrl?: string;
  userName: string;
  userTitle: string;
  stars: number;
  testimonial: string;
  className?: string;
};

function TestimonialCard({
  userImageUrl,
  userName,
  userTitle,
  stars,
  testimonial,
  className = "",
}: Props) {
  const [expandText, setExpandText] = useState(false);

  useEffect(() => {
    const closeText = (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) return;
      const target = e.target as HTMLElement;
      if (
        !target.closest(`.testimonial-card-${userName.replace(" ", "-")}`) &&
        !target.closest(`.testimonial-card-text-${userName.replace(" ", "-")}`)
      ) {
        setExpandText(false);
      }
    };

    // Close the text when clicking outside
    document.addEventListener("click", closeText);
    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("click", closeText);
    };
  }, []);
  return (
    <div
      className={clsx(
        "relative flex rounded-2xl bg-bg text-surface overflow-visible w-full max-w-[460px]",
        `testimonial-card-${userName.replace(" ", "-")}`,
        className
      )}
    >
      {/* content */}
      <div className="relative z-20 flex h-full w-full sm:min-h-[240px] bg-bg p-3 rounded-2xl overflow-hidden">
        {/* bg */}
        <div className="absolute z-10 left-0 top-0 bottom-0">
          <Image
            src={"/images/testimonial-card-bg.png"}
            alt=""
            width={230}
            height={230}
            className="origin-right max-w-[120px] sm:max-w-none w-auto h-full rounded-2xl"
          />
        </div>
        {/* header */}
        <div className="z-20 max-w-[120px] sm:max-w-none flex flex-col justify-between items-center py-3">
          {/* image */}
          <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-full overflow-hidden flex items-center justify-center">
            <UserImage
              avatar={userImageUrl}
              username={userName}
              size="md"
              className="text-bg/75 bg-surface/90"
            />
          </div>

          {/* info */}
          <div className="relative z-20 flex flex-col gap-0">
            {/* name */}
            <Heading as="h3" size="sm" className="w-full max-w-[9ch]">
              <span className="font-light ">{userName}</span>
            </Heading>

            {/* title */}
            <Heading as="h4" size="md" className="w-full max-w-[9ch]">
              {userTitle}
            </Heading>
          </div>
        </div>

        {/* review */}
        <div
          className={`testimonial-card-text-${userName.replace(
            " ",
            "-"
          )} z-20 flex flex-col gap-3 justify-center flex-1`}
        >
          {/* stars */}
          <div className="flex gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <StarCircle
                key={i}
                className={`size-5 sm:size-7 ${
                  i < stars ? "text-accent" : "text-fg"
                }`}
              />
            ))}
          </div>
          {/* testimonial */}
          <Paragraph
            size="sm"
            className="peer"
            // title={testimonial}
          >
            <span className="max-w-[32ch] line-clamp-4">{testimonial}</span>
            <button
              className="text-fg italic font-[400] inline sm:hidden"
              onClick={() => setExpandText(true)}
            >
              Keep reading...
            </button>
          </Paragraph>
          {/* all review text */}
          <div
            className={clsx(
              "absolute inset-0 sm:hidden sm:peer-hover:block sm:peer-hover:animate-slide-from-right hover:block",
              expandText ? "block animate-slide-from-right" : "hidden"
            )}
          >
            <div className="absolute w-full max-w-[320px] top-0 bottom-0 right-0 bg-bg/10 backdrop-blur-xl opacity-100 rounded-lg p-3 overflow-auto">
              <Paragraph size="sm" className="">
                {testimonial}
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
      {/* overlay */}
      <div className="absolute z-10 inset-0 bg-surface blur-md" />
    </div>
  );
}

export default TestimonialCard;
