import { HTMLAttributes } from "react";
import clsx from "clsx";

type Props = HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
};

export const TableRow = ({ children, className }: Props) => {
  return (
    <div
      className={clsx(
        "flex items-center justify-between px-6 py-4 rounded-2xl bg-primary/25 hover:bg-primary/35 shadow shadow-fg/10 shadow-b transition-all duration-200",
        className
      )}
    >
      {children}
    </div>
  );
};

export const TableCell = ({ children, className }: Props) => {
  return <div className={clsx("", className)}>{children}</div>;
};
