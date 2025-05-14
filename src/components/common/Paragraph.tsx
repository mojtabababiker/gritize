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
        size === "sm" &&
          "text-[clamp(0.875rem,5vw_+_0.43rem,1rem)] leading-[clamp(0.875rem,5vw_+_0.43rem,1.5rem)]",
        size === "md" &&
          "text-[clamp(1.25rem,5vw_+_0.686rem,1.5rem)] leading-[clamp(1.25rem,5vw_+_0.686rem,1.5rem)]",
        size === "lg" &&
          "text-[clamp(1.25rem,5vw_+_0.785rem,1.89rem)] leading-[clamp(1.25rem,5vw_+_0.785rem,1.89rem)]",
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
