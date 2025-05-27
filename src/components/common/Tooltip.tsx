import clsx from "clsx";
import React from "react";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  children?: React.ReactNode;
  className?: string;
};

function Tooltip({ children, className = "", ...props }: Props) {
  return (
    <div
      className={clsx(
        "absolute z-50 -left-1 -top-8 w-max bg-bg/70 text-fg text-sm p-2 rounded-lg shadow-lg opacity-0 peer-hover:opacity-100 transition-opacity duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Tooltip;
