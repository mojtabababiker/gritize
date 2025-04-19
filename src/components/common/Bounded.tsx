"use client";

import clsx from "clsx";
import { HtmlHTMLAttributes } from "react";

// Generic component to wrap content with a bounded layout
// This component is used to create a consistent layout across the application

type Props = HtmlHTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "header" | "footer" | "article";
  children: React.ReactNode;
  className?: string;
};

function Bounded({
  as: Component = "section",
  children,
  className,
  ...props
}: Props) {
  return (
    <Component className={clsx("w-svw h-full", className)} {...props}>
      <div className="w-full max-w-[1440px] px-2 sm:px-4 mx-auto">
        {children}
      </div>
    </Component>
  );
}

export default Bounded;
