"use client";

import Image from "next/image";
import Heading from "../common/Heading";
import Paragraph from "../common/Paragraph";
import { StarCircle } from "../icons/Star";
import clsx from "clsx";
import { UserImage } from "../dashboard/UserImage";

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
        "relative flex rounded-2xl bg-bg text-surface overflow-visible w-full max-w-[440px]",
        className
      )}
    >
      {/* content */}
      <div className="relative z-20 flex h-full w-full max-w-[440px] sm:min-h-[240px] bg-bg p-3 rounded-2xl ">
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
            <UserImage avatar={userImageUrl} username={userName} size="md" />
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
        <div className="z-20 flex flex-col gap-3 justify-center flex-1">
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
