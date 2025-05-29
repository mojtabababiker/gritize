"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import Heading from "@/components/common/Heading";

type Props = {
  value: number;
  title: string;
  className?: string;
};

function StatisticalCard({ value, title, className }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const endValue = useRef<number>(value);
  const [currentValue, setCurrentValue] = useState<number>(0);

  useEffect(() => {
    if (!cardRef.current) return;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const countingInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCurrentValue(Math.floor(progress * endValue.current));
      if (progress === 1) {
        clearInterval(countingInterval);
      }
    }, 200);

    return () => {
      clearInterval(countingInterval);
    };
  }, []);
  return (
    <div
      ref={cardRef}
      className={clsx(
        "relative z-20 flex gap-1 min-w-full sm:min-w-[315px] rounded-2xl overflow-hidden px-4 py-8",
        className
      )}
    >
      {/* number */}
      <div className="flex items-center justify-center p-1 text-accent text-6xl sm:text-7xl lg:text-8xl font-body font-black">
        {currentValue}
      </div>

      {/* text */}
      <div className="flex-1 flex items-center">
        <Heading as="h4" size="md" className="text-surface">
          {title}
        </Heading>
      </div>

      {/* overlay */}
      <div className="absolute inset-0 -z-10 pointer-events-none bg-surface/10 blur-md backdrop-blur-md rounded-2xl" />
    </div>
  );
}

export default StatisticalCard;
