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
        size === "sm" &&
          "text-[clamp(0.8125rem,5vw_+_0.45rem,1rem)] font-semibold",
        size === "md" &&
          "text-[clamp(1.125rem,5vw_+_0.61rem,1.30rem)] font-semibold",
        size === "lg" && "text-[clamp(1.25rem,5vw_+_0.8125rem,2rem)] font-bold",
        size === "title" &&
          "text-[clamp(2.7rem,5vw_+_1.75rem,4.3rem)] font-black leading-16 md:leading-20 lg:leading-24",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Heading;
