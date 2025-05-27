"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import Heading from "../common/Heading";

type Props = {
  value: number;
  title: string;
  className?: string;
};

function StatisticalCard({ value, title, className }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const endValue = useRef<number>(value);
  const [currentValue] = useState<number>(endValue.current); // update it to 0 b3den

  useEffect(() => {
    if (!cardRef.current) return;
    /**
     * function that give the look of incrementing the number from 0 to endValue
     * whenever it a visible in view bort
     * @param param0 the entry
     */
    const startCounter = ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && cardRef.current) {
        // start increment
        observer.unobserve(cardRef.current);
      }
    };
    const observer = new IntersectionObserver(startCounter);
    observer.observe(cardRef.current);
  });
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
