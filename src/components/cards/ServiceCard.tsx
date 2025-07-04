import React from "react";
import Heading from "@/components/common/Heading";
import Image from "next/image";
import Paragraph from "@/components/common/Paragraph";
import Button from "@/components/common/Button";
import clsx from "clsx";

type Props = {
  // Define any props you want to pass to the ServiceCard component
  // For example, you might want to pass a title, description, or image URL
  title?: string;
  description?: string;
  onClick: () => void;
  hrefText?: string;
  className?: string;
  // Add any other props you need
};

function ServiceCard({
  title,
  description,
  onClick,
  hrefText,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        "group relative flex flex-col px-6 pt-6 pb-16 gap-4 rounded-xl bg-bg overflow-hidden min-h-[340px]",
        className
      )}
    >
      {/* title */}
      <div className="flex items-center justify-center">
        <Heading
          as="h3"
          size="title"
          className="relative z-20 text-fg capitalize w-full max-w-[8ch] text-center"
        >
          {title}
        </Heading>
      </div>

      {/* body */}
      <div className="relative z-20 w-full flex-1 flex flex-col items-center">
        <Paragraph
          size="md"
          className="text-surface/60 text-center max-w-[48ch]"
        >
          {description}
        </Paragraph>
      </div>

      {/* CTA */}
      <div className="absolute z-30 left-0 right-0 -bottom-30 h-[32%] flex items-center justify-center group-[:hover]:bottom-0 transition-all duration-300 ease-in-out">
        {/* overlay */}
        <div className="absolute inset-0 bg-bg/30 backdrop-blur-xs blur-sm shadow-xl drop-shadow-2xl " />
        <Button
          variant="accent"
          size="md"
          className="text-center"
          onClick={onClick}
        >
          {hrefText || "Start Now"}
        </Button>
      </div>

      {/* bg image */}
      <div className="absolute z-0 bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
        <Image
          src={"/images/service-bg.png"}
          alt={""}
          width={420}
          height={240}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}

export default ServiceCard;
