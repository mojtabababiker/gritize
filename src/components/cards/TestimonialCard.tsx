"use client";

import Image from "next/image";
import Heading from "../common/Heading";
import Paragraph from "../common/Paragraph";
import { StarCircle } from "../icons/Star";
import clsx from "clsx";

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
  return (
    <div
      className={clsx(
        "relative flex rounded-2xl bg-bg text-surface overflow-visible max-w-[440px]",
        className
      )}
    >
      {/* content */}
      <div className="relative z-20 flex h-full w-full max-w-[440px] min-h-[240px] bg-bg p-3 rounded-2xl ">
        {/* bg */}
        <div className="absolute z-10 left-0 top-0 bottom-0">
          <Image
            src={"/images/testimonial-card-bg.png"}
            alt=""
            width={230}
            height={230}
            className="w-auto h-full object-cover  rounded-2xl"
          />
        </div>
        {/* header */}
        <div className="flex z-20 flex-col justify-between items-center py-3">
          {/* image */}
          <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center">
            {userImageUrl ? (
              <Image
                src={userImageUrl}
                alt={userName}
                width={144}
                height={144}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-full font-heading font-bold text-2xl sm:text-4xl text-bg/75 bg-surface">
                {userName?.at(0) || ""}
              </div>
            )}
          </div>

          {/* info */}
          <div className="relative z-20 flex flex-col items-center gap-0">
            {/* name */}
            <h3 className="font-heading font-light text-xs w-full">
              {userName}
            </h3>

            {/* title */}
            <Heading as="h4" size="md" className="w-full max-w-[9ch]">
              {userTitle}
            </Heading>
          </div>
        </div>

        {/* review */}
        <div className="flex z-20 flex-col gap-3 flex-1">
          {/* stars */}
          <div className="flex gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <StarCircle
                key={i}
                className={`w-7 h-7 ${i < stars ? "text-accent" : "text-fg"}`}
              />
            ))}
          </div>
          {/* testimonial */}
          <Paragraph size="sm" className="max-w-[32ch]">
            {testimonial}
          </Paragraph>
        </div>
      </div>
      {/* overlay */}
      <div className="absolute z-10 inset-0 bg-surface blur-md" />
    </div>
  );
}

export default TestimonialCard;
