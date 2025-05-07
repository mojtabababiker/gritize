import clsx from "clsx";
import React, { MouseEventHandler } from "react";

type Props = {
  onResize: MouseEventHandler<HTMLDivElement>;
  direction: "horizontal" | "vertical";
  className?: string;
};

function ResizeRuler({ onResize, direction, className }: Props) {
  return (
    <div
      className={clsx(
        "absolute z-40 bg-bg flex items-center justify-center gap-1",
        direction === "horizontal" && "h-1 cursor-row-resize",
        direction === "vertical" && "w-1 cursor-col-resize flex-col",
        className
      )}
      onMouseDown={onResize}
    >
      <div
        className={clsx(
          "bg-fg/30 rounded-2xl",
          direction === "vertical" ? "h-[4px] w-full" : "h-full w-[4px]"
        )}
      />
      <div
        className={clsx(
          "bg-fg/30 rounded-2xl",
          direction === "vertical" ? "h-[4px] w-full" : "h-full w-[4px]"
        )}
      />
      <div
        className={clsx(
          "bg-fg/30 rounded-2xl",
          direction === "vertical" ? "h-[4px] w-full" : "h-full w-[4px]"
        )}
      />
    </div>
  );
}

export default ResizeRuler;
