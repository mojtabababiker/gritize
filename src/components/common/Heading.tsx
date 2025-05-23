import clsx from "clsx";
import React, { HtmlHTMLAttributes } from "react";

type Props = HtmlHTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4" | "span";
  className?: string;
  size?: "sm" | "md" | "lg" | "title";
  children: React.ReactNode;
};

function Heading({
  as: Component = "h1",
  className,
  size = "md",
  children,
  ...props
}: Props) {
  return (
    <Component
      className={clsx(
        "font-heading",
        size === "sm" && [
          "text-[clamp(0.75rem,1.5vw,1rem)]",
          "font-semibold",
          "leading-[1.4]",
        ],
        size === "md" && [
          "text-[clamp(1rem,2vw,1.35rem)]",
          "font-semibold",
          "leading-[1.5]",
        ],
        size === "lg" && [
          "text-[clamp(1.25rem,2.5vw,2.25rem)]",
          "font-bold",
          "leading-[1.3]",
        ],
        size === "title" && [
          "text-[clamp(2rem,5vw,4.5rem)]",
          "font-black",
          "leading-[1.1]",
          "tracking-tight",
          "sm:leading-[1.2]",
          "md:leading-[1.3]",
          "lg:leading-[1.4]",
        ],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Heading;
