"use client";

import clsx from "clsx";
import { HtmlHTMLAttributes } from "react";

type Props = HtmlHTMLAttributes<HTMLElement> & {
  as?: "div" | "p" | "span";
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "text" | "quote";
};

function Paragraph({
  as: Component = "p",
  className,
  size = "md",
  children,
  variant = "text",
  ...props
}: Props) {
  return (
    <Component
      className={clsx(
        "font-body",
        size === "sm" && [
          "text-sm sm:text-base md:text-[1rem]",
          "leading-[1.1] sm:leading-[1.15] md:leading-[1.2]",
        ],
        size === "md" && [
          "text-base sm:text-lg md:text-[1.5rem]",
          "leading-relaxed sm:leading-[1.05] md:leading-[1.3]",
        ],
        size === "lg" && [
          "text-lg sm:text-xl md:text-[1.89rem]",
          "leading-[1.2] sm:leading-[1.15] md:leading-[1.35]",
        ],
        variant === "quote" && "font-heading font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Paragraph;
